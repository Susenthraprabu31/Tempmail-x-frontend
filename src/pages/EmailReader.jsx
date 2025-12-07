import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmail } from '../hooks/useEmail';
import Card from '../components/Card';
import Button from '../components/Button';
import './EmailReader.css';

/**
 * Email Reader Page
 */
const EmailReader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getEmail, deleteEmail } = useEmail();
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmail = async () => {
            const result = await getEmail(id);
            if (result.success) {
                setEmail(result.email);
            } else {
                // Email not found, redirect to inbox
                navigate('/inbox');
            }
            setLoading(false);
        };

        loadEmail();
    }, [id, getEmail, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this email?')) {
            await deleteEmail(id);
            navigate(email?.isOutbound ? '/outbox' : '/inbox');
        }
    };

    const handleBack = () => {
        navigate(email?.isOutbound ? '/outbox' : '/inbox');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="email-reader-loading">
                <div className="spinner"></div>
                <p>Loading email...</p>
            </div>
        );
    }

    if (!email) {
        return null;
    }

    return (
        <div className="email-reader-page">
            <div className="email-reader-container">
                <motion.div
                    className="email-reader-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button variant="ghost" onClick={handleBack}>
                        ← Back
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        🗑️ Delete
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="email-reader-card">
                        <div className="email-subject-header">
                            <h1>{email.subject}</h1>
                            {!email.isRead && <span className="email-badge">New</span>}
                        </div>

                        <div className="email-meta">
                            <div className="email-meta-row">
                                <span className="email-meta-label">From:</span>
                                <span className="email-meta-value">{email.from}</span>
                            </div>
                            <div className="email-meta-row">
                                <span className="email-meta-label">To:</span>
                                <span className="email-meta-value">{email.to}</span>
                            </div>
                            <div className="email-meta-row">
                                <span className="email-meta-label">Date:</span>
                                <span className="email-meta-value">{formatDate(email.createdAt)}</span>
                            </div>
                        </div>

                        <div className="email-divider"></div>

                        <div className="email-body">
                            {email.body}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailReader;
