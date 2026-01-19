/**
 * Change Password API
 * Allows authenticated users to change their password
 */

import clientPromise from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Get user from database
        const dbUser = await db.collection('users').findOne({ email: user.email });

        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, dbUser.password);

        if (!isValidPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.collection('users').updateOne(
            { email: user.email },
            { 
                $set: { 
                    password: hashedNewPassword,
                    passwordResetRequired: false,
                    updatedAt: new Date()
                } 
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({ error: 'Failed to change password' });
    }
}
