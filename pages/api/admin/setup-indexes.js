/**
 * Database Indexes Setup API
 * Creates indexes on collections for better query performance
 * Run this once to optimize your database
 */

import clientPromise from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check admin authentication
        const user = getUserFromRequest(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized. Please login.' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Create indexes for better performance
        const results = [];

        // Products indexes
        await db.collection('products').createIndex({ id: 1 });
        await db.collection('products').createIndex({ name: 'text', description: 'text' });
        results.push('Products indexes created');

        // Users indexes
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('users').createIndex({ userId: 1 }, { unique: true });
        results.push('Users indexes created');

        // Orders indexes
        await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
        await db.collection('orders').createIndex({ userId: 1 });
        await db.collection('orders').createIndex({ status: 1 });
        await db.collection('orders').createIndex({ createdAt: -1 });
        results.push('Orders indexes created');

        // Team indexes
        await db.collection('team').createIndex({ id: 1 });
        results.push('Team indexes created');

        return res.status(200).json({
            success: true,
            message: 'Database indexes created successfully',
            results
        });
    } catch (error) {
        console.error('Error creating indexes:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create indexes: ' + error.message
        });
    }
}
