/**
 * Shopping Cart Page
 * Displays cart items with ability to update quantities and proceed to checkout
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCartStore from '../store/cartStore';

export default function Cart() {
    const router = useRouter();
    const items = useCartStore((state) => state.getItems());
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const getTotal = useCartStore((state) => state.getTotal());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleCheckout = () => {
        if (items.length > 0) {
            router.push('/checkout');
        }
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <>
                <Head>
                    <title>Shopping Cart - VIDA Bioleather</title>
                </Head>
                <div className="container mx-auto px-4 py-20">
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                    </div>
                </div>
            </>
        );
    }

    if (items.length === 0) {
        return (
            <>
                <Head>
                    <title>Shopping Cart - VIDA Bioleather</title>
                </Head>

                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="mb-8">
                            <svg
                                className="w-24 h-24 text-gray-400 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Shopping Cart - VIDA Bioleather</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-6"
                                >
                                    {/* Product Image */}
                                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                        <div className="relative w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-grow">
                                        <Link href={`/products/${item.id}`}>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-green-600">
                                                {item.name}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₫{item.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        </p>
                                    </div>

                                    {/* Quantity and Remove */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-semibold"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-semibold w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-semibold"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-700 font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span className="font-semibold">₫{getTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax</span>
                                    <span className="font-semibold">₫{(getTotal * 0.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600">₫{(getTotal * 1.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                href="/"
                                className="block w-full text-center text-green-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
