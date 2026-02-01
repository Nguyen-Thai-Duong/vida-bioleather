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

            // If no team members in database, return default VIDA team data
            if (!team || team.length === 0) {
                return res.status(200).json({
                    members: [
                        {
                            id: 1,
                            name: "Le Thi To Nhu",
                            role: "CEO – Chief Executive Officer",
                            bio: "Oversees all activities, assigns tasks, and sets short-term and long-term strategies.",
                            email: "nhu@vidabioleather.com"
                        },
                        {
                            id: 2,
                            name: "Nguyen Thai Duong",
                            role: "CTO – Chief Technology Officer",
                            bio: "Develops SCOBY charm process, applies technology solutions (QR code, website).",
                            email: "duong@vidabioleather.com"
                        },
                        {
                            id: 3,
                            name: "Nguyen Ngoc Thu Trang",
                            role: "COO – Chief Operating Officer",
                            bio: "Manages production, materials, and supply chain operations.",
                            email: "trang@vidabioleather.com"
                        },
                        {
                            id: 4,
                            name: "Nguyen Ngoc Han",
                            role: "CMO – Chief Marketing Officer",
                            bio: "Leads marketing campaigns and customer outreach.",
                            email: "han@vidabioleather.com"
                        },
                        {
                            id: 5,
                            name: "Nguyen Thu Minh",
                            role: "CFO – Chief Financial Officer",
                            bio: "Handles budgeting, costing, and financial planning.",
                            email: "minh@vidabioleather.com"
                        }
                    ],
                    goals: goals || {
                        mission: "To replace animal leather with eco-friendly biomaterials, promoting sustainable fashion and reducing environmental impact through SCOBY bioleather innovation.",
                        vision: "To become Southeast Asia's leading sustainable bioleather brand, empowering artisans and creators with ethical, animal-free materials.",
                        values: ["Sustainability", "Innovation", "Ethical Consumption", "Community", "Craftsmanship"]
                    }
                });
            }

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
