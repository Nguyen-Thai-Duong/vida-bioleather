/**
 * Forgot Password API
 * Generates a temporary password and emails it to the user
 */

import clientPromise from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Find user
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });

        if (!user) {
            // For security, don't reveal if user exists
            return res.status(200).json({
                success: true,
                message: 'If that email is registered, password reset instructions have been sent'
            });
        }

        // Generate temporary password (8 characters)
        const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Update user with temporary password
        await db.collection('users').updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    password: hashedPassword,
                    passwordResetRequired: true,
                    updatedAt: new Date()
                }
            }
        );

        // In a real application, you would send an email here
        // For now, we'll log it to console (DEVELOPMENT ONLY)
        console.log('===========================================');
        console.log(`PASSWORD RESET FOR: ${email}`);
        console.log(`TEMPORARY PASSWORD: ${tempPassword}`);
        console.log('===========================================');

        return res.status(200).json({
            success: true,
            message: 'Password reset instructions have been sent to your email',
            // TEMPORARY: Include password in response for development
            // REMOVE THIS IN PRODUCTION
            tempPassword: tempPassword
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ error: 'Failed to process password reset' });
    }
}
