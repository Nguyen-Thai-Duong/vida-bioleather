/**
 * QR Code Search Page
 * Allows users to search for product information using QR code values
 */

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function QRSearch() {
    const [qrCode, setQrCode] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!qrCode.trim()) {
            setError('Please enter a QR code value');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`/api/qr/search?code=${encodeURIComponent(qrCode)}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setError(data.error || 'Product not found');
            }
        } catch (err) {
            setError('An error occurred while searching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>QR Code Search - VIDA Bioleather</title>
                <meta name="description" content="Search for product information using QR codes" />
            </Head>

            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">QR Code Search</h1>
                    <p className="text-xl text-gray-600">
                        Enter a QR code value (format: ViDa-DNT-XXXXX) to retrieve product information
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                        Example: ViDa-BLT-ABC123DEF
                    </p>
                </div>

                {/* Search Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                QR Code Value
                            </label>
                            <input
                                type="text"
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                placeholder="e.g., ViDa-BLT-ABC123DEF"
                                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Enter the complete QR code printed on the item
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 flex items-start">
                            <svg
                                className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-800 mb-1">Search Failed</h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {result && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Success Header */}
                            <div className="bg-green-50 border-b-2 border-green-200 p-6 flex items-center">
                                <svg
                                    className="w-8 h-8 text-green-600 mr-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-xl font-bold text-green-800">QR Code Found!</h3>
                                    <p className="text-green-700">QR code verified successfully</p>
                                </div>
                            </div>

                            {/* Product Information */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.data.productName}</h2>
                                    <p className="text-gray-600">{result.data.productDescription}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-3">QR Code Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">QR Code:</span>
                                            <span className="font-semibold text-blue-600 font-mono">{result.data.qrCode}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Custom Code:</span>
                                            <span className="font-semibold">{result.data.customCode}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created Date:</span>
                                            <span className="font-semibold">{new Date(result.data.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {result.data.createdBy && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Created By:</span>
                                                <span className="font-semibold text-sm">{result.data.createdBy}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setResult(null);
                                        setQrCode('');
                                    }}
                                    className="block w-full bg-gray-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                                >
                                    Search Another QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
