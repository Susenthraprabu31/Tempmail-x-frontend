import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Footer.css';

/**
 * Animated Footer Component
 * Features glassmorphism, animations, and interactive elements
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const socialLinks = [
        { name: 'GitHub', icon: '🐙', url: '#' },
        { name: 'Twitter', icon: '🐦', url: '#' },
        { name: 'LinkedIn', icon: '💼', url: '#' },
        { name: 'Discord', icon: '💬', url: '#' }
    ];

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Inbox', path: '/inbox' },
        { name: 'Compose', path: '/compose' }
    ];

    const legalLinks = [
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms of Service', path: '#' },
        { name: 'Cookie Policy', path: '#' },
        { name: 'GDPR', path: '#' }
    ];

    // Handle newsletter subscription
    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage('Please enter your email address');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setIsSubmitting(true);

        try {
            // Call backend API
            const response = await fetch('http://localhost:5000/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success message
                setMessage('Thank you for subscribing! 🎉');
                setEmail('');

                // Clear message after 5 seconds
                setTimeout(() => setMessage(''), 5000);
            } else {
                // Show error message from server
                setMessage(data.message || 'Failed to subscribe. Please try again.');
                setTimeout(() => setMessage(''), 4000);
            }

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setMessage('Network error. Please check your connection and try again.');
            setTimeout(() => setMessage(''), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.footer
            className="footer"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* Animated background gradient */}
            <div className="footer-gradient"></div>

            <div className="footer-container">
                {/* Top Section */}
                <div className="footer-top">
                    {/* Brand Section */}
                    <motion.div className="footer-brand" variants={itemVariants}>
                        <h3 className="footer-logo">
                            <span className="gradient-text">TempMailX</span>
                        </h3>
                        <p className="footer-tagline">
                            Secure temporary email for anonymous communication
                        </p>
                        <div className="footer-stats">
                            <motion.div
                                className="stat-item"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="stat-number gradient-text">10K+</span>
                                <span className="stat-label">Active Users</span>
                            </motion.div>
                            <motion.div
                                className="stat-item"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="stat-number gradient-text">1M+</span>
                                <span className="stat-label">Emails Sent</span>
                            </motion.div>
                            <motion.div
                                className="stat-item"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="stat-number gradient-text">99.9%</span>
                                <span className="stat-label">Uptime</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div className="footer-links" variants={itemVariants}>
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-list">
                            {quickLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Link to={link.path} className="footer-link">
                                        <span className="link-arrow">→</span>
                                        {link.name}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Legal Links */}
                    <motion.div className="footer-links footer-legal" variants={itemVariants}>
                        <h4 className="footer-heading">Legal</h4>
                        <ul className="footer-list">
                            {legalLinks.map((link, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <a href={link.path} className="footer-link">
                                        <span className="link-arrow">→</span>
                                        {link.name}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Newsletter Section */}
                    <motion.div className="footer-newsletter" variants={itemVariants}>
                        <h4 className="footer-heading">Stay Updated</h4>
                        <p className="newsletter-text">
                            Get the latest updates and security tips
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <motion.button
                                type="submit"
                                className="newsletter-button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            </motion.button>
                            {message && (
                                <motion.p
                                    className={`newsletter-message ${message.includes('Thank you') ? 'success' : 'error'}`}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {message}
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>

                {/* Divider with animation */}
                <motion.div
                    className="footer-divider"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                ></motion.div>

                {/* Bottom Section */}
                <motion.div className="footer-bottom" variants={itemVariants}>
                    <div className="footer-copyright">
                        <p>
                            © {currentYear} <span className="gradient-text">TempMailX</span>.
                            All rights reserved. Made with <span className="heart">❤️</span>
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="footer-social">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                className="social-link glass"
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 5,
                                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)"
                                }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                aria-label={social.name}
                            >
                                <span className="social-icon">{social.icon}</span>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Floating particles animation */}
                <div className="footer-particles">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="particle"
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.5, 0.2],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                            style={{
                                left: `${15 + i * 15}%`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
