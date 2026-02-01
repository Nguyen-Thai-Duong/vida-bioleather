/**
 * Login Page
 * Allows users to login with email and password
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import useAuthStore from '../store/authStore';

export default function Login() {
    const router = useRouter();
    const { login, isAuthenticated, user } = useAuthStore();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [isAuthenticated, user, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            // Redirect based on role
            if (result.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        } else {
            setError(result.error || 'Login failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login - VIDA Bioleather</title>
            </Head>

            <div className="min-h-screen grid lg:grid-cols-2">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-16 flex-col justify-between relative overflow-hidden">
                    {/* Organic shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-16">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">V</span>
                            </div>
                            <span className="text-white text-2xl font-bold">VIDA Bioleather</span>
                        </div>

                        <h1 className="text-6xl font-black text-white mb-6 leading-tight">
                            The Future of
                            <br />
                            Sustainable
                            <br />
                            Materials
                        </h1>
                        <p className="text-xl text-white/80 max-w-md leading-relaxed">
                            Join our community of creators and innovators building a more sustainable future with SCOBY bioleather.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-8 text-white/60 text-sm">
                            <span>© 2026 VIDA</span>
                            <span>Eco-Friendly</span>
                            <span>Innovation</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex items-center justify-center bg-gray-50 p-8 lg:p-16">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-12">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">V</span>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">VIDA</span>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h2 className="text-4xl font-black text-gray-900 mb-3">
                                Welcome Back
                            </h2>
                            <p className="text-lg text-gray-600">
                                Don't have an account?{' '}
                                <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end">
                                <Link href="/forgot-password" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
