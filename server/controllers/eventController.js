import pool from '../db/pool.js';

const VALID_CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Social'];

/**
 * Get all published (approved) events with optional search and category filters
 */
export async function getPublishedEvents(req, res) {
  try {
    const { search, category, sort } = req.query;

    let query = `
      SELECT 
        e.id, 
        e.organizer_id, 
        e.title, 
        e.description, 
        e.category, 
        e.poster_url, 
        e.venue, 
        e.start_at, 
        e.end_at, 
        e.capacity, 
        e.status, 
        e.created_at,
        u.name AS organizer_name,
        COALESCE(r.registered_count, 0)::int AS registered_count,
        GREATEST(e.capacity - COALESCE(r.registered_count, 0), 0)::int AS available_seats
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      LEFT JOIN (
        SELECT event_id, COUNT(*) AS registered_count 
        FROM registrations 
        WHERE status = 'confirmed' 
        GROUP BY event_id
      ) r ON e.id = r.event_id
      WHERE e.status = 'approved'
    `;

    const params = [];

    if (category && category !== 'All') {
      params.push(category);
      query += ` AND e.category = $${params.length}`;
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      query += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length} OR e.venue ILIKE $${params.length})`;
    }

    query += ` ORDER BY e.start_at ASC`;

    const result = await pool.query(query, params);
    res.json({ events: result.rows });
  } catch (error) {
    console.error('Error fetching published events:', error);
    res.status(500).json({ error: 'Failed to retrieve college events.' });
  }
}

/**
 * Get detailed event info by ID
 */
export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const query = `
      SELECT 
        e.*,
        u.name AS organizer_name,
        u.email AS organizer_email,
        COALESCE(r.registered_count, 0)::int AS registered_count,
        GREATEST(e.capacity - COALESCE(r.registered_count, 0), 0)::int AS available_seats,
        CASE 
          WHEN $2::int IS NOT NULL AND reg.id IS NOT NULL THEN true 
          ELSE false 
        END AS is_registered,
        reg.status AS user_registration_status
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      LEFT JOIN (
        SELECT event_id, COUNT(*) AS registered_count 
        FROM registrations 
        WHERE status = 'confirmed' 
        GROUP BY event_id
      ) r ON e.id = r.event_id
      LEFT JOIN registrations reg ON reg.event_id = e.id AND reg.student_id = $2 AND reg.status = 'confirmed'
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = result.rows[0];

    // If event is not approved, only organizer and admin can view it
    if (event.status !== 'approved') {
      if (!req.user || (req.user.id !== event.organizer_id && req.user.role !== 'admin')) {
        return res.status(403).json({ error: 'This event has not been approved yet.' });
      }
    }

    res.json({ event });
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Failed to retrieve event details.' });
  }
}

/**
 * Create a new event (Organizer or Admin)
 */
export async function createEvent(req, res) {
  try {
    const { title, description, category, poster_url, venue, start_at, end_at, capacity } = req.body;

    if (!title || !description || !category || !venue || !start_at || !end_at || !capacity) {
      return res.status(400).json({ error: 'Please provide all required event details.' });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` });
    }

    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      return res.status(400).json({ error: 'Capacity must be a positive integer.' });
    }

    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Valid start and end dates/times are required.' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: 'Event end time must be after the start time.' });
    }

    // Admins auto-approve; Organizers submit as 'pending'
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const insertQuery = `
      INSERT INTO events (organizer_id, title, description, category, poster_url, venue, start_at, end_at, capacity, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      req.user.id,
      title.trim(),
      description.trim(),
      category,
      poster_url ? poster_url.trim() : null,
      venue.trim(),
      startDate.toISOString(),
      endDate.toISOString(),
      capNum,
      initialStatus
    ]);

    res.status(201).json({
      message: initialStatus === 'approved' 
        ? 'Event created and published successfully.' 
        : 'Event submitted for administrator review.',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error while creating event.' });
  }
}

/**
 * Edit an event (Organizer can edit their own event, Admin can edit any)
 */
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, poster_url, venue, start_at, end_at, capacity } = req.body;

    const existingResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = existingResult.rows[0];

    // Authorization check
    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to edit this event.' });
    }

    const capNum = parseInt(capacity || event.capacity, 10);
    if (capNum <= 0) {
      return res.status(400).json({ error: 'Capacity must be greater than zero.' });
    }

    const updateQuery = `
      UPDATE events 
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        poster_url = COALESCE($4, poster_url),
        venue = COALESCE($5, venue),
        start_at = COALESCE($6, start_at),
        end_at = COALESCE($7, end_at),
        capacity = COALESCE($8, capacity)
      WHERE id = $9
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      title ? title.trim() : null,
      description ? description.trim() : null,
      category || null,
      poster_url !== undefined ? poster_url : null,
      venue ? venue.trim() : null,
      start_at || null,
      end_at || null,
      capNum,
      id
    ]);

    res.json({
      message: 'Event updated successfully.',
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Server error while updating event.' });
  }
}

/**
 * Organizer: Get events managed by the authenticated organizer
 */
export async function getOrganizerEvents(req, res) {
  try {
    const query = `
      SELECT 
        e.*,
        COALESCE(r.registered_count, 0)::int AS registered_count,
        GREATEST(e.capacity - COALESCE(r.registered_count, 0), 0)::int AS available_seats
      FROM events e
      LEFT JOIN (
        SELECT event_id, COUNT(*) AS registered_count 
        FROM registrations 
        WHERE status = 'confirmed' 
        GROUP BY event_id
      ) r ON e.id = r.event_id
      WHERE e.organizer_id = $1
      ORDER BY e.created_at DESC
    `;

    const result = await pool.query(query, [req.user.id]);
    res.json({ events: result.rows });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({ error: 'Failed to retrieve your events.' });
  }
}

/**
 * Admin: Get all events awaiting review or all events
 */
export async function getAdminEvents(req, res) {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        e.*,
        u.name AS organizer_name,
        u.email AS organizer_email,
        COALESCE(r.registered_count, 0)::int AS registered_count
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      LEFT JOIN (
        SELECT event_id, COUNT(*) AS registered_count 
        FROM registrations 
        WHERE status = 'confirmed' 
        GROUP BY event_id
      ) r ON e.id = r.event_id
    `;

    const params = [];
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      params.push(status);
      query += ` WHERE e.status = $1`;
    }

    query += ` ORDER BY e.created_at DESC`;

    const result = await pool.query(query, params);
    res.json({ events: result.rows });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    res.status(500).json({ error: 'Failed to retrieve administrative event list.' });
  }
}

/**
 * Admin: Approve or reject an event submission
 */
export async function reviewEvent(req, res) {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected.' });
    }

    const result = await pool.query(
      `UPDATE events 
       SET status = $1, rejection_reason = $2 
       WHERE id = $3 
       RETURNING *`,
      [status, status === 'rejected' ? rejection_reason : null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    res.json({
      message: `Event has been ${status}.`,
      event: result.rows[0]
    });
  } catch (error) {
    console.error('Error reviewing event:', error);
    res.status(500).json({ error: 'Server error while reviewing event.' });
  }
}
