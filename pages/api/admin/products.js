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

            console.log('PUT request - productId:', productId);
            console.log('PUT request - image length:', image ? image.length : 'no image');

            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }

            const updateData = {
                updatedAt: new Date(),
            };

            if (name !== undefined) updateData.name = name;
            if (description !== undefined) updateData.description = description;
            if (price !== undefined) updateData.price = parseFloat(price);
            if (image !== undefined) updateData.image = image;
            if (category !== undefined) updateData.category = category;
            if (metadata !== undefined) updateData.metadata = metadata;

            console.log('Update data:', { ...updateData, image: updateData.image ? `base64 string (${updateData.image.length} chars)` : 'no image' });

            const result = await db.collection('products').updateOne(
                { _id: new ObjectId(productId) },
                { $set: updateData }
            );

            console.log('Update result:', { matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });

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
