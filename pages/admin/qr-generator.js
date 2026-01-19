/**
 * Admin QR Code Generator
 * Generate QR codes for products with ViDa- prefix format
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';

export default function AdminQRGenerator() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [generatedQR, setGeneratedQR] = useState(null);
    const [formData, setFormData] = useState({
        customCode: '',
        productName: '',
        productDescription: '',
        creationDate: new Date().toISOString().split('T')[0],
    });
    const [toast, setToast] = useState(null);

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/admin/qr-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedQR(data);
                setToast({ type: 'success', message: `QR Code generated successfully! Code: ${data.qrCode}` });
            } else {
                setToast({ type: 'error', message: data.error || 'Failed to generate QR code' });
            }
        } catch (error) {
            setToast({ type: 'error', message: 'Error generating QR code' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            customCode: '',
            productName: '',
            productDescription: '',
            creationDate: new Date().toISOString().split('T')[0],
        });
        setGeneratedQR(null);
    };

    return (
        <>
            <Head>
                <title>QR Code Generator - Admin</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-8">QR Code Generator</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Product Information</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Custom Code (DNT) *</label>
                                <select
                                    name="customCode"
                                    value={formData.customCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">-- Select Category --</option>
                                    <option value="D">D - raw materials</option>
                                    <option value="N">N - kombucha liquid</option>
                                    <option value="T">T - scoby bag</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Select a category code (will be in format: ViDa-D-XXXXX)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Description *</label>
                                <textarea
                                    name="productDescription"
                                    value={formData.productDescription}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1">Creation Date *</label>
                                <input
                                    type="date"
                                    name="creationDate"
                                    value={formData.creationDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                                >
                                    {loading ? 'Generating...' : 'Generate QR Code'}
                                </button>
                                {generatedQR && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 font-semibold"
                                    >
                                        New Product
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Result Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Generated QR Code</h2>

                        {generatedQR ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border-l-4 border-green-600 p-4">
                                    <p className="font-semibold text-green-800">QR Code Generated Successfully!</p>
                                </div>

                                <div className="text-center">
                                    <img src={generatedQR.qrImage} alt="QR Code" className="mx-auto border-4 border-gray-200 rounded" />
                                    <p className="mt-4 text-2xl font-bold text-blue-600">{generatedQR.qrCode}</p>
                                    <p className="text-sm text-gray-600 mt-1">Scan or enter this code to view product</p>
                                </div>

                                <div className="flex space-x-2">
                                    <a
                                        href={generatedQR.qrImage}
                                        download={`QR-${generatedQR.qrCode}.png`}
                                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-center font-semibold"
                                    >
                                        Download QR Code
                                    </a>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generatedQR.qrCode)}
                                        className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 font-semibold"
                                    >
                                        Copy Code
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                                <p className="text-lg">Fill in the form and generate your QR code</p>
                                <p className="text-sm mt-2">The code will appear here with format: ViDa-DNT-XXXXX</p>
                            </div>
                        )}
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
        </>
    );
}
