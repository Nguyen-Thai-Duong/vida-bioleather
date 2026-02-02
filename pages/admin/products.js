/**
 * Admin Product Management
 * Full CRUD interface for managing products
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useAuthStore from '../../store/authStore';
import Modal from '../../components/Modal';

export default function AdminProducts() {
    const router = useRouter();
    const { user, isAuthenticated, checkAuth } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        metadata: {
            productName: '',
            category: '',
            materialOrigin: '',
            sizeWeight: '',
            features: '',
            usageApplication: '',
            keySellingPoints: ''
        }
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Modal state
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: null,
        showCancel: false
    });

    const showModal = (type, title, message, onConfirm = null, showCancel = false) => {
        setModal({ isOpen: true, type, title, message, onConfirm, showCancel });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user && user.role !== 'admin') {
            router.push('/');
        } else {
            fetchProducts();
        }
    }, [isAuthenticated, user]);

    const fetchProducts = async () => {
        try {
            // Add timestamp to bypass Vercel edge cache
            const response = await fetch(`/api/products?_t=${Date.now()}`);
            const data = await response.json();
            console.log('Fetched products (without images):', data);
            if (response.ok && data.success && data.products) {
                // Fetch images separately for each product
                const productsWithImages = await Promise.all(
                    data.products.map(async (product) => {
                        try {
                            const imgRes = await fetch(`/api/products/${product.id}/image`);
                            if (imgRes.ok) {
                                const imgData = await imgRes.json();
                                return { ...product, image: imgData.image };
                            }
                        } catch (err) {
                            console.warn(`Failed to load image for ${product.name}`);
                        }
                        return product;
                    })
                );
                console.log('Products with images loaded:', productsWithImages.length);
                setProducts(productsWithImages);
            } else {
                console.warn('No products found or invalid response');
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle metadata fields separately
        if (name.startsWith('metadata.')) {
            const metadataField = name.split('.')[1];
            setFormData({
                ...formData,
                metadata: {
                    ...formData.metadata,
                    [metadataField]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showModal(
                    'warning',
                    'Image File Too Large',
                    'The selected image is larger than 5MB. Please choose a smaller image file to continue.\n\n💡 Tip: You can compress your image using online tools before uploading.'
                );
                return;
            }
            if (!file.type.startsWith('image/')) {
                showModal(
                    'warning',
                    'Invalid File Type',
                    'Please select a valid image file (JPG, PNG, or GIF format).\n\nThe file you selected is not an image.'
                );
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editing ? '/api/admin/products' : '/api/admin/products';
        const method = editing ? 'PUT' : 'POST';

        let imageData = formData.image;
        if (imageFile) {
            const reader = new FileReader();
            imageData = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(imageFile);
            });
        }

        const body = editing
            ? { ...formData, image: imageData, productId: editing }
            : { ...formData, image: imageData };

        console.log('Submitting product:', {
            ...body,
            image: body.image ? `base64 string (${body.image.length} chars)` : 'NO IMAGE',
            imageFile: imageFile ? 'New file selected' : 'No new file',
            formDataImage: formData.image ? `Existing (${formData.image.length} chars)` : 'No existing image'
        });

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            console.log('Response:', response.status, data);

            if (response.ok) {
                if (editing) {
                    showModal(
                        'success',
                        'Product Updated Successfully!',
                        'Your product changes have been saved and are now live on the store.\n\n✓ Changes are visible immediately\n✓ QR code updated if needed\n✓ Customers will see the new information'
                    );
                } else {
                    showModal(
                        'success',
                        'Product Created Successfully!',
                        'Your new product has been added to the store and is now available for customers to purchase.\n\n✓ Product is live on the store\n✓ QR code automatically generated\n✓ Ready for customer orders'
                    );
                }
                resetForm();
                fetchProducts();
            } else {
                const errorMsg = data.error || 'Unknown error occurred';
                showModal(
                    'error',
                    'Operation Failed',
                    `${errorMsg}\n\nPlease check your input and try again. If the problem persists, contact support.`
                );
            }
        } catch (error) {
            console.error('Error saving product:', error);
            showModal(
                'error',
                'Connection Error',
                'Unable to save the product due to a network error.\n\nPlease check your internet connection and try again.\n\n⚠️ If the issue persists, the server may be temporarily unavailable.'
            );
        }
    };

    const handleEdit = (product) => {
        setEditing(product._id.toString());
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            metadata: {
                productName: product.metadata?.productName || '',
                category: product.metadata?.category || '',
                materialOrigin: product.metadata?.materialOrigin || '',
                sizeWeight: product.metadata?.sizeWeight || '',
                features: product.metadata?.features || '',
                usageApplication: product.metadata?.usageApplication || '',
                keySellingPoints: product.metadata?.keySellingPoints || ''
            }
        });
        setImageFile(null);
        setImagePreview(null);
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        showModal(
            'question',
            'DELETE PRODUCT - Confirmation Required',
            'Are you absolutely sure you want to delete this product?\n\n⚠️ This action cannot be undone and will:\n\n• Remove the product from your store\n• Delete all associated data and QR codes\n• Remove it from customer wishlists\n\nClick Confirm to permanently delete, or Cancel to keep the product.',
            async () => {
                closeModal();
                try {
                    const response = await fetch('/api/admin/products', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId }),
                    });

                    if (response.ok) {
                        showModal(
                            'success',
                            'Product Deleted Successfully',
                            'The product has been permanently removed from your store.\n\n✓ Product removed from database\n✓ QR code deactivated\n✓ No longer visible to customers'
                        );
                        fetchProducts();
                    } else {
                        const data = await response.json();
                        const errorMsg = data.error || 'Unknown error occurred';
                        showModal(
                            'error',
                            'Delete Failed',
                            `${errorMsg}\n\nThe product could not be deleted. Please try again or contact support if the problem continues.`
                        );
                    }
                } catch (error) {
                    showModal(
                        'error',
                        'Connection Error',
                        'Unable to delete the product due to a network error.\n\nPlease check your internet connection and try again.'
                    );
                }
            },
            true
        );
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            metadata: {
                productName: '',
                category: '',
                materialOrigin: '',
                sizeWeight: '',
                features: '',
                usageApplication: '',
                keySellingPoints: ''
            }
        });
        setImageFile(null);
        setImagePreview(null);
        setEditing(null);
        setShowForm(false);
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
                <title>Manage Products - Admin</title>
            </Head>

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Manage Products</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        {showForm ? 'Cancel' : 'Add New Product'}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Product Name</label>
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
                                <label className="block text-sm font-semibold mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Price (₫)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Product Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!editing && !imagePreview}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Upload image from your device (Max 5MB, JPG/PNG/GIF)</p>
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="text-sm font-semibold mb-2">Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="w-full h-48 object-cover rounded border"
                                    />
                                </div>
                            )}
                            {editing && formData.image && !imagePreview && (
                                <div className="mt-2">
                                    <p className="text-sm font-semibold mb-2">Current Image:</p>
                                    <img
                                        src={formData.image}
                                        alt="Current product"
                                        className="w-full h-48 object-cover rounded border"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Upload a new image to replace this one</p>
                                </div>
                            )}

                            {/* Product Information (Metadata) */}
                            <div className="border-t pt-4 mt-4">
                                <h3 className="text-lg font-bold mb-3">Product Information</h3>
                                <p className="text-xs text-gray-500 mb-3">Leave fields empty if not applicable</p>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="metadata.productName"
                                        value={formData.metadata.productName}
                                        onChange={handleChange}
                                        placeholder="Enter product name or leave empty"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="metadata.category"
                                        value={formData.metadata.category}
                                        onChange={handleChange}
                                        placeholder="Enter category or leave empty"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Material / Origin</label>
                                    <input
                                        type="text"
                                        name="metadata.materialOrigin"
                                        value={formData.metadata.materialOrigin}
                                        onChange={handleChange}
                                        placeholder="Enter material or origin or leave empty"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Size / Weight</label>
                                    <input
                                        type="text"
                                        name="metadata.sizeWeight"
                                        value={formData.metadata.sizeWeight}
                                        onChange={handleChange}
                                        placeholder="Enter size or weight or leave empty"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Features</label>
                                    <textarea
                                        name="metadata.features"
                                        value={formData.metadata.features}
                                        onChange={handleChange}
                                        placeholder="Enter product features or leave empty"
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Usage / Application</label>
                                    <textarea
                                        name="metadata.usageApplication"
                                        value={formData.metadata.usageApplication}
                                        onChange={handleChange}
                                        placeholder="Enter usage or application or leave empty"
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-semibold mb-1">Key Selling Points</label>
                                    <textarea
                                        name="metadata.keySellingPoints"
                                        value={formData.metadata.keySellingPoints}
                                        onChange={handleChange}
                                        placeholder="Enter key selling points or leave empty"
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                >
                                    {editing ? 'Update Product' : 'Create Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products && products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product._id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded mr-3" />
                                                <div>
                                                    <p className="font-semibold">{product.name}</p>
                                                    <p className="text-sm text-gray-600">{product.description.substring(0, 50)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id.toString())}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No products found. Click "Add New Product" to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Component */}
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onConfirm={modal.onConfirm}
                showCancel={modal.showCancel}
            />
        </>
    );
}
