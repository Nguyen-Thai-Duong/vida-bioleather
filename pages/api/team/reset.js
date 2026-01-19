/**
 * Reset Team Data API
 * Clears team collection to use default data
 */

import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'POST' || req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            // Clear the team collection
            await db.collection('team').deleteMany({});

            return res.status(200).json({
                success: true,
                message: 'Team data cleared. Refresh the team page to see default 5 members.'
            });
        } catch (error) {
            console.error('Error resetting team data:', error);
            return res.status(500).json({ error: 'Failed to reset team data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
