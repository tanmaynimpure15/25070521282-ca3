import pool from '../db/pool.js';

/**
 * Register student for an event
 * Uses PostgreSQL transactions and row locking (FOR UPDATE) to prevent overbooking and race conditions.
 */
export async function registerForEvent(req, res) {
  const client = await pool.connect();
  try {
    const studentId = req.user.id;
    const eventId = parseInt(req.params.eventId, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    // Require verified email
    if (!req.user.email_verified_at) {
      return res.status(403).json({
        error: 'Email verification required. Please verify your SIT Nagpur email before registering for campus events.'
      });
    }

    await client.query('BEGIN');

    // 1. Lock the event row for update to guarantee strict concurrency and accurate capacity count
    const eventResult = await client.query(
      'SELECT id, title, capacity, status, start_at FROM events WHERE id = $1 FOR UPDATE',
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventResult.rows[0];

    if (event.status !== 'approved') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This event is not open for registration.' });
    }

    // 2. Count active confirmed registrations
    const countResult = await client.query(
      'SELECT COUNT(*)::int AS count FROM registrations WHERE event_id = $1 AND status = $2',
      [eventId, 'confirmed']
    );

    const currentConfirmed = countResult.rows[0].count;

    // 3. Check existing registration for this student
    const existingReg = await client.query(
      'SELECT id, status FROM registrations WHERE event_id = $1 AND student_id = $2',
      [eventId, studentId]
    );

    if (existingReg.rows.length > 0 && existingReg.rows[0].status === 'confirmed') {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'You are already registered for this event.' });
    }

    // 4. Check capacity limit
    if (currentConfirmed >= event.capacity) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Registration closed. This event has reached maximum capacity.' });
    }

    let registrationRecord;
    if (existingReg.rows.length > 0 && existingReg.rows[0].status === 'cancelled') {
      // Re-activate previously cancelled registration
      const updateResult = await client.query(
        'UPDATE registrations SET status = $1, registered_at = NOW() WHERE id = $2 RETURNING *',
        ['confirmed', existingReg.rows[0].id]
      );
      registrationRecord = updateResult.rows[0];
    } else {
      // Insert new registration
      const insertResult = await client.query(
        'INSERT INTO registrations (event_id, student_id, status) VALUES ($1, $2, $3) RETURNING *',
        [eventId, studentId, 'confirmed']
      );
      registrationRecord = insertResult.rows[0];
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: `Successfully registered for ${event.title}!`,
      registration: registrationRecord
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration transaction error:', error);
    res.status(500).json({ error: 'Failed to process event registration.' });
  } finally {
    client.release();
  }
}

/**
 * Cancel a student's registration
 */
export async function cancelRegistration(req, res) {
  try {
    const studentId = req.user.id;
    const { registrationId } = req.params;

    const result = await pool.query(
      `UPDATE registrations 
       SET status = 'cancelled' 
       WHERE id = $1 AND student_id = $2 AND status = 'confirmed'
       RETURNING *`,
      [registrationId, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Confirmed registration not found or already cancelled.' });
    }

    res.json({
      message: 'Registration cancelled successfully. Your seat has been released.',
      registration: result.rows[0]
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration.' });
  }
}

/**
 * Get authenticated student's registrations
 */
export async function getStudentRegistrations(req, res) {
  try {
    const studentId = req.user.id;

    const query = `
      SELECT 
        r.id AS registration_id,
        r.status AS registration_status,
        r.registered_at,
        e.id AS event_id,
        e.title,
        e.description,
        e.category,
        e.venue,
        e.poster_url,
        e.start_at,
        e.end_at,
        e.status AS event_status,
        u.name AS organizer_name
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      JOIN users u ON e.organizer_id = u.id
      WHERE r.student_id = $1
      ORDER BY r.registered_at DESC
    `;

    const result = await pool.query(query, [studentId]);
    res.json({ registrations: result.rows });
  } catch (error) {
    console.error('Error fetching student registrations:', error);
    res.status(500).json({ error: 'Failed to retrieve your registrations.' });
  }
}

/**
 * Get attendee list for an event (Authorized Organizer or Admin only)
 */
export async function getEventAttendees(req, res) {
  try {
    const { eventId } = req.params;

    // Check event ownership
    const eventResult = await pool.query('SELECT organizer_id, title, capacity FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const event = eventResult.rows[0];

    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view attendee records for this event.' });
    }

    const query = `
      SELECT 
        r.id AS registration_id,
        r.status,
        r.registered_at,
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      WHERE r.event_id = $1 AND r.status = 'confirmed'
      ORDER BY r.registered_at ASC
    `;

    const result = await pool.query(query, [eventId]);
    res.json({
      event: {
        id: parseInt(eventId, 10),
        title: event.title,
        capacity: event.capacity,
        total_registered: result.rows.length
      },
      attendees: result.rows
    });
  } catch (error) {
    console.error('Error fetching event attendees:', error);
    res.status(500).json({ error: 'Failed to retrieve attendees.' });
  }
}
