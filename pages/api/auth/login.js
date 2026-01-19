/**
 * Login API Endpoint
 * POST /api/auth/login - Authenticate user and return JWT token
 */

import clientPromise from '../../../lib/db';
import { comparePassword, generateToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Find user by email
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if account is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ error: 'Your account has been blocked. Please contact support.' });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Set cookie
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        res.setHeader('Set-Cookie', cookie);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                ...userWithoutPassword,
                id: userWithoutPassword._id.toString(),
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
}
