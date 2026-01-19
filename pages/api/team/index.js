/**
 * Team API Endpoint
 * GET /api/team - Retrieve all team members and team goals
 */

import clientPromise from '../../../lib/db';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('ecommerce');

        if (req.method === 'GET') {
            const team = await db.collection('team').find({}).toArray();
            const goals = await db.collection('teamGoals').findOne({});

            return res.status(200).json({
                members: team,
                goals: goals || {}
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
