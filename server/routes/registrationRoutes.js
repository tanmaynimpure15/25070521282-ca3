import express from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getStudentRegistrations,
  getEventAttendees
} from '../controllers/registrationController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Student registration operations
router.post('/events/:eventId', requireAuth, registerForEvent);
router.delete('/:registrationId', requireAuth, cancelRegistration);
router.get('/my-registrations', requireAuth, getStudentRegistrations);

// Organizer / Admin attendee roster for an event
router.get('/events/:eventId/attendees', requireAuth, requireRole('organizer', 'admin'), getEventAttendees);

export default router;
