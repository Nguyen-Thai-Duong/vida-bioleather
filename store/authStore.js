/**
 * Authentication Store using Zustand
 * Global state management for user authentication
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // Current user data
            user: null,
            isAuthenticated: false,
            isLoading: true,

            // Set user data
            setUser: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: !!userData,
                    isLoading: false,
                });
            },

            // Login function
            login: async (email, password) => {
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        set({
                            user: data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true, user: data.user };
                    } else {
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    return { success: false, error: 'Login failed. Please try again.' };
                }
            },

            // Register function
            register: async (userData) => {
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        set({
                            user: data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                        return { success: true, user: data.user };
                    } else {
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    return { success: false, error: 'Registration failed. Please try again.' };
                }
            },

            // Logout function
            logout: async () => {
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                } catch (error) {
                    console.error('Logout error:', error);
                }

                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            // Check auth status
            checkAuth: async () => {
                try {
                    const response = await fetch('/api/auth/me');
                    const data = await response.json();

                    if (response.ok && data.user) {
                        set({
                            user: data.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            // Check if user is admin
            isAdmin: () => {
                const user = get().user;
                return user && user.role === 'admin';
            },

            // Check if user is customer
            isCustomer: () => {
                const user = get().user;
                return user && (user.role === 'customer' || user.role === 'admin');
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;
