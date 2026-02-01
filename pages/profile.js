/**
 * Customer Profile Page
 * Allows customers to view and edit their profile, view order history
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../store/authStore';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Profile() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'customer' && user.role !== 'admin') {
            router.push('/');
        } else {
            fetchProfile();
            fetchOrders();
        }
    }, [isAuthenticated, user]);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile');
            const data = await response.json();
            if (response.ok) {
                setProfile(data.user);
                setFormData({
                    name: data.user.name,
                    phone: data.user.phone || '',
                    address: data.user.address || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setChangingPassword(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setToast({ type: 'error', message: 'New passwords do not match' });
            setChangingPassword(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setToast({ type: 'error', message: 'Password must be at least 6 characters' });
            setChangingPassword(false);
            return;
        }

        try {
            const response = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({ type: 'success', message: 'Password changed successfully!' });
                setShowPasswordChange(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setToast({ type: 'error', message: data.error || 'Failed to change password' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error changing password' });
        } finally {
            setChangingPassword(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setEditing(false);
                setMessage('Profile updated successfully!');
                checkAuth(); // Refresh auth state
            } else {
                setMessage(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setMessage('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const cancelOrder = async (orderId) => {
        setConfirmDialog({
            title: 'Cancel Order',
            message: 'Are you sure you want to cancel this order? This action cannot be undone.',
            onConfirm: () => performCancelOrder(orderId),
            type: 'warning'
        });
    };

    const performCancelOrder = async (orderId) => {
        setConfirmDialog(null);

        try {
            const response = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, action: 'cancel' }),
            });

            if (response.ok) {
                fetchOrders(); // Refresh orders
                setToast({ type: 'success', message: 'Order cancelled successfully' });
            } else {
                const data = await response.json();
                setToast({ type: 'error', message: data.error || 'Failed to cancel order' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error cancelling order' });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-400"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-emerald-500/30"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>My Profile - VIDA Bioleather</title>
            </Head>

            {/* Hero Section - Dynamic */}
            <section className="relative bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900 py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <div
                        className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    ></div>
                    <div
                        className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
                    ></div>
                </div>
                <div className="container mx-auto px-8 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-bold mb-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                Customer Dashboard
                            </div>
                            <h1 className="text-5xl font-black text-white">
                                Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{profile?.name}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            {message && (
                <div className="container mx-auto px-8 py-6">
                    <div className={`p-6 rounded-2xl backdrop-blur-sm border-2 ${message.includes('success')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-red-50 text-red-800 border-red-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">{message}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-8 py-16 relative">
                {/* Background decoration */}
                <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl -z-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Profile Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-2xl">
                            <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Account Info</h2>

                            {editing ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-black text-gray-800 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-gray-800 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-gray-800 mb-2">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-none transition-all text-lg"
                                        ></textarea>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditing(false);
                                                setFormData({
                                                    name: profile.name,
                                                    phone: profile.phone || '',
                                                    address: profile.address || '',
                                                });
                                            }}
                                            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="space-y-5 mb-6">
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                                            <p className="font-black text-gray-900 text-lg">{profile?.name}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                                            <p className="font-black text-gray-900 text-lg break-all">{profile?.email}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Phone</p>
                                            <p className="font-black text-gray-900 text-lg">{profile?.phone || 'Not provided'}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-teal-50 rounded-2xl">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">Address</p>
                                            <p className="font-black text-gray-900 text-lg">{profile?.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}

                            {/* Change Password Section */}
                            <div className="mt-8 pt-8 border-t-2 border-gray-100">
                                <button
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    className="w-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-4 rounded-xl hover:from-gray-200 hover:to-gray-300 font-black flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-md"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Change Password
                                </button>

                                {showPasswordChange && (
                                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
                                        <div>
                                            <label className="block text-sm font-black text-gray-800 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-800 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={6}
                                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                                                placeholder="Enter new password (min 6 characters)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-800 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                type="submit"
                                                disabled={changingPassword}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                            >
                                                {changingPassword ? 'Changing...' : 'Change Password'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordChange(false);
                                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                }}
                                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Order History</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-xl text-gray-600 font-semibold">No orders yet</p>
                                    <p className="text-gray-500 mt-2">Start shopping to see your orders here!</p>
                                    <a
                                        href="/"
                                        className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                                    >
                                        Browse Products
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order, index) => (
                                        <div
                                            key={order.orderId}
                                            className="border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                                            style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both` }}
                                        >
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <p className="font-black text-xl text-gray-900">Order #{order.orderId}</p>
                                                    <p className="text-sm text-gray-600 mt-1 font-semibold">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-sm font-black ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                                                    order.status === 'received' ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                                                            order.status === 'rejected' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                                                                'bg-gray-100 text-gray-800 border-2 border-gray-300'
                                                    }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                                                    <p className="text-sm text-gray-600 font-semibold">Items</p>
                                                    <p className="font-black text-2xl text-emerald-600">{order.items.length}</p>
                                                </div>
                                                <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl">
                                                    <p className="text-sm text-gray-600 font-semibold">Total Amount</p>
                                                    <p className="font-black text-2xl text-teal-600">₫{order.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            </div>
                                            {order.adminNotes && (
                                                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl mb-4">
                                                    <p className="text-sm font-black text-blue-900 mb-1">Admin Notes:</p>
                                                    <p className="text-blue-700">{order.adminNotes}</p>
                                                </div>
                                            )}

                                            {/* Order Items Details */}
                                            {expandedOrderId === order.orderId && (
                                                <div className="mt-4 border-t pt-4">
                                                    <h3 className="font-semibold mb-3 text-gray-800">Order Items:</h3>
                                                    <div className="space-y-3">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                                                                {item.image && (
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.name}
                                                                        className="w-16 h-16 object-cover rounded"
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                                    <p className="text-sm text-gray-600">Price: ₫{item.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-green-600">
                                                                        {(item.price * item.quantity).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-3 border-t">
                                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                            <span>Subtotal:</span>
                                                            <span>{order.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                            <span>Tax (10%):</span>
                                                            <span>₫{(order.totalAmount * 0.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold text-lg text-gray-800">
                                                            <span>Total:</span>
                                                            <span className="text-green-600">{(order.totalAmount * 1.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</span>
                                                        </div>
                                                    </div>
                                                    {order.shippingInfo && (
                                                        <div className="mt-4 pt-3 border-t">
                                                            <h4 className="font-semibold text-gray-800 mb-2">Shipping Information:</h4>
                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                <p><strong>Name:</strong> {order.shippingInfo.userName}</p>
                                                                <p><strong>Email:</strong> {order.shippingInfo.userEmail}</p>
                                                                <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
                                                                <p><strong>Address:</strong> {order.shippingInfo.address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                                                    className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1"
                                                >
                                                    {expandedOrderId === order.orderId ? (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                            Hide Details
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                            View Details
                                                        </>
                                                    )}
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => cancelOrder(order.orderId)}
                                                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Confirm Dialog */}
            {confirmDialog && (
                <ConfirmDialog
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={() => setConfirmDialog(null)}
                    type={confirmDialog.type}
                />
            )}
        </>
    );
}
