import jwt from 'jsonwebtoken';
import pool from '../db/pool.js';

/**
 * Authentication Middleware
 * Checks for token in HTTP-only cookie or Authorization Bearer header.
 */
export async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'sitnagpur_campusconnect_dev_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    // Fetch latest user data from database
    const userResult = await pool.query(
      'SELECT id, name, email, role, account_status, email_verified_at, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }

    const user = userResult.rows[0];

    if (user.account_status !== 'active') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact administrator.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error occurred.' });
  }
}

/**
 * Optional Authentication Middleware
 * If token is present and valid, attaches req.user, otherwise continues as guest.
 */
export async function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'sitnagpur_campusconnect_dev_secret_key_2026';
      const decoded = jwt.verify(token, secret);
      const userResult = await pool.query(
        'SELECT id, name, email, role, account_status, email_verified_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      if (userResult.rows.length > 0 && userResult.rows[0].account_status === 'active') {
        req.user = userResult.rows[0];
      }
    }
  } catch {
    // Guest visitor, continue
  }
  next();
}

/**
 * Role-based Authorization Middleware
 * Enforces that req.user.role is one of the allowed roles.
 * @param {string[]} allowedRoles 
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Requires one of: ${allowedRoles.join(', ')} privileges.` 
      });
    }

    next();
  };
}

