import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import './Auth.css';

/**
 * Forgot Password Page
 * Allows users to request a password reset OTP
 */
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(data.message);
                // Navigate to OTP verification page after 2 seconds
                setTimeout(() => {
                    navigate('/verify-otp', { state: { email } });
                }, 2000);
            } else {
                setError(data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="auth-card">
                    <motion.div
                        className="auth-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h1 className="gradient-text">Forgot Password?</h1>
                        <p>Enter your email address and we'll send you an OTP to reset your password</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            className="auth-error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            className="alert alert-success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <span className="alert-icon">✓</span>
                            {success}
                        </motion.div>
                    )}

                    <motion.form
                        onSubmit={handleSubmit}
                        className="auth-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Input
                            type="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Send OTP
                        </Button>
                    </motion.form>

                    <motion.div
                        className="auth-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        Remember your password?{' '}
                        <Link to="/login" className="auth-link">
                            Back to Login
                        </Link>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
