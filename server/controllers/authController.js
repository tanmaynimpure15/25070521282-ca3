import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../db/pool.js';
import { validateCollegeEmail, normalizeEmail } from '../utils/emailValidator.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sitnagpur_campusconnect_dev_secret_key_2026';

function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * Register a new student account
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'College email is required.' });
    }

    // Official SIT Nagpur email verification rule
    const emailValidation = validateCollegeEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    const normalizedEmail = emailValidation.normalized;

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    // Check existing email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this college email already exists. Please log in.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Insert user: role is strictly 'student', never allowed to self-grant organizer/admin
    const insertResult = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, account_status, verification_token, email_verified_at)
       VALUES ($1, $2, $3, 'student', 'active', $4, NULL)
       RETURNING id, name, email, role, email_verified_at, created_at`,
      [name.trim(), normalizedEmail, passwordHash, verificationToken]
    );

    const newUser = insertResult.rows[0];

    // Generate session token
    const token = generateToken(newUser.id, newUser.role);
    setTokenCookie(res, token);

    // Return user info along with the verification token/link for immediate simulation/display
    res.status(201).json({
      message: 'Account created successfully. Please verify your college email address to register for events.',
      user: newUser,
      verificationToken,
      verificationLink: `/verify-email?token=${verificationToken}`
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error while processing registration.' });
  }
}

/**
 * Log in with college email and password
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Both email and password are required.' });
    }

    const normalizedEmail = normalizeEmail(email);

    const userResult = await pool.query(
      'SELECT id, name, email, password_hash, role, account_status, email_verified_at FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid college email or password.' });
    }

    const user = userResult.rows[0];

    if (user.account_status !== 'active') {
      return res.status(403).json({ error: 'This account is suspended. Contact the campus administration.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid college email or password.' });
    }

    const token = generateToken(user.id, user.role);
    setTokenCookie(res, token);

    const { password_hash, ...safeUser } = user;
    res.json({
      message: 'Logged in successfully.',
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
}

/**
 * Verify Email with token
 */
export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is missing.' });
    }

    const userResult = await pool.query(
      'SELECT id, name, email, email_verified_at FROM users WHERE verification_token = $1',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired email verification link.' });
    }

    const user = userResult.rows[0];

    await pool.query(
      'UPDATE users SET email_verified_at = NOW(), verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.json({
      message: 'College email successfully verified! You can now register for campus events.',
      email: user.email
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error during email verification.' });
  }
}

/**
 * Log out
 */
export async function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully.' });
}

/**
 * Current User Profile
 */
export async function getMe(req, res) {
  res.json({ user: req.user });
}

/**
 * Admin: List all users
 */
export async function listUsers(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, account_status, email_verified_at, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
}

/**
 * Admin: Update user role
 */
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'organizer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be student, organizer, or admin.' });
    }

    // Do not allow an admin to demote themselves to avoid locking out the system
    if (parseInt(id, 10) === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot revoke your own administrator privileges.' });
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: `User role updated to ${role} successfully.`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update user role.' });
  }
}
