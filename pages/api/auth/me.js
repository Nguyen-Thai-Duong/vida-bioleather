/**
 * Get Current User API Endpoint
 * GET /api/auth/me - Get currently authenticated user
 */

import { getUserFromRequest } from '../../../lib/auth';
import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const tokenData = getUserFromRequest(req);

        if (!tokenData) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Fetch fresh user data from database
        const client = await clientPromise;
        const db = client.db('ecommerce');

        const user = await db.collection('users').findOne({
            _id: new ObjectId(tokenData.userId)
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if account is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ error: 'Your account has been blocked' });
        }

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            user: {
                ...userWithoutPassword,
                id: userWithoutPassword._id.toString(),
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ error: 'Failed to get user data' });
    }
}
