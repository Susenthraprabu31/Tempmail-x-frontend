import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Landing.css';

/**
 * Landing Page
 */
const Landing = () => {
    return (
        <div className="landing">
            {/* Hero Section */}
            <section className="hero">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="hero-title">
                        Secure <span className="gradient-text">Temporary Email</span>
                        <br />
                        for Anonymous Communication
                    </h1>

                    <p className="hero-subtitle">
                        Protect your privacy with disposable email addresses. No registration required.
                        Perfect for testing, signups, and secure communication.
                    </p>

                    <div className="hero-cta">
                        <Link to="/signup">
                            <Button variant="primary" size="lg">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg">
                                Login
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="features">
                <motion.h2
                    className="features-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Why Choose TempMailX?
                </motion.h2>

                <div className="features-grid">
                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="feature-icon">🔒</div>
                        <h3>100% Secure</h3>
                        <p>End-to-end encryption ensures your emails remain private and secure</p>
                    </motion.div>

                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Setup</h3>
                        <p>Generate temporary email addresses in seconds with one click</p>
                    </motion.div>

                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="feature-icon">🔄</div>
                        <h3>Auto-Refresh</h3>
                        <p>Real-time inbox updates so you never miss an important email</p>
                    </motion.div>

                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="feature-icon">🗑️</div>
                        <h3>Auto-Delete</h3>
                        <p>Emails automatically expire after 24 hours for maximum privacy</p>
                    </motion.div>

                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="feature-icon">📧</div>
                        <h3>Send & Receive</h3>
                        <p>Full email functionality - send and receive messages seamlessly</p>
                    </motion.div>

                    <motion.div
                        className="feature-card glass"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="feature-icon">📱</div>
                        <h3>Mobile Friendly</h3>
                        <p>Responsive design works perfectly on all devices</p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <motion.div
                    className="cta-content glass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2>Ready to protect your privacy?</h2>
                    <p>Join thousands of users who trust TempMailX for secure communication</p>
                    <Link to="/signup">
                        <Button variant="primary" size="lg">
                            Create Free Account
                        </Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

export default Landing;
