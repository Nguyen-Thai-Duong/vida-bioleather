/**
 * Database Initialization API Endpoint
 * GET /api/init - Initialize database with sample data
 * WARNING: This should only be run once in development to populate the database
 */

import clientPromise from '../../lib/db';
import { sampleProducts, sampleTeam, teamGoals } from '../../lib/sampleData';
import { hashPassword } from '../../lib/auth';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            // Check if data already exists
            const existingProducts = await db.collection('products').countDocuments();

            if (existingProducts > 0) {
                return res.status(200).json({
                    message: 'Database already initialized',
                    note: 'Delete existing data first if you want to reinitialize'
                });
            }

            // Insert sample products
            await db.collection('products').insertMany(sampleProducts);

            // Insert team members
            await db.collection('team').insertMany(sampleTeam);

            // Insert team goals
            await db.collection('teamGoals').insertOne({
                ...teamGoals,
                createdAt: new Date()
            });

            // Create default admin user
            const adminPassword = await hashPassword('admin123'); // Change this password!
            await db.collection('users').insertOne({
                name: 'Admin User',
                email: 'admin@vidabioleather.com',
                password: adminPassword,
                phone: '+84 (028) 3456-7890',
                address: 'FPT University Can Tho Campus, Can Tho City, Vietnam',
                role: 'admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Create sample customer user
            const customerPassword = await hashPassword('customer123');
            await db.collection('users').insertOne({
                name: 'John Doe',
                email: 'customer@example.com',
                password: customerPassword,
                phone: '+1 (555) 987-6543',
                address: '456 Customer Ave, Tech City, CA 94001',
                role: 'customer',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return res.status(200).json({
                success: true,
                message: 'Database initialized successfully',
                data: {
                    products: sampleProducts.length,
                    teamMembers: sampleTeam.length,
                    users: 2
                },
                credentials: {
                    admin: {
                        email: 'admin@techquality.com',
                        password: 'admin123'
                    },
                    customer: {
                        email: 'customer@example.com',
                        password: 'customer123'
                    }
                }
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
