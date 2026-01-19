/**
 * User Profile API (Customer)
 * GET /api/profile - Get user profile
 * PUT /api/profile - Update user profile
 */

import clientPromise from '../../lib/db';
import { requireCustomer } from '../../lib/auth';
import { ObjectId } from 'mongodb';

async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('ecommerce');

    try {
        const userId = req.user.userId;

        if (req.method === 'GET') {
            // Get user profile
            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json({
                user: {
                    ...userWithoutPassword,
                    id: user._id.toString(),
                },
            });
        }

        if (req.method === 'PUT') {
            // Update user profile
            const { name, phone, address } = req.body;

            const updateData = {
                updatedAt: new Date(),
            };

            if (name) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;

            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Get updated user
            const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(userId) });
            const { password, ...userWithoutPassword } = updatedUser;

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    ...userWithoutPassword,
                    id: updatedUser._id.toString(),
                },
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Profile error:', error);
        return res.status(500).json({ error: 'Failed to process profile request' });
    }
}

export default requireCustomer(handler);
