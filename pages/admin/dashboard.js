/**
 * Admin Dashboard
 * Overview of system stats and quick links to management pages
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import useAuthStore from '../../store/authStore';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'admin') {
            router.push('/');
        } else if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [isAuthenticated, user]);

    const fetchStats = async () => {
        try {
            // Fetch all stats in one API call
            const statsRes = await fetch('/api/admin/stats');
            const statsData = await statsRes.json();

            if (statsData.success) {
                setStats(statsData.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard - VIDA Bioleather</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-blue-50 rounded-lg shadow-md p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Products</p>
                        <p className="text-4xl font-bold text-blue-600">{stats.totalProducts}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg shadow-md p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Users</p>
                        <p className="text-4xl font-bold text-green-600">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg shadow-md p-6">
                        <p className="text-gray-600 text-sm mb-2">Total Orders</p>
                        <p className="text-4xl font-bold text-purple-600">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg shadow-md p-6">
                        <p className="text-gray-600 text-sm mb-2">Pending Orders</p>
                        <p className="text-4xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                    </div>
                </div>

                {/* Quick Links */}
                <h2 className="text-2xl font-bold mb-6">Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link href="/admin/products" className="block bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="text-5xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                            <p className="text-gray-600">Add, edit, or remove products</p>
                        </div>
                    </Link>

                    <Link href="/admin/orders" className="block bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
                            <p className="text-gray-600">Review and process orders</p>
                        </div>
                    </Link>

                    <Link href="/admin/users" className="block bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="text-5xl mb-4">👥</div>
                            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                            <p className="text-gray-600">View and manage user accounts</p>
                        </div>
                    </Link>

                    <Link href="/admin/qr-generator" className="block bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                        <div className="text-center">
                            <div className="text-5xl mb-4">🔲</div>
                            <h3 className="text-xl font-bold mb-2">QR Generator</h3>
                            <p className="text-white/90">Generate ViDa QR codes</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}
