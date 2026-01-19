/**
 * Admin Order Management
 * Review, approve/reject orders, update status
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';

export default function AdminOrders() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'admin') {
            router.push('/');
        } else {
            fetchOrders();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (filter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === filter));
        }
    }, [filter, orders]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (response.ok) {
                setOrders(data.orders);
                setFilteredOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus, notes = '') => {
        try {
            const response = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    status: newStatus,
                    adminNotes: notes || adminNotes,
                }),
            });

            if (response.ok) {
                setToast({ type: 'success', message: `Order ${newStatus} successfully!` });
                fetchOrders();
                setSelectedOrder(null);
                setAdminNotes('');
            } else {
                const data = await response.json();
                setToast({ type: 'error', message: data.error || 'Update failed' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error updating order' });
        }
    };

    const viewOrder = (order) => {
        setSelectedOrder(order);
        setAdminNotes(order.adminNotes || '');
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
                <title>Manage Orders - Admin</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto">
                    {['all', 'pending', 'received', 'completed', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded whitespace-nowrap ${filter === status
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === 'all' ? ` (${orders.length})` : ` (${orders.filter(o => o.status === status).length})`}
                        </button>
                    ))}
                </div>

                {/* Order List */}
                <div className="bg-white rounded-lg shadow-md">
                    {filteredOrders.length === 0 ? (
                        <p className="p-6 text-gray-600">No orders found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="px-6 py-4 font-mono text-sm">#{order.orderId}</td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold">{order.userName}</p>
                                                    <p className="text-sm text-gray-600">{order.userEmail}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">{order.items.length}</td>
                                            <td className="px-6 py-4 font-semibold">₫{order.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-sm font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'received' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => viewOrder(order)}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold">Order #{selectedOrder.orderId}</h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-gray-500 hover:text-gray-700 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="font-semibold mb-2">Customer Information</h3>
                                        <p><strong>Name:</strong> {selectedOrder.userName}</p>
                                        <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                                        <p><strong>Phone:</strong> {selectedOrder.shippingInfo?.phone || 'Not provided'}</p>
                                        <p><strong>Address:</strong> {selectedOrder.shippingInfo?.address || 'Not provided'}</p>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-semibold mb-2">Order Items</h3>
                                        <div className="space-y-2">
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex justify-between border-b pb-2">
                                                    <div>
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-semibold">₫{(item.price * item.quantity).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between font-bold text-lg mt-4">
                                            <span>Total:</span>
                                            <span>₫{selectedOrder.totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                        </div>
                                    </div>

                                    {/* Status and Notes */}
                                    <div>
                                        <h3 className="font-semibold mb-2">Status & Notes</h3>
                                        <p><strong>Current Status:</strong> <span className="text-blue-600">{selectedOrder.status}</span></p>
                                        <p><strong>Created:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        {selectedOrder.updatedAt && (
                                            <p><strong>Last Updated:</strong> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                                        )}
                                    </div>

                                    {/* Admin Notes */}
                                    <div>
                                        <label className="block font-semibold mb-2">Admin Notes</label>
                                        <textarea
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 resize-none"
                                            placeholder="Add notes about this order..."
                                        ></textarea>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {selectedOrder.status === 'pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.orderId, 'received')}
                                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                            >
                                                Mark as Order Received
                                            </button>
                                        )}
                                        {selectedOrder.status === 'received' && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.orderId, 'completed')}
                                                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                                            >
                                                Mark as Order Completed
                                            </button>
                                        )}
                                        {(selectedOrder.status === 'pending' || selectedOrder.status === 'received') && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.orderId, 'rejected')}
                                                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                                            >
                                                Reject Order
                                            </button>
                                        )}
                                        {(selectedOrder.status === 'pending' || selectedOrder.status === 'received' || selectedOrder.status === 'rejected') && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.orderId, selectedOrder.status, adminNotes)}
                                                className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                                            >
                                                Update Notes
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast Notification */}
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
