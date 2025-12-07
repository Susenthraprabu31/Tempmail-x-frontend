import { createContext, useState, useCallback } from 'react';
import api from '../utils/api';

export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
    const [tempEmails, setTempEmails] = useState([]);
    const [inbox, setInbox] = useState([]);
    const [outbox, setOutbox] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Create a new temporary email
     */
    const createTempEmail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/email/create');
            const { tempEmail } = response.data.data;

            setTempEmails((prev) => [...prev, tempEmail]);
            return { success: true, tempEmail };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to create temp email';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetch inbox
     */
    const fetchInbox = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/email/inbox');
            setInbox(response.data.data.emails);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch inbox';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch outbox
     */
    const fetchOutbox = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/email/outbox');
            setOutbox(response.data.data.emails);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch outbox';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get email by ID
     */
    const getEmail = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/email/${id}`);
            return { success: true, email: response.data.data.email };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to fetch email';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Send email
     */
    const sendEmail = async (from, to, subject, body) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/email/send', { from, to, subject, body });

            // Refresh outbox
            await fetchOutbox();

            return { success: true, email: response.data.data.email };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send email';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Delete email
     */
    const deleteEmail = async (id) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/email/${id}`);

            // Remove from local state
            setInbox((prev) => prev.filter((email) => email.id !== id));
            setOutbox((prev) => prev.filter((email) => email.id !== id));

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to delete email';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        tempEmails,
        inbox,
        outbox,
        loading,
        error,
        createTempEmail,
        fetchInbox,
        fetchOutbox,
        getEmail,
        sendEmail,
        deleteEmail
    };

    return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};
