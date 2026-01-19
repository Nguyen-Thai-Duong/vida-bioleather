/**
 * QR Code Generation API Endpoint
 * GET /api/qr/generate?productId=xxx - Generate QR code image for a product
 */

import QRCode from 'qrcode';
import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        if (req.method === 'GET') {
            const { productId } = req.query;

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            // Find product by ID
            const product = await db.collection('products').findOne({ id: productId });

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Generate QR code that redirects to the product page
            const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${productId}`;

            // Generate QR code as data URL
            const qrCodeDataUrl = await QRCode.toDataURL(productUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            return res.status(200).json({
                qrCode: qrCodeDataUrl,
                qrCodeValue: product.qrCode,
                productUrl: productUrl
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
