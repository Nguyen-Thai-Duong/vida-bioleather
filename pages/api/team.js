/**
 * Team API
 * Returns team members and company goals
 */

import clientPromise from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise;
            const db = client.db('ecommerce');
            const teamCollection = db.collection('team');

            // Fetch team members
            const members = await teamCollection.find({}).toArray();

            // If no team members in database, return default data
            if (members.length === 0) {
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
                            bio: "Develops SCOBY bag process, applies technology solutions (QR code, website).",
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
                    goals: {
                        mission: "To replace animal leather with eco-friendly biomaterials, promoting sustainable fashion and reducing environmental impact through SCOBY bioleather innovation.",
                        vision: "To become Southeast Asia's leading sustainable bioleather brand, empowering artisans and creators with ethical, animal-free materials.",
                        values: ["Sustainability", "Innovation", "Ethical Consumption", "Community", "Craftsmanship"]
                    }
                });
            }

            // Return data from database
            res.status(200).json({
                members: members,
                goals: {
                    mission: "To replace animal leather with eco-friendly biomaterials, promoting sustainable fashion and reducing environmental impact through SCOBY bioleather innovation.",
                    vision: "To become Southeast Asia's leading sustainable bioleather brand, empowering artisans and creators with ethical, animal-free materials.",
                    values: ["Sustainability", "Innovation", "Ethical Consumption", "Community", "Craftsmanship"]
                }
            });
        } catch (error) {
            console.error('Error fetching team data:', error);
            res.status(500).json({ error: 'Failed to fetch team data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
