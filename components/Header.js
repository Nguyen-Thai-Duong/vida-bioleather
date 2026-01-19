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
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/header-logo.png" width={40} height={40} alt="VIDA Logo" />
                        <div className="text-xl font-bold text-gray-800">VIDA Bioleather</div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-gray-700 hover:text-blue-600 transition-colors ${router.pathname === link.href ? 'text-blue-600 font-semibold' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side: Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        {/* Auth Buttons/User Menu */}
                        {isAuthenticated && user ? (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                    className="text-gray-700 hover:text-blue-600 transition-colors font-semibold"
                                >
                                    {user.name}
                                    {user.role === 'admin' && ' (Admin)'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Cart Icon */}
                        <div className="relative">
                            <Link
                                href="/cart"
                                className="block p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </Link>
                            {mounted && itemCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                                    {itemCount}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
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
                    <nav className="md:hidden mt-4 pb-4 border-t pt-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block py-2 text-gray-700 hover:text-blue-600 transition-colors ${router.pathname === link.href ? 'text-blue-600 font-semibold' : ''
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {/* Mobile Auth Links */}
                        <div className="border-t mt-2 pt-2">
                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href={user.role === 'admin' ? '/admin/dashboard' : '/profile'}
                                        className="block py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Account ({user.name})
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="block py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="block py-2 text-blue-600 hover:text-blue-700 font-semibold"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
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
