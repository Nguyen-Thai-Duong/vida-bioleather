/**
 * Admin QR Code Generation API
 * Generates ViDa-(DNT)-XXXXX QR codes - independent from products
 */

import clientPromise from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import QRCode from 'qrcode';

async function handler(req, res, user) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { customCode, productName, productDescription, creationDate } = req.body;

        // Validate required fields
        if (!customCode || !productName || !productDescription || !creationDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate custom code (must be one of the predefined options)
        const allowedCodes = ['D', 'N', 'T'];
        const cleanCustomCode = customCode.toUpperCase().trim();
        if (!allowedCodes.includes(cleanCustomCode)) {
            return res.status(400).json({ error: 'Invalid custom code. Must be D, N, or T' });
        }

        const client = await clientPromise;
        const db = client.db('ecommerce');

        // Generate unique ViDa-(DNT)-XXXXX code
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        const qrCodeValue = `ViDa-${cleanCustomCode}-${timestamp}${random}`;

        // Create QR document (separate from products)
        const qrDocument = {
            qrCode: qrCodeValue,
            customCode: cleanCustomCode,
            productName: productName,
            productDescription: productDescription,
            createdAt: new Date(creationDate),
            updatedAt: new Date(),
            createdBy: user?.email || 'Admin',
        };

        // Insert into qr_codes collection
        const result = await db.collection('qr_codes').insertOne(qrDocument);

        // Generate QR code image
        const qrImage = await QRCode.toDataURL(qrCodeValue, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return res.status(200).json({
            success: true,
            message: 'QR code generated successfully',
            qrCode: qrCodeValue,
            qrImage,
            data: {
                id: result.insertedId,
                qrCode: qrCodeValue,
                productName: qrDocument.productName,
                createdAt: qrDocument.createdAt,
            },
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to generate QR code',
        });
    }
}

export default requireAdmin(handler);
