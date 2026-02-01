/**
 * Check Purchase Status API
 * Verifies if a user has purchased a specific product
 */

import { parse } from 'cookie';
import { verifyToken } from '../../../lib/auth';
import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const cookies = parse(req.headers.cookie || '');
    const token = cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { productId } = req.query;

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Check if user has any completed orders containing this product
        // Handle both ObjectId and string userId formats, and case-insensitive status
        const orders = await db.collection('orders').find({
            $or: [
                { userId: new ObjectId(decoded.userId) },
                { userId: decoded.userId }
            ],
            status: { $in: ['completed', 'received', 'COMPLETED', 'RECEIVED'] }
        }).toArray();

        const hasPurchased = orders.some(order => {
            return order.items && order.items.some(item => item.productId === productId);
        });

        console.log('=== Purchase Check Debug ===');
        console.log('Product ID:', productId);
        console.log('User ID:', decoded.userId);
        console.log('Orders found:', orders.length);
        console.log('Order items:', JSON.stringify(orders.map(o => ({ orderId: o.orderId, items: o.items })), null, 2));
        console.log('Has Purchased:', hasPurchased);
        console.log('========================');

        return res.status(200).json({ hasPurchased });

    } catch (error) {
        console.error('Error checking purchase status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
