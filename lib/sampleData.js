/**
 * Sample data initialization script
 * Run this once to populate your MongoDB database with initial data
 * This includes products, team members, and QR code metadata
 */

export const sampleProducts = [
    {
        id: 'prod-001',
        name: 'Raw Scoby Leather',
        description: 'Premium raw SCOBY leather sheet, perfect for crafting unique accessories and fashion items. Sustainably grown from kombucha culture, this eco-friendly material offers a guilt-free alternative to traditional leather.',
        price: 299.99,
        image: '/products/raw-scoby-leather.jpg',
        category: 'Raw Materials',
        stock: 50,
        qrCode: 'QR-PROD-001',
        metadata: {
            productName: 'Raw Scoby Leather',
            category: 'Raw Biomaterial',
            materialOrigin: 'Kombucha SCOBY, organically grown',
            sizeWeight: '30cm x 40cm, approximately 200g',
            features: 'Flexible, durable, breathable\nNatural texture with unique patterns\nBiodegradable and eco-friendly',
            usageApplication: 'Fashion accessories (bags, wallets, belts)\nCrafts and DIY projects\nArt installations',
            keySellingPoints: '100% sustainable and vegan\nZero animal harm\nUnique organic appearance'
        }
    },
    {
        id: 'prod-002',
        name: 'Starter Liquid',
        description: 'Premium kombucha starter liquid to kickstart your SCOBY leather production. This carefully cultured liquid contains the essential microorganisms needed for healthy SCOBY growth.',
        price: 199.99,
        image: '/products/starter-liquid.jpg',
        category: 'Cultivation',
        stock: 75,
        qrCode: 'QR-PROD-002',
        metadata: {
            productName: 'Starter Liquid',
            category: 'SCOBY Cultivation',
            materialOrigin: 'Fermented kombucha culture',
            sizeWeight: '500ml bottle',
            features: 'Active microbial culture\nPH balanced for optimal growth\nOrganic ingredients',
            usageApplication: 'SCOBY leather production\nKombucha brewing\nBiomaterial cultivation',
            keySellingPoints: 'Accelerates SCOBY growth\nHigh success rate\nOrganic and safe'
        }
    },
    {
        id: 'prod-003',
        name: 'Scoby Charm',
        description: 'Handcrafted decorative charm made from dried SCOBY leather. Each piece is unique with natural patterns and textures. A perfect sustainable accessory or gift.',
        price: 89.99,
        image: '/products/scoby-charm.jpg',
        category: 'Accessories',
        stock: 100,
        qrCode: 'QR-PROD-003',
        metadata: {
            productName: 'Scoby Charm',
            category: 'Finished Product',
            materialOrigin: '100% SCOBY leather',
            sizeWeight: '5cm x 7cm, lightweight',
            features: 'Unique natural patterns\nLightweight and durable\nHandcrafted with care',
            usageApplication: 'Bag charm\nKeychain decoration\nJewelry accessory',
            keySellingPoints: 'Eco-friendly fashion statement\nConversation starter\nSupports sustainable innovation'
        }
    }
];

export const sampleTeam = [
    {
        id: 'team-001',
        name: 'Nguyen Thi Duong',
        role: 'CEO & Founder',
        bio: 'Develops SCOBY charm process, applies technology solutions (QR code, website).',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        email: 'duongntce180478@fpt.edu.vn'
    },
    {
        id: 'team-002',
        name: 'Tran Van Minh',
        role: 'CTO',
        bio: 'Technical expert specializing in biomaterial innovation and sustainable production.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        email: 'minh@vidabioleather.com'
    },
    {
        id: 'team-003',
        name: 'Le Thi Hoa',
        role: 'Head of Design',
        bio: 'Creative designer focused on sustainable fashion and bioleather applications.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        email: 'hoa@vidabioleather.com'
    },
    {
        id: 'team-004',
        name: 'Pham Hoang Nam',
        role: 'Product Manager',
        bio: 'Strategic product leader driving sustainable innovation and eco-conscious solutions.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        email: 'nam@vidabioleather.com'
    }
];

export const teamGoals = {
    mission: 'To replace animal leather with eco-friendly biomaterials, promoting sustainable fashion and reducing environmental impact through SCOBY bioleather innovation.',
    vision: 'Becoming the global leader in sustainable bioleather production and education.',
    values: [
        'Sustainability',
        'Innovation',
        'Zero Harm',
        'Education',
        'Community'
    ]
};
