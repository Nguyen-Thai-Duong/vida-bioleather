/**
 * Product Reviews API
 * Handles creating and fetching product reviews
 */

import { parse } from 'cookie';
import { verifyToken } from '../../../lib/auth';
import clientPromise from '../../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Get reviews for a specific product
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            const reviews = await db.collection('reviews')
                .find({ productId })
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({ reviews });
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    } else if (req.method === 'POST') {
        // Create a new review
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            // Check if user already reviewed this product
            const existingReview = await db.collection('reviews').findOne({
                productId,
                userId: decoded.userId
            });

            if (existingReview) {
                return res.status(400).json({ error: 'You have already reviewed this product' });
            }

            const newReview = {
                productId,
                userId: decoded.userId,
                userName: decoded.name,
                rating: parseInt(rating),
                comment: comment.trim(),
                createdAt: new Date()
            };

            const result = await db.collection('reviews').insertOne(newReview);
            newReview._id = result.insertedId;

            return res.status(201).json({
                message: 'Review created successfully',
                review: { ...newReview, id: result.insertedId.toString() }
            });

        } catch (error) {
            console.error('Error creating review:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    } else if (req.method === 'DELETE') {
        // Delete a review (user can delete own, admin can delete any)
        const cookies = parse(req.headers.cookie || '');
        const token = cookies.auth_token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const { reviewId } = req.body;

        if (!reviewId) {
            return res.status(400).json({ error: 'Review ID is required' });
        }

        try {
            const client = await clientPromise;
            const db = client.db('ecommerce');

            // Find the review
            const review = await db.collection('reviews').findOne({
                _id: new ObjectId(reviewId)
            });

            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }

            // Check permissions: user can delete own review, admin can delete any
            const isOwner = review.userId === decoded.userId;
            const isAdmin = decoded.role === 'admin';

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ error: 'You do not have permission to delete this review' });
            }

            // Delete the review
            await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId) });

            return res.status(200).json({
                message: 'Review deleted successfully',
                success: true
            });

        } catch (error) {
            console.error('Error deleting review:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
