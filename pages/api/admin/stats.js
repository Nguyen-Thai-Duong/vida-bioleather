/**
 * Combined Stats API for Admin Dashboard
 * Returns all stats in a single API call to reduce round trips
 */

import clientPromise from '../../../lib/db';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

        // Fetch all stats in parallel
        const [products, users, orders] = await Promise.all([
            db.collection('products').find({}).toArray(),
            db.collection('users').find({}).toArray(),
            db.collection('orders').find({}).toArray(),
        ]);

        const stats = {
            totalProducts: products.length,
            totalUsers: users.length,
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            receivedOrders: orders.filter(o => o.status === 'received').length,
            completedOrders: orders.filter(o => o.status === 'completed').length,
        };

        return res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch statistics'
        });
    }
}
