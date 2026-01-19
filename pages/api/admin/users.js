/**
 * Users Management API (Admin Only)
 * GET /api/admin/users - Get all users
 * PATCH /api/admin/users - Update user status (block/unblock), role, or reset password
 */

import clientPromise from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('ecommerce');

    try {
        if (req.method === 'GET') {
            // Get all users
            const users = await db.collection('users').find({}).toArray();

            // Remove passwords from response
            const usersWithoutPasswords = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return {
                    ...userWithoutPassword,
                    id: user._id.toString(),
                };
            });

            return res.status(200).json({ users: usersWithoutPasswords });
        }

        if (req.method === 'PATCH') {
            const { userId, status, role, resetPassword } = req.body;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const updateData = { updatedAt: new Date() };

            // Handle status update
            if (status) {
                if (!['active', 'blocked'].includes(status)) {
                    return res.status(400).json({ error: 'Invalid status. Must be active or blocked' });
                }
                updateData.status = status;
            }

            // Handle role update
            if (role) {
                if (!['customer', 'admin'].includes(role)) {
                    return res.status(400).json({ error: 'Invalid role. Must be customer or admin' });
                }
                updateData.role = role;
            }

            // Handle password reset
            if (resetPassword) {
                const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
                const hashedPassword = await bcrypt.hash(tempPassword, 10);
                updateData.password = hashedPassword;
                updateData.passwordResetRequired = true;

                // Log for development (remove in production)
                console.log('===========================================');
                console.log(`PASSWORD RESET BY ADMIN`);
                console.log(`USER ID: ${userId}`);
                console.log(`TEMPORARY PASSWORD: ${tempPassword}`);
                console.log('===========================================');

                // Update user
                const result = await db.collection('users').updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Password reset successfully',
                    tempPassword: tempPassword // TEMPORARY: For development only
                });
            }

            // Update user
            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateData }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            let message = 'User updated successfully';
            if (status) message = `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`;
            if (role) message = 'User role updated successfully';

            return res.status(200).json({
                success: true,
                message: message,
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('User management error:', error);
        return res.status(500).json({ error: 'Failed to manage users' });
    }
}

export default requireAdmin(handler);
