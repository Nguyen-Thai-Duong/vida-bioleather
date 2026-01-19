/**
 * Confirm Dialog Component
 * Modern replacement for window.confirm()
 */

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) {
    const styles = {
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        danger: 'bg-red-600 hover:bg-red-700',
        success: 'bg-green-600 hover:bg-green-700',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 ${styles[type]} text-white py-3 rounded-lg font-semibold transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
