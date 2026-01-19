/**
 * Admin User Management
 * View and manage user accounts, block/unblock users
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminUsers() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'admin') {
            router.push('/');
        } else {
            fetchUsers();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        let filtered = users;

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter(u => u.role === roleFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users);
                setFilteredUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        const action = newStatus === 'blocked' ? 'block' : 'unblock';

        setConfirmDialog({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            message: `Are you sure you want to ${action} this user? ${newStatus === 'blocked' ? 'They will not be able to log in.' : 'They will be able to log in again.'}`,
            onConfirm: () => performToggleUserStatus(userId, newStatus, action),
            type: newStatus === 'blocked' ? 'danger' : 'success'
        });
    };

    const performToggleUserStatus = async (userId, newStatus, action) => {
        setConfirmDialog(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, status: newStatus }),
            });

            if (response.ok) {
                setToast({ type: 'success', message: `User ${action}ed successfully!` });
                fetchUsers();
            } else {
                const data = await response.json();
                setToast({ type: 'error', message: data.error || 'Operation failed' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error updating user status' });
        }
    };

    const openEditRole = (user) => {
        setEditingUser(user);
        setNewRole(user.role);
    };

    const handleRoleUpdate = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: editingUser._id, role: newRole }),
            });

            if (response.ok) {
                setToast({ type: 'success', message: 'User role updated successfully!' });
                setEditingUser(null);
                fetchUsers();
            } else {
                const data = await response.json();
                setToast({ type: 'error', message: data.error || 'Failed to update role' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error updating user role' });
        }
    };

    const handleResetPassword = (user) => {
        setConfirmDialog({
            title: 'Reset User Password',
            message: `Reset password for ${user.name} (${user.email})? A new temporary password will be generated.`,
            onConfirm: () => performPasswordReset(user._id),
            type: 'warning'
        });
    };

    const performPasswordReset = async (userId) => {
        setConfirmDialog(null);

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, resetPassword: true }),
            });

            const data = await response.json();

            if (response.ok) {
                setToast({
                    type: 'success',
                    message: `Password reset! Temp password: ${data.tempPassword}`
                });
            } else {
                setToast({ type: 'error', message: data.error || 'Failed to reset password' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error resetting password' });
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
                <title>Manage Users - Admin</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">Manage Users</h1>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                            <option value="guest">Guest</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm">Total Users</p>
                        <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm">Active Users</p>
                        <p className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.status === 'active').length}
                        </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm">Blocked Users</p>
                        <p className="text-2xl font-bold text-red-600">
                            {users.filter(u => u.status === 'blocked').length}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-gray-600 text-sm">Customers</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {users.filter(u => u.role === 'customer').length}
                        </p>
                    </div>
                </div>

                {/* User Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {filteredUsers.length === 0 ? (
                        <p className="p-6 text-gray-600">No users found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id}>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold">{u.name}</p>
                                                {u.phone && <p className="text-sm text-gray-600">{u.phone}</p>}
                                            </td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-sm font-semibold ${u.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    u.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-sm font-semibold ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {u.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditRole(u)}
                                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                                        title="Change Role"
                                                    >
                                                        Role
                                                    </button>
                                                    <button
                                                        onClick={() => handleResetPassword(u)}
                                                        className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                                                        title="Reset Password"
                                                    >
                                                        Reset
                                                    </button>
                                                    {u.role !== 'admin' && (
                                                        <button
                                                            onClick={() => toggleUserStatus(u._id, u.status)}
                                                            className={`${u.status === 'active'
                                                                ? 'text-red-600 hover:text-red-800'
                                                                : 'text-green-600 hover:text-green-800'
                                                                } font-semibold text-sm`}
                                                        >
                                                            {u.status === 'active' ? 'Block' : 'Unblock'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Role Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Update User Role</h2>
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">User</p>
                            <p className="font-semibold">{editingUser.name}</p>
                            <p className="text-sm text-gray-600">{editingUser.email}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select New Role
                            </label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRoleUpdate}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                            >
                                Update Role
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
