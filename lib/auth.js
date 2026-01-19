/**
 * Authentication Utilities
 * Handles JWT token generation, verification, and password hashing
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';

/**
 * Hash a plain text password
 */
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id || user.id,
            email: user.email,
            role: user.role,
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Get user from request (extracts token from cookies)
 */
export function getUserFromRequest(req) {
    try {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;

        if (!token) {
            return null;
        }

        return verifyToken(token);
    } catch (error) {
        return null;
    }
}

/**
 * Middleware to protect routes
 */
export function requireAuth(handler) {
    return async (req, res) => {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        // Attach user to request
        req.user = user;
        return handler(req, res);
    };
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(handler) {
    return async (req, res) => {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }

        req.user = user;
        return handler(req, res);
    };
}

/**
 * Middleware to require customer role (or admin)
 */
export function requireCustomer(handler) {
    return async (req, res) => {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }

        if (user.role !== 'customer' && user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Customer access required.' });
        }

        req.user = user;
        return handler(req, res);
    };
}
