/**
 * Product Detail Page
 * Displays full product information and metadata
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '../../store/cartStore';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
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

            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm">
                    <Link href="/" className="text-blue-600 hover:underline">
                        Home
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-600">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div>
                        <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

                        <div className="flex items-center mb-6">
                            <span className="text-4xl font-bold text-blue-600">₫{product.price ? product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</span>
                        </div>

                        <p className="text-gray-700 text-lg mb-8 leading-relaxed">{product.description}</p>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-300 mb-4 ${added
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {added ? '✓ Added to Cart!' : 'Add to Cart'}
                        </button>

                        <Link
                            href="/cart"
                            className="block w-full py-4 text-center border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            View Cart
                        </Link>

                        {/* Product Metadata */}
                        {product.metadata && Object.values(product.metadata).some(value => value && value.trim()) && (
                            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4">Product Information</h3>
                                <div className="space-y-4">
                                    {product.metadata.productName && product.metadata.productName.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Product Name:</div>
                                            <div className="text-base font-semibold text-gray-900">{product.metadata.productName}</div>
                                        </div>
                                    )}
                                    {product.metadata.category && product.metadata.category.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Category:</div>
                                            <div className="text-base font-semibold text-gray-900">{product.metadata.category}</div>
                                        </div>
                                    )}
                                    {product.metadata.materialOrigin && product.metadata.materialOrigin.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Material / Origin:</div>
                                            <div className="text-base font-semibold text-gray-900">{product.metadata.materialOrigin}</div>
                                        </div>
                                    )}
                                    {product.metadata.sizeWeight && product.metadata.sizeWeight.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Size / Weight:</div>
                                            <div className="text-base font-semibold text-gray-900">{product.metadata.sizeWeight}</div>
                                        </div>
                                    )}
                                    {product.metadata.features && product.metadata.features.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Features:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.features}</div>
                                        </div>
                                    )}
                                    {product.metadata.usageApplication && product.metadata.usageApplication.trim() && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <div className="text-sm text-gray-600 mb-1">Usage / Application:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.usageApplication}</div>
                                        </div>
                                    )}
                                    {product.metadata.keySellingPoints && product.metadata.keySellingPoints.trim() && (
                                        <div className="pb-1">
                                            <div className="text-sm text-gray-600 mb-1">Key Selling Points:</div>
                                            <div className="text-base font-semibold text-gray-900 whitespace-pre-line">{product.metadata.keySellingPoints}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                    </div>
                </div>
            </div>
        </>
    );
}
