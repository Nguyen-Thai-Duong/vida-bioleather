/**
 * Customer Profile Page
 * Allows customers to view and edit their profile, view order history
 */

import { useState, useEffect } from 'react';
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>My Profile - VIDA Bioleather</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">My Profile</h1>

                {message && (
                    <div className={`mb-6 p-4 rounded ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4">Account Information</h2>

                            {editing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 resize-none"
                                        ></textarea>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                        >
                                            {saving ? 'Saving...' : 'Save'}
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
                                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="space-y-3 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Name</p>
                                            <p className="font-semibold">{profile?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Email</p>
                                            <p className="font-semibold">{profile?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold">{profile?.phone || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-semibold">{profile?.address || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}

                            {/* Change Password Section */}
                            <div className="mt-6 pt-6 border-t">
                                <button
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    className="w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200 font-semibold flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                    Change Password
                                </button>

                                {showPasswordChange && (
                                    <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                minLength={6}
                                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
                                                placeholder="Enter new password (min 6 characters)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                required
                                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-green-500"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                disabled={changingPassword}
                                                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                                            >
                                                {changingPassword ? 'Changing...' : 'Change Password'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordChange(false);
                                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                }}
                                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
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
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold mb-4">Order History</h2>

                            {orders.length === 0 ? (
                                <p className="text-gray-600">No orders yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.orderId} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-semibold">Order #{order.orderId}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded text-sm font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <p><strong>Items:</strong> {order.items.length}</p>
                                                <p><strong>Total:</strong> ₫{order.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                {order.adminNotes && (
                                                    <p className="text-sm text-gray-600"><strong>Admin Notes:</strong> {order.adminNotes}</p>
                                                )}
                                            </div>

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
                                                                        ₫{(item.price * item.quantity).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-4 pt-3 border-t">
                                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                            <span>Subtotal:</span>
                                                            <span>₫{order.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                            <span>Tax (10%):</span>
                                                            <span>₫{(order.totalAmount * 0.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                                        </div>
                                                        <div className="flex justify-between font-bold text-lg text-gray-800">
                                                            <span>Total:</span>
                                                            <span className="text-green-600">₫{(order.totalAmount * 1.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
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
