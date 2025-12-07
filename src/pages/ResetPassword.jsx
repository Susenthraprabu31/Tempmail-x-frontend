import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import './Auth.css';

/**
 * Reset Password Page
 * Allows users to set a new password after OTP verification
 */
const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];

        return {
            strength: Math.min(strength, 5),
            label: labels[Math.min(strength - 1, 4)] || 'Weak',
            color: colors[Math.min(strength - 1, 4)] || colors[0]
        };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(data.message);
                // Navigate to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
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
                        <h1 className="gradient-text">Reset Password</h1>
                        <p className="auth-subtitle">
                            Enter your new password for<br />
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
                        <div className="form-group">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="New Password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                            {newPassword && (
                                <motion.div
                                    className="password-strength"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="strength-bar">
                                        <motion.div
                                            className="strength-fill"
                                            style={{ backgroundColor: passwordStrength.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <span className="strength-label" style={{ color: passwordStrength.color }}>
                                        {passwordStrength.label}
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <div className="form-group">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <motion.span
                                    className="field-error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    Passwords do not match
                                </motion.span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                            disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                        >
                            Reset Password
                        </Button>
                    </motion.form>

                    <motion.div
                        className="auth-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <Link to="/login" className="auth-link">
                            ← Back to Login
                        </Link>
                    </motion.div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
