import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEmail } from '../hooks/useEmail';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './Compose.css';

/**
 * Compose Email Page
 * Send emails from temporary email addresses
 */
const Compose = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { sendEmail, tempEmails, generateAIEmail } = useEmail();
    const { user } = useAuth();
    const navigate = useNavigate();

    // AI Generation states
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');


    // Get user's temp emails
    const userTempEmails = [...(user?.tempEmails || []), ...tempEmails];

    useEffect(() => {
        // Set first temp email as default
        if (userTempEmails.length > 0 && !from) {
            setFrom(userTempEmails[0]);
        }
    }, [userTempEmails, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        const result = await sendEmail(from, to, subject, body);

        if (result.success) {
            setSuccess(true);
            // Clear form
            setTo('');
            setSubject('');
            setBody('');

            // Show success message and redirect after 2 seconds
            setTimeout(() => {
                navigate('/outbox');
            }, 2000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt.trim()) {
            setAiError('Please enter a prompt for AI generation');
            return;
        }

        setAiError('');
        setAiLoading(true);

        const result = await generateAIEmail(aiPrompt);

        if (result.success) {
            // Populate subject and body with AI-generated content
            setSubject(result.subject);
            setBody(result.body);
            setAiPrompt(''); // Clear prompt after successful generation
        } else {
            setAiError(result.error);
        }

        setAiLoading(false);
    };


    if (userTempEmails.length === 0) {
        return (
            <div className="compose-page">
                <div className="compose-container">
                    <Card className="compose-empty">
                        <h2>📧 No Temporary Emails</h2>
                        <p>You need to generate a temporary email address first before you can send emails.</p>
                        <Button variant="primary" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="compose-page">
            <div className="compose-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="compose-card">
                        <div className="compose-header">
                            <h1>✉️ Compose Email</h1>
                            <p>Send an email from your temporary address</p>
                        </div>

                        {error && (
                            <div className="compose-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="compose-success">
                                ✓ Email sent successfully! Redirecting to outbox...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="compose-form">
                            <div className="form-group">
                                <label htmlFor="from">From</label>
                                <select
                                    id="from"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="compose-select"
                                    required
                                >
                                    {userTempEmails.map((email, index) => (
                                        <option key={index} value={email}>
                                            {email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                type="email"
                                label="To"
                                placeholder="recipient@example.com"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                required
                            />

                            {/* AI Email Generator */}
                            <div className="ai-composer-section">
                                <div className="ai-composer-header">
                                    <label>✨ AI Email Generator</label>
                                    <span className="ai-badge">NEW</span>
                                </div>
                                <p className="ai-composer-description">
                                    Describe what you want to write (e.g., "sick leave email", "meeting request")
                                </p>

                                <div className="ai-input-group">
                                    <input
                                        type="text"
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="e.g., sick leave email for tomorrow"
                                        className="ai-prompt-input"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAIGenerate();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleAIGenerate}
                                        loading={aiLoading}
                                        className="ai-generate-btn"
                                    >
                                        {aiLoading ? '🤖 Generating...' : '✨ Generate'}
                                    </Button>
                                </div>

                                {aiError && (
                                    <div className="ai-error">
                                        {aiError}
                                    </div>
                                )}
                            </div>


                            <Input
                                type="text"
                                label="Subject"
                                placeholder="Enter email subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />

                            <div className="form-group">
                                <label htmlFor="body">Message</label>
                                <textarea
                                    id="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="compose-textarea"
                                    rows="10"
                                    required
                                />
                            </div>

                            <div className="compose-actions">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading}
                                >
                                    📤 Send Email
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Compose;
