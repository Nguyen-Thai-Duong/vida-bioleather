/**
 * Homepage
 * Displays all products, hero section, and embedded project video
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import Image from 'next/image';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef(null);

    // Parallax scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                <title>VIDA Bioleather – Sustainable Kombucha SCOBY Leather</title>
                <meta name="description" content="VIDA Bioleather develops sustainable kombucha SCOBY leather, an innovative eco-friendly biomaterial for fashion and design." />
            </Head>

            {/* Hero Section - Product-Focused & Dynamic */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
                {/* Animated organic background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    ></div>
                    <div
                        className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
                    ></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]"></div>
                </div>

                <div className="container mx-auto px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left: Dynamic Text Content */}
                        <div
                            className="text-white space-y-8"
                            style={{
                                opacity: Math.max(0, 1 - scrollY / 500),
                                transform: `translateY(${scrollY * 0.5}px)`
                            }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-semibold">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                Living Biomaterial
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black leading-none tracking-tight">
                                <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                                    Material
                                </span>
                                <span className="block mt-2">That Lives</span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl font-light">
                                VIDA Bioleather is grown, not manufactured.
                                <span className="text-emerald-400 font-medium"> Kombucha SCOBY </span>
                                transforms into sustainable leather alternative —
                                <span className="text-emerald-400 font-medium"> zero harm, pure innovation</span>.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <a
                                    href="#products"
                                    className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                                >
                                    Explore Collection
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                                <a
                                    href="/team"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-2xl border-2 border-white/20 hover:bg-white/20 hover:border-emerald-400/50 transition-all duration-300"
                                >
                                    Our Science
                                </a>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                                <div>
                                    <div className="text-3xl font-black text-emerald-400">100%</div>
                                    <div className="text-sm text-gray-400 mt-1">Eco-Friendly</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-emerald-400">0</div>
                                    <div className="text-sm text-gray-400 mt-1">Animal Harm</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-emerald-400">3+</div>
                                    <div className="text-sm text-gray-400 mt-1">Products</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Floating Product Showcase */}
                        <div className="relative h-[600px]" style={{ transform: `translateY(${-scrollY * 0.3}px)` }}>
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-emerald-400"></div>
                                </div>
                            ) : products.length > 0 && (
                                <div className="relative w-full h-full">
                                    {/* Product 1 - Center, largest */}
                                    {products[0] && (
                                        <div
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 group cursor-pointer"
                                            style={{ animation: 'float 6s ease-in-out infinite' }}
                                        >
                                            <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-105">
                                                <Image
                                                    src={products[0].image || '/placeholder.png'}
                                                    alt={products[0].name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                    <h3 className="text-2xl font-bold mb-1">{products[0].name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product 2 - Top right */}
                                    {products[1] && (
                                        <div
                                            className="absolute top-0 right-0 w-48 h-48 group cursor-pointer"
                                            style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }}
                                        >
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-110">
                                                <Image
                                                    src={products[1].image || '/placeholder.png'}
                                                    alt={products[1].name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                    <h3 className="text-sm font-bold">{products[1].name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product 3 - Bottom left */}
                                    {products[2] && (
                                        <div
                                            className="absolute bottom-0 left-0 w-52 h-52 group cursor-pointer"
                                            style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '2s' }}
                                        >
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-110">
                                                <Image
                                                    src={products[2].image || '/placeholder.png'}
                                                    alt={products[2].name}
                                                    fill
                                                    unoptimized
                                                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    <h3 className="text-base font-bold">{products[2].name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Decorative elements */}
                                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
                                    <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>

                {/* Add floating animation keyframes via inline style */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    @keyframes gradient {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    .animate-gradient {
                        background-size: 200% auto;
                        animation: gradient 3s ease infinite;
                    }
                `}</style>
            </section>

            {/* Products Section - Dynamic Grid */}
            <section id="products" className="relative py-32 bg-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900 to-white"></div>

                <div className="container mx-auto px-8 relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
                            Our Collection
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Sustainable <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Biomaterials</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Each product is grown with care, crafted with purpose
                        </p>
                    </div>

                    {/* Dynamic Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
                            <input
                                type="text"
                                placeholder="Search living materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="relative w-full px-8 py-5 pr-14 bg-white border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:outline-none text-lg transition-all duration-300 placeholder:text-gray-400 shadow-lg"
                            />
                            <svg
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-emerald-600 transition-colors"
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

                    {/* Products Grid with stagger animation */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
                                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-emerald-400 opacity-20"></div>
                            </div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {filteredProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-block p-6 bg-gray-50 rounded-2xl">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-xl text-gray-600 font-medium">
                                    {searchQuery ? 'No products found matching your search.' : 'No products available.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

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
                `}</style>
            </section >

            {/* Features Section - Interactive Cards */}
            < section className="relative py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden" >
                {/* Animated background elements */}
                < div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" ></div >
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="container mx-auto px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
                            Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">VIDA</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Innovation rooted in nature, designed for the future
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Feature 1 */}
                        <div className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">100% Eco-Friendly</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Made from kombucha SCOBY — zero animal harm, minimal environmental impact, maximum positive change</p>
                                <div className="mt-6 flex items-center text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Learn more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-teal-600 transition-colors">Biodegradable Material</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Sustainable bioleather perfect for wallets, accessories, and craft projects — returns to earth naturally</p>
                                <div className="mt-6 flex items-center text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Learn more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative">
                                <div className="bg-gradient-to-br from-emerald-600 to-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-emerald-600 transition-colors">DIY Workshops</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">Learn to create your own SCOBY leather products through hands-on workshops and tutorials</p>
                                <div className="mt-6 flex items-center text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    Learn more
                                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}
