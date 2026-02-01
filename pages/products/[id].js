/**
 * Product Detail Page
 * Displays full product information and metadata
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [scrollY, setScrollY] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
    const [hasPurchased, setHasPurchased] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const addItem = useCartStore((state) => state.addItem);
    const { user, isAuthenticated } = useAuthStore();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchReviews();
            if (isAuthenticated) {
                checkPurchaseStatus();
            }
        }
    }, [id, isAuthenticated]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products?id=${id}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?productId=${id}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);

                // Check if current user has already reviewed this product
                if (isAuthenticated && user) {
                    const userHasReviewed = data.reviews.some(review => review.userId === user.userId);
                    setHasReviewed(userHasReviewed);
                }
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const checkPurchaseStatus = async () => {
        console.log('Checking purchase status for product:', id, 'User authenticated:', isAuthenticated);
        try {
            const response = await fetch(`/api/reviews/check-purchase?productId=${id}`);
            console.log('Purchase check response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Purchase check result:', data);
                setHasPurchased(data.hasPurchased);
            } else {
                const errorData = await response.json();
                console.error('Purchase check failed:', errorData);
            }
        } catch (error) {
            console.error('Error checking purchase status:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !hasPurchased) return;

        setSubmittingReview(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: id,
                    rating: userReview.rating,
                    comment: userReview.comment
                })
            });

            if (response.ok) {
                setUserReview({ rating: 5, comment: '' });
                setHasReviewed(true);
                fetchReviews();
                showToast('Review submitted successfully!', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to submit review', 'error');
            }
        } catch (error) {
            alert('Error submitting review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const response = await fetch('/api/reviews', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId })
            });

            if (response.ok) {
                // If user deleted their own review, allow them to review again
                if (user && reviews.find(r => r._id === reviewId && r.userId === user.userId)) {
                    setHasReviewed(false);
                }
                fetchReviews();
                showToast('Review deleted successfully!', 'success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to delete review', 'error');
            }
        } catch (error) {
            showToast('Error deleting review', 'error');
        }
    };

    const handleAddToCart = () => {
        if (product) {
            for (let i = 0; i < quantity; i++) {
                addItem(product);
            }
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-emerald-500/30"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{product.name} - VIDA Bioleather</title>
                <meta name="description" content={product.description} />
            </Head>

            {/* Dynamic Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-16 overflow-hidden">
                <div className="absolute inset-0">
                    <div
                        className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    ></div>
                    <div
                        className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
                    ></div>
                </div>
                <div className="container mx-auto px-8 relative z-10">
                    {/* Breadcrumb */}
                    <nav className="mb-6 text-sm flex items-center gap-2">
                        <Link href="/" className="text-emerald-300 hover:text-emerald-200 transition-colors font-semibold">
                            Home
                        </Link>
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-emerald-100 font-semibold">{product.name}</span>
                    </nav>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            {product.name}
                        </span>
                    </h1>
                </div>
            </section>

            <div className="container mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Product Image */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {product.price ? product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}₫
                            </span>
                            {reviews.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-5 h-5 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 font-semibold">({reviews.length} reviews)</span>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-black text-gray-800 mb-3">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 font-black text-xl hover:scale-110 shadow-md"
                                >
                                    -
                                </button>
                                <span className="text-2xl font-black w-16 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 font-black text-xl hover:scale-110 shadow-md"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 mb-4 shadow-lg ${added
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 hover:shadow-2xl'
                                }`}
                        >
                            {added ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added to Cart!
                                </span>
                            ) : 'Add to Cart'}
                        </button>

                        <Link
                            href="/cart"
                            className="block w-full py-5 text-center border-2 border-emerald-600 text-emerald-600 rounded-2xl font-black hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl"
                        >
                            View Cart
                        </Link>

                        {/* Product Metadata */}
                        {product.metadata && Object.values(product.metadata).some(value => value && value.trim()) && (
                            <div className="mt-8 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Product Information</h3>
                                <div className="space-y-5">
                                    {product.metadata.productName && product.metadata.productName.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Product Name:</div>
                                            <div className="text-base font-black text-gray-900">{product.metadata.productName}</div>
                                        </div>
                                    )}
                                    {product.metadata.category && product.metadata.category.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Category:</div>
                                            <div className="text-base font-black text-gray-900">{product.metadata.category}</div>
                                        </div>
                                    )}
                                    {product.metadata.materialOrigin && product.metadata.materialOrigin.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Material / Origin:</div>
                                            <div className="text-base font-black text-gray-900">{product.metadata.materialOrigin}</div>
                                        </div>
                                    )}
                                    {product.metadata.sizeWeight && product.metadata.sizeWeight.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Size / Weight:</div>
                                            <div className="text-base font-black text-gray-900">{product.metadata.sizeWeight}</div>
                                        </div>
                                    )}
                                    {product.metadata.features && product.metadata.features.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Features:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.features}</div>
                                        </div>
                                    )}
                                    {product.metadata.usageApplication && product.metadata.usageApplication.trim() && (
                                        <div className="border-b-2 border-gray-100 pb-4">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Usage / Application:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.usageApplication}</div>
                                        </div>
                                    )}
                                    {product.metadata.keySellingPoints && product.metadata.keySellingPoints.trim() && (
                                        <div className="pb-1">
                                            <div className="text-sm text-gray-600 mb-2 font-bold">Key Selling Points:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.keySellingPoints}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl font-black mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Customer Reviews</h2>

                    {/* Write Review Form - Only for authenticated users who purchased and haven't reviewed yet */}
                    {isAuthenticated && hasPurchased && !hasReviewed && (
                        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                            <h3 className="text-2xl font-black mb-6 text-gray-900">Write a Review</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-6">
                                    <label className="block text-sm font-black text-gray-800 mb-3">Your Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setUserReview({ ...userReview, rating: star })}
                                                className="transition-transform hover:scale-125"
                                            >
                                                <svg className={`w-10 h-10 ${star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-black text-gray-800 mb-3">Your Review</label>
                                    <textarea
                                        value={userReview.comment}
                                        onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                                        rows={5}
                                        required
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all resize-none"
                                        placeholder="Share your experience with this product..."
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    )}

                    {isAuthenticated && hasPurchased && hasReviewed && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 mb-8 border-2 border-green-200">
                            <p className="text-center text-gray-700 font-semibold">
                                ✓ You have already submitted a review for this product
                            </p>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 mb-8 border-2 border-emerald-200">
                            <p className="text-center text-gray-700 font-semibold">
                                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-black">
                                    Log in
                                </Link>
                                {' '}to write a review
                            </p>
                        </div>
                    )}

                    {isAuthenticated && !hasPurchased && (
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 mb-8 border-2 border-blue-200">
                            <p className="text-center text-gray-700 font-semibold">
                                Purchase this product to leave a review
                            </p>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review, index) => (
                                <div
                                    key={review.id || index}
                                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                                    style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                                                    {review.userName ? review.userName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900">{review.userName || 'Anonymous'}</p>
                                                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            {/* Delete button - show if user owns review or is admin */}
                                            {isAuthenticated && user && (review.userId === user.userId || user.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete review"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="text-xl text-gray-600 font-semibold">No reviews yet</p>
                            <p className="text-gray-500 mt-2">Be the first to review this product!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-20 right-8 z-50 animate-slideIn">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 ${toast.type === 'success'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-300'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 border-red-300'
                        }`}>
                        <div className="flex items-center gap-3 text-white">
                            {toast.type === 'success' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <span className="font-bold text-lg">{toast.message}</span>
                        </div>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: 'success' })}
                            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
