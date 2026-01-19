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

    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative h-64 bg-gray-200">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            <div className="p-6">
                <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">
                        ₫{product.price ? product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${added
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {added ? '✓ Added!' : 'Add to Cart'}
                    </button>
                </div>

                {product.stock < 20 && product.stock > 0 && (
                    <p className="mt-3 text-sm text-orange-600">
                        Only {product.stock} left in stock!
                    </p>
                )}
            </div>
        </div>
    );
});

export default ProductCard;
