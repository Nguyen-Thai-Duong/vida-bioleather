/**
 * Product Management API (Admin Only)
 * POST /api/admin/products - Add new product
 * PUT /api/admin/products - Update product
 * DELETE /api/admin/products - Delete product
 */

import clientPromise from '../../../lib/db';
import { requireAdmin } from '../../../lib/auth';
import { ObjectId } from 'mongodb';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db('ecommerce');

    console.log('Admin Products API called:', req.method);
    console.log('Request body:', req.body);

    try {
        if (req.method === 'POST') {
            // Add new product
            const { name, description, price, image, category, metadata } = req.body;

            console.log('Received product data:', { name, description, price, hasImage: !!image });

            if (!name || !description || !price || !image) {
                console.log('Missing required fields');
                return res.status(400).json({ error: 'Name, description, price, and image are required' });
            }

            const newProduct = {
                id: `prod-${Date.now()}`,
                name,
                description,
                price: parseFloat(price),
                image,
                category: category || 'General',
                metadata: metadata || {
                    productionDate: new Date().toISOString().split('T')[0],
                    manufacturer: 'TechQuality',
                    warranty: '1 year',
                    purpose: 'General use',
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.collection('products').insertOne(newProduct);

            return res.status(201).json({
                success: true,
                message: 'Product added successfully',
                product: newProduct,
            });
        }

        if (req.method === 'PUT') {
            // Update product
            const { productId, name, description, price, image, category, metadata } = req.body;

            console.log('=== PUT REQUEST START ===');
            console.log('productId:', productId);
            console.log('name:', name);
            console.log('description:', description ? description.substring(0, 50) : 'none');
            console.log('price:', price);
            console.log('image received:', image ? 'YES' : 'NO');
            console.log('image length:', image ? image.length : 0);
            console.log('image starts with:', image ? image.substring(0, 30) : 'none');
            console.log('category:', category);
            console.log('metadata:', metadata);

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            // Build update document - ALWAYS include all fields
            const updateData = {
                updatedAt: new Date(),
                name: name,
                description: description,
                price: parseFloat(price),
                image: image,
                category: category || 'General',
                metadata: metadata || {}
            };

            console.log('=== UPDATE DATA ===');
            console.log('updatedAt:', updateData.updatedAt);
            console.log('name:', updateData.name);
            console.log('price:', updateData.price);
            console.log('image in updateData:', updateData.image ? 'YES' : 'NO');
            console.log('image length in updateData:', updateData.image ? updateData.image.length : 0);

            console.log('=== EXECUTING DATABASE UPDATE ===');
            const result = await db.collection('products').updateOne(
                { _id: new ObjectId(productId) },
                { $set: updateData }
            );

            console.log('=== UPDATE RESULT ===');
            console.log('matchedCount:', result.matchedCount);
            console.log('modifiedCount:', result.modifiedCount);
            console.log('acknowledged:', result.acknowledged);

            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Verify the update by fetching the product
            const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(productId) });
            console.log('Verification - Updated product:', {
                name: updatedProduct?.name,
                hasImage: !!updatedProduct?.image,
                imageLength: updatedProduct?.image?.length || 0
            });

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
            });
        }

        if (req.method === 'DELETE') {
            // Delete product
            const { productId } = req.body;

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            const result = await db.collection('products').deleteOne({ _id: new ObjectId(productId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Product management error:', error);
        return res.status(500).json({ error: 'Failed to manage product' });
    }
}

export default requireAdmin(handler);
