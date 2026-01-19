/**
 * Logout API Endpoint
 * POST /api/auth/logout - Clear authentication cookie
 */

import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Clear auth cookie
        const cookie = serialize('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        res.setHeader('Set-Cookie', cookie);

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: 'Logout failed. Please try again.' });
    }
}
