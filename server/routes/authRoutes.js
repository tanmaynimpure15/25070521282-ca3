import express from 'express';
import { 
  register, 
  login, 
  logout, 
  verifyEmail, 
  getMe, 
  listUsers, 
  updateUserRole 
} from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.get('/me', requireAuth, getMe);

// Admin-only user management
router.get('/users', requireAuth, requireRole('admin'), listUsers);
router.patch('/users/:id/role', requireAuth, requireRole('admin'), updateUserRole);

export default router;
