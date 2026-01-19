/**
 * Custom Modal Component
 * Replaces default browser alerts with styled modal dialogs
 */

import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, type = 'info', title, message, onConfirm, showCancel = false }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        question: '❓'
    };

    const colors = {
        success: 'bg-green-100 border-green-500 text-green-800',
        error: 'bg-red-100 border-red-500 text-red-800',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
        info: 'bg-blue-100 border-blue-500 text-blue-800',
        question: 'bg-purple-100 border-purple-500 text-purple-800'
    };

    const buttonColors = {
        success: 'bg-green-600 hover:bg-green-700',
        error: 'bg-red-600 hover:bg-red-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        info: 'bg-blue-600 hover:bg-blue-700',
        question: 'bg-purple-600 hover:bg-purple-700'
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={showCancel ? onClose : undefined}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all animate-scale-in">
                {/* Header */}
                <div className={`flex items-center gap-3 px-6 py-4 border-l-4 ${colors[type]} rounded-t-lg`}>
                    <span className="text-3xl">{icons[type]}</span>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {message}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg justify-end">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-2 text-white rounded-lg transition-colors font-semibold ${buttonColors[type]}`}
                    >
                        {showCancel ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        transform: scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
