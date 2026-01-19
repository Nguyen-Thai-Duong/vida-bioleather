/**
 * Forgot Password Page
 * Allows users to reset their password
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Toast from '../components/Toast';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setResetSent(true);
                setToast({ type: 'success', message: 'Password reset instructions sent to your email!' });
            } else {
                setToast({ type: 'error', message: data.error || 'Failed to send reset email' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error sending reset email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Forgot Password - VIDA Bioleather</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Forgot Your Password?
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {resetSent
                                ? "Check your email for reset instructions"
                                : "Enter your email address and we'll send you instructions to reset your password"
                            }
                        </p>
                    </div>

                    {!resetSent ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                                </button>
                            </div>

                            <div className="text-center">
                                <Link href="/login" className="text-sm text-green-600 hover:text-green-700">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-800 font-semibold">Email Sent!</p>
                                <p className="text-sm text-green-700 mt-2">
                                    We've sent password reset instructions to <strong>{email}</strong>
                                </p>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p>Didn't receive the email?</p>
                                <button
                                    onClick={() => setResetSent(false)}
                                    className="text-green-600 hover:text-green-700 font-semibold"
                                >
                                    Try again
                                </button>
                            </div>

                            <div>
                                <Link href="/login" className="text-sm text-green-600 hover:text-green-700">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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
