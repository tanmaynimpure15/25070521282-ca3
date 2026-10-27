import express from 'express';
import {
  getPublishedEvents,
  getEventById,
  createEvent,
  updateEvent,
  getOrganizerEvents,
  getAdminEvents,
  reviewEvent
} from '../controllers/eventController.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublishedEvents);
router.get('/:id', optionalAuth, getEventById);

// Organizer routes
router.post('/', requireAuth, requireRole('organizer', 'admin'), createEvent);
router.put('/:id', requireAuth, requireRole('organizer', 'admin'), updateEvent);
router.get('/organizer/my-events', requireAuth, requireRole('organizer', 'admin'), getOrganizerEvents);

// Admin-only review routes
router.get('/admin/all', requireAuth, requireRole('admin'), getAdminEvents);
router.patch('/:id/review', requireAuth, requireRole('admin'), reviewEvent);

export default router;
