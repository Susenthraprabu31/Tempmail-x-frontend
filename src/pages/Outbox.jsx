import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useEmail } from '../hooks/useEmail';
import EmailCard from '../components/EmailCard';
import Button from '../components/Button';
import './Inbox.css';

/**
 * Outbox Page
 */
const Outbox = () => {
    const { outbox, fetchOutbox, deleteEmail, loading } = useEmail();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOutbox();
    }, [fetchOutbox]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOutbox();
        setRefreshing(false);
    };

    const handleDelete = async (id) => {
        await deleteEmail(id);
    };

    return (
        <div className="outbox-page">
            <div className="outbox-container">
                <motion.div
                    className="outbox-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>📤 Outbox</h1>
                        <p>{outbox.length} {outbox.length === 1 ? 'email' : 'emails'} sent</p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        loading={refreshing}
                    >
                        🔄 Refresh
                    </Button>
                </motion.div>

                {loading && outbox.length === 0 ? (
                    <div className="outbox-loading">
                        <div className="spinner"></div>
                        <p>Loading emails...</p>
                    </div>
                ) : outbox.length === 0 ? (
                    <motion.div
                        className="outbox-empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-icon">📭</div>
                        <h2>No sent emails</h2>
                        <p>Emails you send will appear here.</p>
                    </motion.div>
                ) : (
                    <div className="outbox-list">
                        {outbox.map((email) => (
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

export default Outbox;
