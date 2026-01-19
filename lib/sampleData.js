/**
 * Sample data initialization script
 * Run this once to populate your MongoDB database with initial data
 * This includes products, team members, and QR code metadata
 */

export const sampleProducts = [
    {
        id: 'prod-001',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        category: 'Electronics',
        stock: 50,
        qrCode: 'QR-PROD-001',
        metadata: {
            productionDate: '2025-12-15',
            manufacturer: 'TechAudio Inc.',
            warranty: '2 years',
            purpose: 'Premium audio experience for professionals and audiophiles'
        }
    },
    {
        id: 'prod-002',
        name: 'Smart Fitness Watch',
        description: 'Track your fitness goals with this advanced smartwatch featuring heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life.',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        category: 'Wearables',
        stock: 75,
        qrCode: 'QR-PROD-002',
        metadata: {
            productionDate: '2026-01-05',
            manufacturer: 'FitTech Solutions',
            warranty: '1 year',
            purpose: 'Comprehensive health and fitness tracking for active lifestyle'
        }
    },
    {
        id: 'prod-003',
        name: 'Portable Bluetooth Speaker',
        description: 'Compact yet powerful Bluetooth speaker with 360-degree sound, waterproof design (IPX7), and 12-hour playtime. Perfect for outdoor adventures.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        category: 'Audio',
        stock: 100,
        qrCode: 'QR-PROD-003',
        metadata: {
            productionDate: '2025-11-20',
            manufacturer: 'SoundWave Audio',
            warranty: '1 year',
            purpose: 'Portable high-quality audio for outdoor and indoor use'
        }
    }
];

export const sampleTeam = [
    {
        id: 'team-001',
        name: 'Sarah Johnson',
        role: 'CEO & Founder',
        bio: 'Visionary leader with 10+ years in e-commerce and technology innovation.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        email: 'sarah@example.com'
    },
    {
        id: 'team-002',
        name: 'Michael Chen',
        role: 'CTO',
        bio: 'Technical expert specializing in scalable web applications and cloud architecture.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        email: 'michael@example.com'
    },
    {
        id: 'team-003',
        name: 'Emily Rodriguez',
        role: 'Head of Design',
        bio: 'Creative designer focused on user experience and modern interface design.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        email: 'emily@example.com'
    },
    {
        id: 'team-004',
        name: 'David Kim',
        role: 'Product Manager',
        bio: 'Strategic product leader driving innovation and customer satisfaction.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        email: 'david@example.com'
    }
];

export const teamGoals = {
    mission: 'To provide innovative, high-quality products that enhance daily life through technology.',
    vision: 'Becoming the most trusted e-commerce platform for tech enthusiasts worldwide.',
    values: [
        'Customer First',
        'Innovation',
        'Quality',
        'Sustainability',
        'Transparency'
    ]
};
