/**
 * Product Image API Endpoint
 * GET /api/products/[id]/image - Retrieve product image
 */

import clientPromise from '../../../../lib/db';

export default async function handler(req, res) {
    try {
        const { id } = req.query;

        console.log('=== IMAGE API REQUEST ===');
        console.log('Product ID:', id);
        console.log('Method:', req.method);

        if (req.method === 'GET') {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            console.log('Querying database for product:', id);
            const product = await db.collection('products').findOne(
                { id },
                { projection: { image: 1, name: 1 } }
            );

            console.log('Product found:', product ? 'YES' : 'NO');
            console.log('Product name:', product?.name);
            console.log('Has image:', !!product?.image);
            console.log('Image length:', product?.image?.length || 0);

            if (!product || !product.image) {
                console.error('Image not found for product:', id);
                return res.status(404).json({ error: 'Image not found' });
            }

            // Return base64 string directly for use in <img> tags
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

            console.log('Returning image successfully');
            return res.status(200).json({ image: product.image });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
