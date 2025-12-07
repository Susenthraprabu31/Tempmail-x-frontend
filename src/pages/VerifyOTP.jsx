import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import './Auth.css';

/**
 * Verify OTP Page
 * Allows users to enter and verify the OTP sent to their email
 */
const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resending, setResending] = useState(false);

    const inputRefs = useRef([]);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');

        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpCode })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(data.message);
                // Navigate to reset password page after 1 second
                setTimeout(() => {
                    navigate('/reset-password', { state: { email } });
                }, 1000);
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError('');
        setSuccess('');

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
                setSuccess('New OTP has been sent to your email');
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

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
                        <h1 className="gradient-text">Verify OTP</h1>
                        <p className="auth-subtitle">
                            Enter the 6-digit code sent to<br />
                            <strong>{email}</strong>
                        </p>
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
                        <div className="otp-inputs">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    disabled={loading}
                                    className="otp-input"
                                    autoFocus={index === 0}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                                    whileFocus={{ scale: 1.1, borderColor: '#10b981' }}
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            disabled={otp.join('').length !== 6}
                        >
                            Verify OTP
                        </Button>
                    </motion.form>

                    <motion.div
                        className="auth-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <p>
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="link-button"
                                disabled={resending}
                            >
                                {resending ? 'Resending...' : 'Resend OTP'}
                            </button>
                        </p>
                        <p style={{ marginTop: '8px' }}>
                            <Link to="/forgot-password" className="auth-link">
                                ← Back
                            </Link>
                        </p>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
