import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Failed to parse saved user:', err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    /**
     * Signup new user
     */
    const signup = async (email, password, name) => {
        try {
            setError(null);
            const response = await api.post('/auth/signup', { email, password, name });
            const { user, token } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Signup failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    /**
     * Login user
     */
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    /**
     * Logout user
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    /**
     * Handle Google OAuth callback
     */
    const handleGoogleCallback = (token) => {
        try {
            localStorage.setItem('token', token);
            // Fetch user data
            api.get('/auth/me').then((response) => {
                const user = response.data.data.user;
                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
            });
        } catch (err) {
            console.error('Google auth callback error:', err);
            setError('Google authentication failed');
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        handleGoogleCallback,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
