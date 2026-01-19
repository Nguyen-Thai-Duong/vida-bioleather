/**
 * Products API Endpoint
 * GET /api/products - Retrieve all products
 * GET /api/products?id=xxx - Retrieve a specific product by ID
 */

import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        if (req.method === 'GET') {
            const { id, search } = req.query;

            // Get specific product by ID
            if (id) {
                const product = await db.collection('products').findOne({ id });
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                return res.status(200).json(product);
            }

            // Search products by name or description
            if (search) {
                const products = await db.collection('products')
                    .find({
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } }
                        ]
                    })
                    .toArray();
                return res.status(200).json(products);
            }

            // Get all products
            const products = await db.collection('products').find({}).toArray();
            return res.status(200).json(products);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
