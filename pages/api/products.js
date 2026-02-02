/**
 * Products API
 * Public endpoint to get all products
 */

import clientPromise from '../../lib/db';

export default async function handler(req, res) {
    // Prevent caching to ensure fresh data after updates
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        const { id } = req.query;

        // If ID is provided, get single product
        if (id) {
            const product = await db.collection('products').findOne({ id: id });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found',
                });
            }

            return res.status(200).json(product);
        }

        // Get all products - include images but users can request without them
        const includeImages = req.query.includeImages === 'true';
        const projection = includeImages ? {} : { image: 0 };

        console.log('=== FETCHING ALL PRODUCTS ===');
        console.log('includeImages query param:', req.query.includeImages);
        console.log('includeImages boolean:', includeImages);
        console.log('Projection:', projection);

        const products = await db.collection('products').find({}).project(projection).toArray();

        console.log('Total products fetched:', products.length);
        products.forEach((p, idx) => {
            console.log(`Product ${idx} (${p.name}):`, {
                hasImage: !!p.image,
                imageLength: p.image ? p.image.length : 0,
                imagePreview: p.image ? p.image.substring(0, 30) : 'NO IMAGE'
            });
        });

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch products',
        });
    }
}
