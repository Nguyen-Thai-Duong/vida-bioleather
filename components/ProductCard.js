/**
 * Product Card Component
 * Reusable component to display product information
 */

import Link from 'next/link';
import Image from 'next/image';
import useCartStore from '../store/cartStore';
import { useState, memo } from 'react';

const ProductCard = memo(function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);
    const [added, setAdded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div
            className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? '0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
        >
            {/* Hover glow effect */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-teal-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-700 pointer-events-none"
                style={{ opacity: isHovered ? 0.05 : 0 }}
            ></div>

            <Link href={`/products/${product.id}`} className="block relative">
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {/* Image with parallax-like zoom */}
                    <Image
                        src={product.imageUrl || product.image || '/placeholder.png'}
                        alt={product.name}
                        fill
                        unoptimized
                        priority={false}
                        key={product.image}
                        className="object-cover transition-all duration-700"
                        style={{
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
                        }}
                    />

                    {/* Gradient overlay on hover */}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent transition-opacity duration-700"
                        style={{ opacity: isHovered ? 1 : 0 }}
                    ></div>

                    {/* Stock badge */}
                    {product.stock < 20 && product.stock > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm animate-pulse">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                Only {product.stock} left
                            </span>
                        </div>
                    )}

                    {/* View Details overlay */}
                    <div
                        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                        style={{ opacity: isHovered ? 1 : 0 }}
                    >
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full font-bold text-gray-900 shadow-xl">
                            View Details →
                        </div>
                    </div>
                </div>
            </Link>

            <div className="relative p-8">
                <Link href={`/products/${product.id}`} className="block mb-4">
                    <h3
                        className="text-2xl font-black text-gray-900 transition-all duration-300 leading-tight"
                        style={{
                            color: isHovered ? '#059669' : '#111827',
                            transform: isHovered ? 'translateX(4px)' : 'translateX(0)'
                        }}
                    >
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed text-base">
                    {product.description}
                </p>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative">
                        <div
                            className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                            style={{
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            {product.price ? product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}₫
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all duration-300 ${added
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105'
                            }`}
                    >
                        {/* Button shine effect */}
                        {!added && (
                            <span
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                style={{
                                    transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                                    transition: 'transform 0.6s ease'
                                }}
                            ></span>
                        )}
                        <span className="relative flex items-center gap-2">
                            {added ? (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Added!
                                </>
                            ) : (
                                'Add to Cart'
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ProductCard;
