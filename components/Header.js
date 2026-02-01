/**
 * Reusable Header Component
 * Displays logo, navigation, shopping cart icon, and auth buttons
 */

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { useState, useEffect } from 'react';

export default function Header() {
    const router = useRouter();
    const itemCount = useCartStore((state) => state.getItemCount());
    const setUser = useCartStore((state) => state.setUser);
    const clearCart = useCartStore((state) => state.clearCart);
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Check auth status on mount and sync cart user
    useEffect(() => {
        const initAuth = async () => {
            await checkAuth();
            setMounted(true);
        };
        initAuth();
    }, [checkAuth]);

    // Sync cart with current user - clear when switching accounts
    useEffect(() => {
        if (user && user.userId) {
            setUser(user.userId);
        } else {
            // User logged out, switch to guest cart
            setUser('guest');
        }
    }, [user?.userId, setUser]);

    const handleLogout = async () => {
        clearCart(); // Clear current user's cart before logout
        await logout();
        setUser('guest'); // Switch to guest cart
        router.push('/');
    };

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/team', label: 'Our Team' },
        { href: '/qr-search', label: 'QR Search' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-8 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <Image src="/header-logo.png" width={48} height={48} alt="VIDA Logo" className="group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-2xl font-black text-gray-900">VIDA <span className="text-emerald-600">Bioleather</span></div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-base font-semibold hover:text-emerald-600 transition-colors relative ${router.pathname === link.href
                                    ? 'text-emerald-600'
                                    : 'text-gray-700'
                                    }`}
                            >
                                {link.label}
                                {router.pathname === link.href && (
                                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side: Auth & Cart */}
                    <div className="flex items-center gap-5">
                        {/* Auth Buttons/User Menu */}
                        {isAuthenticated && user ? (
                            <div className="hidden md:flex items-center gap-5">
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                    className="text-gray-700 hover:text-emerald-600 transition-colors font-semibold"
                                >
                                    {user.name}
                                    {user.role === 'admin' && <span className="ml-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Admin</span>}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-emerald-600 transition-colors font-semibold"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Cart Icon */}
                        <div className="relative">
                            <Link
                                href="/cart"
                                className="block p-3 hover:bg-emerald-50 rounded-xl transition-all duration-300 group"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-700 group-hover:text-emerald-600 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </Link>
                            {mounted && itemCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center pointer-events-none shadow-lg">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg
                                className="w-6 h-6 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-6 pb-6 border-t pt-6 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block py-3 px-4 rounded-xl font-semibold transition-all ${router.pathname === link.href
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Links */}
                        <div className="border-t mt-4 pt-4 space-y-3">
                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                        className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Account ({user.name})
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-xl"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-center"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
