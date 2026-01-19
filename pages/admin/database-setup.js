/**
 * Database Setup Page
 * Admin tool to optimize database with indexes
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../../store/authStore';

export default function DatabaseSetup() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'admin') {
            router.push('/');
        }
    }, [isAuthenticated, user]);

    const setupIndexes = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/setup-indexes', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({
                success: false,
                error: 'Failed to setup indexes: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <>
            <Head>
                <title>Database Setup - Admin</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Database Optimization</h1>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Create Database Indexes</h2>
                        <p className="text-gray-600 mb-6">
                            This will create indexes on your database collections to improve query performance.
                            Run this once to optimize your database for faster searches and queries.
                        </p>

                        <button
                            onClick={setupIndexes}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Setting up indexes...' : 'Setup Indexes'}
                        </button>
                    </div>

                    {result && (
                        <div className={`rounded-lg shadow-md p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <h3 className={`text-xl font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                                {result.success ? '✓ Success' : '✗ Error'}
                            </h3>
                            <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                                {result.message || result.error}
                            </p>
                            {result.results && (
                                <ul className="mt-4 space-y-1 text-green-700">
                                    {result.results.map((r, i) => (
                                        <li key={i}>• {r}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push('/admin/dashboard')}
                            className="text-green-600 hover:text-green-800"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
