/**
 * QR Code Search API Endpoint
 * GET /api/qr/search?code=xxx - Search for item by QR code value in qr_codes collection
 */

import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        if (req.method === 'GET') {
            const { code } = req.query;

            if (!code) {
                return res.status(400).json({ error: 'QR code value is required' });
            }

            // Find item by QR code in qr_codes collection
            const qrItem = await db.collection('qr_codes').findOne({ qrCode: code });

            if (!qrItem) {
                return res.status(404).json({
                    success: false,
                    error: 'QR code not found'
                });
            }

            // Return QR item information
            return res.status(200).json({
                success: true,
                data: {
                    id: qrItem._id,
                    qrCode: qrItem.qrCode,
                    customCode: qrItem.customCode,
                    productName: qrItem.productName,
                    productDescription: qrItem.productDescription,
                    createdAt: qrItem.createdAt,
                    createdBy: qrItem.createdBy,
                }
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
