/**
 * Shopping Cart Store using Zustand
 * User-specific cart management with guest cart support
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
    persist(
        (set, get) => ({
            // Cart items array keyed by userId
            carts: {}, // { userId: [items] }
            currentUserId: 'guest', // Default to 'guest' for non-authenticated users

            // Set current user
            setUser: (userId) => {
                set({ currentUserId: userId || 'guest' });
            },

            // Get current user's items
            getItems: () => {
                const { carts, currentUserId } = get();
                return carts[currentUserId] || [];
            },

            // Add item to cart
            addItem: (product) => {
                const { carts, currentUserId } = get();
                const userItems = carts[currentUserId] || [];
                const existingItem = userItems.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        carts: {
                            ...carts,
                            [currentUserId]: userItems.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        },
                    });
                } else {
                    set({
                        carts: {
                            ...carts,
                            [currentUserId]: [...userItems, { ...product, quantity: 1 }],
                        },
                    });
                }
            },

            // Remove item from cart
            removeItem: (productId) => {
                const { carts, currentUserId } = get();
                set({
                    carts: {
                        ...carts,
                        [currentUserId]: (carts[currentUserId] || []).filter(item => item.id !== productId),
                    },
                });
            },

            // Update item quantity
            updateQuantity: (productId, quantity) => {
                const { carts, currentUserId } = get();
                if (quantity <= 0) {
                    get().removeItem(productId);
                } else {
                    set({
                        carts: {
                            ...carts,
                            [currentUserId]: (carts[currentUserId] || []).map(item =>
                                item.id === productId ? { ...item, quantity } : item
                            ),
                        },
                    });
                }
            },

            // Clear current user's cart
            clearCart: () => {
                const { carts, currentUserId } = get();
                set({
                    carts: {
                        ...carts,
                        [currentUserId]: [],
                    },
                });
            },

            // Get cart total
            getTotal: () => {
                const items = get().getItems();
                return items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            // Get cart item count
            getItemCount: () => {
                const items = get().getItems();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage', // LocalStorage key
        }
    )
);

export default useCartStore;
