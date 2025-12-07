import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEmail } from '../hooks/useEmail';
import EmailCard from '../components/EmailCard';
import Button from '../components/Button';
import './Inbox.css';

/**
 * Inbox Page
 */
const Inbox = () => {
    const { inbox, fetchInbox, deleteEmail, loading } = useEmail();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchInbox();

        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchInbox();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchInbox]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchInbox();
        setRefreshing(false);
    };

    const handleDelete = async (id) => {
        await deleteEmail(id);
    };

    return (
        <div className="inbox-page">
            <div className="inbox-container">
                <motion.div
                    className="inbox-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>📥 Inbox</h1>
                        <p>{inbox.length} {inbox.length === 1 ? 'email' : 'emails'}</p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        loading={refreshing}
                    >
                        🔄 Refresh
                    </Button>
                </motion.div>

                {loading && inbox.length === 0 ? (
                    <div className="inbox-loading">
                        <div className="spinner"></div>
                        <p>Loading emails...</p>
                    </div>
                ) : inbox.length === 0 ? (
                    <motion.div
                        className="inbox-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-icon">📭</div>
                        <h2>No emails yet</h2>
                        <p>Your inbox is empty. Emails will appear here when you receive them.</p>
                    </motion.div>
                ) : (
                    <div className="inbox-list">
                        {inbox.map((email) => (
                            <EmailCard
                                key={email.id}
                                email={email}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
