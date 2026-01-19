/**
 * Orders API
 * GET /api/orders - Get orders (customer: own orders, admin: all orders)
 * POST /api/orders - Create new order (customer only)
 * PATCH /api/orders - Update order status (admin) or cancel order (customer)
 */

import clientPromise from '../../lib/db';
import { requireCustomer, requireAdmin, getUserFromRequest } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('ecommerce');

    try {
        const user = getUserFromRequest(req);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (req.method === 'GET') {
            // Get orders
            let orders;

            if (user.role === 'admin') {
                // Admin can see all orders
                orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
            } else {
                // Customers see only their orders
                orders = await db.collection('orders')
                    .find({ userId: user.userId })
                    .sort({ createdAt: -1 })
                    .toArray();
            }

            return res.status(200).json({ orders });
        }

        if (req.method === 'POST') {
            // Create new order (customers only)
            if (user.role !== 'customer' && user.role !== 'admin') {
                return res.status(403).json({ error: 'Only customers can place orders' });
            }

            const { items, shippingInfo, totalAmount } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ error: 'Order must contain items' });
            }

            if (!shippingInfo || !totalAmount) {
                return res.status(400).json({ error: 'Shipping info and total amount are required' });
            }

            const newOrder = {
                orderId: `ORD-${Date.now()}`,
                userId: user.userId,
                userName: user.name,
                userEmail: user.email,
                items,
                shippingInfo,
                totalAmount: parseFloat(totalAmount),
                status: 'pending', // pending, received, completed, rejected
                adminNotes: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.collection('orders').insertOne(newOrder);

            return res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                order: newOrder,
            });
        }

        if (req.method === 'PATCH') {
            const { orderId, status, adminNotes, action } = req.body;

            if (!orderId) {
                return res.status(400).json({ error: 'Order ID is required' });
            }

            const order = await db.collection('orders').findOne({ orderId });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Admin updating order
            if (user.role === 'admin') {
                const updateData = { updatedAt: new Date() };

                if (status) {
                    if (!['pending', 'received', 'completed', 'rejected'].includes(status)) {
                        return res.status(400).json({ error: 'Invalid status. Must be: pending, received, completed, or rejected' });
                    }
                    updateData.status = status;
                }

                if (adminNotes !== undefined) {
                    updateData.adminNotes = adminNotes;
                }

                await db.collection('orders').updateOne(
                    { orderId },
                    { $set: updateData }
                );

                return res.status(200).json({
                    success: true,
                    message: 'Order updated successfully',
                });
            }

            // Customer cancelling their own order
            if (order.userId !== user.userId) {
                return res.status(403).json({ error: 'You can only cancel your own orders' });
            }

            if (action === 'cancel') {
                // Can only cancel if status is pending
                if (order.status !== 'pending') {
                    return res.status(400).json({
                        error: 'You can only cancel orders that are still pending',
                    });
                }

                await db.collection('orders').updateOne(
                    { orderId },
                    {
                        $set: {
                            status: 'cancelled',
                            updatedAt: new Date(),
                        },
                    }
                );

                return res.status(200).json({
                    success: true,
                    message: 'Order cancelled successfully',
                });
            }

            return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Orders error:', error);
        return res.status(500).json({ error: 'Failed to process order request' });
    }
}
