/**
 * Simplified Checkout Page
 * Shows cart summary with "Proceed Order" confirmation - no form entry
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Toast from '../components/Toast';

export default function Checkout() {
    const router = useRouter();
    const items = useCartStore((state) => state.getItems());
    const getTotal = useCartStore((state) => state.getTotal());
    const clearCart = useCartStore((state) => state.clearCart);
    const { user, isAuthenticated, checkAuth } = useAuthStore();

    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        setMounted(true);
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated]);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <>
                <Head>
                    <title>Checkout - VIDA Bioleather</title>
                </Head>
                <div className="container mx-auto px-4 py-20">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                </div>
            </>
        );
    }

    const handleProceedOrder = () => {
        setShowConfirmModal(true);
    };

    const handleConfirmOrder = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        try {
            // Create order via API
            const orderData = {
                items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingInfo: {
                    name: user.name,
                    phone: user.phone || 'Not provided',
                    address: user.address || 'Not provided',
                },
                totalAmount: getTotal,
            };

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setOrderPlaced(true);
                clearCart();

                // Redirect to profile orders after 3 seconds
                setTimeout(() => {
                    router.push('/profile');
                }, 3000);
            } else {
                const data = await response.json();
                setToast({ type: 'error', message: data.error || 'Failed to place order. Please try again.' });
                setLoading(false);
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Unable to place your order. Please check your connection and try again.' });
            setLoading(false);
        }
    };

    if (items.length === 0 && !orderPlaced) {
        router.push('/cart');
        return null;
    }

    if (orderPlaced) {
        return (
            <>
                <Head>
                    <title>Order Confirmed - VIDA Bioleather</title>
                </Head>

                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <svg
                                className="w-24 h-24 text-green-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Thank you for your purchase. Your order has been successfully placed.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Order Status: <span className="font-semibold text-yellow-600">Pending</span>
                        </p>
                        <p className="text-gray-600 mb-8">
                            You can track your order status in your Order History.
                        </p>
                        <p className="text-sm text-gray-500">
                            Redirecting to Order History...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Checkout - VIDA Bioleather</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Order Summary</h1>

                <div className="max-w-3xl mx-auto">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><span className="font-semibold">Name:</span> {user?.name}</p>
                            <p><span className="font-semibold">Email:</span> {user?.email}</p>
                            <p><span className="font-semibold">Phone:</span> {user?.phone || 'Not provided'}</p>
                            <p><span className="font-semibold">Address:</span> {user?.address || 'Not provided'}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                                    <div className="relative w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            unoptimized
                                            className="object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        <p className="text-sm font-semibold text-green-600">
                                            {(item.price * item.quantity).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{getTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold pt-4 border-t">
                                <span>Total</span>
                                <span className="text-green-600">{getTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Proceed Order Button */}
                    <button
                        onClick={handleProceedOrder}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing Order...' : 'Proceed Order'}
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => router.push('/cart')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Confirm Order</h2>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to place this order for <span className="font-bold text-green-600">{getTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>?
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                            Your order will be set to "Pending" status and an admin will process it soon.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmOrder}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}
