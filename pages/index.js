/**
 * Homepage
 * Displays all products, hero section, and embedded project video
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            console.log('Homepage - Fetched products:', data);
            if (data.success && data.products) {
                setProducts(data.products);
                setFilteredProducts(data.products);
            } else {
                console.warn('No products found');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>VIDA Bioleather - Sustainable SCOBY Leather</title>
                <meta name="description" content="Eco-friendly bioleather made from kombucha SCOBY. Sustainable alternative to animal leather for crafts, fashion, and DIY projects" />
            </Head>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-6">Welcome to VIDA Bioleather</h1>
                        <p className="text-xl mb-8">
                            Sustainable leather made from kombucha SCOBY. An eco-friendly alternative to animal leather for crafts, fashion, and ethical consumption.
                        </p>
                        <a
                            href="#products"
                            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                        >
                            Shop Now
                        </a>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-4">Our Products</h2>
                    <p className="text-center text-gray-600 mb-12">
                        Browse our carefully curated selection of premium technology products
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                            />
                            <svg
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-600">
                                {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose VIDA</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">100% Eco-Friendly</h3>
                            <p className="text-gray-600">Made from kombucha SCOBY - zero animal harm, minimal environmental impact</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Sustainable Material</h3>
                            <p className="text-gray-600">Biodegradable bioleather perfect for wallets, accessories, and craft projects</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">DIY Workshops</h3>
                            <p className="text-gray-600">Learn to create your own SCOBY leather products through hands-on workshops</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
