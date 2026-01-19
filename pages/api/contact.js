/**
 * Contact Form API Endpoint
 * POST /api/contact - Submit contact form (can be extended to send emails or store in DB)
 */

import clientPromise from '../../lib/db';

export default async function handler(req, res) {
    try {
        if (req.method === 'POST') {
            const { name, email, subject, message } = req.body;

            // Validate required fields
            if (!name || !email || !message) {
                return res.status(400).json({ error: 'Name, email, and message are required' });
            }

            // Store contact submission in database
            const client = await clientPromise;
            const db = client.db('ecommerce');

            const submission = {
                name,
                email,
                subject: subject || 'No subject',
                message,
                submittedAt: new Date()
            };

            await db.collection('contacts').insertOne(submission);

            return res.status(200).json({
                success: true,
                message: 'Thank you for contacting us! We will get back to you soon.'
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
