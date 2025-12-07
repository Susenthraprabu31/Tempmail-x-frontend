import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../hooks/useEmail';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';
import './Dashboard.css';

/**
 * Dashboard Page
 */
const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [copiedEmail, setCopiedEmail] = useState(null);
    const { createTempEmail, tempEmails } = useEmail();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCreateEmail = async (e) => {
        // Prevent any default behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            setLoading(true);
            console.log('[Dashboard] Creating temporary email...');

            const result = await createTempEmail();
            console.log('[Dashboard] Result:', result);

            if (result.success) {
                console.log('[Dashboard] Email created successfully:', result.tempEmail);
                // Auto-copy to clipboard
                await navigator.clipboard.writeText(result.tempEmail);
                setCopiedEmail(result.tempEmail);
                setTimeout(() => setCopiedEmail(null), 3000);
            } else {
                console.error('[Dashboard] Failed to create email:', result.error);
                alert(`Failed to create email: ${result.error}`);
            }
        } catch (error) {
            console.error('[Dashboard] Error creating email:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email);
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                <motion.div
                    className="dashboard-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1>Welcome, <span className="gradient-text">{user?.name || 'User'}</span></h1>
                    <p>Manage your temporary email addresses</p>
                </motion.div>

                <div className="dashboard-grid">
                    {/* Create Email Card */}
                    <Card className="create-email-card" hover>
                        <h2>Generate Temporary Email</h2>
                        <p>Create a new disposable email address instantly</p>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            onClick={handleCreateEmail}
                        >
                            ✨ Generate Email
                        </Button>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="quick-actions-card" hover>
                        <h2>Quick Actions</h2>
                        <div className="quick-actions">
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => navigate('/inbox')}
                            >
                                📥 View Inbox
                            </Button>
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => navigate('/outbox')}
                            >
                                📤 View Outbox
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Temp Emails List */}
                {(user?.tempEmails?.length > 0 || tempEmails.length > 0) && (
                    <motion.div
                        className="temp-emails-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2>Your Temporary Emails</h2>
                        <div className="temp-emails-list">
                            {[...(user?.tempEmails || []), ...tempEmails].map((email, index) => (
                                <Card key={index} className="temp-email-item" hover>
                                    <div className="temp-email-content">
                                        <span className="temp-email-address">{email}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(email)}
                                        >
                                            {copiedEmail === email ? '✓ Copied' : '📋 Copy'}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Info Section */}
                <Card className="info-card">
                    <h3>💡 How it works</h3>
                    <ul className="info-list">
                        <li>Generate a temporary email address with one click</li>
                        <li>Use it for signups, testing, or anonymous communication</li>
                        <li>Receive emails in your inbox instantly</li>
                        <li>Send emails from your temporary address</li>
                        <li>All emails auto-delete after 24 hours</li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
