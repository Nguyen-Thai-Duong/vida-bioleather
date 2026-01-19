/**
 * Registration API Endpoint
 * POST /api/auth/register - Register a new user as customer
 */

import clientPromise from '../../../lib/db';
import { hashPassword, generateToken } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, password, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone: phone || '',
            address: address || '',
            role: 'customer', // All registrations create customer accounts
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection('users').insertOne(newUser);
        newUser._id = result.insertedId;

        // Generate JWT token
        const token = generateToken(newUser);

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
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                ...userWithoutPassword,
                id: userWithoutPassword._id.toString(),
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
}
