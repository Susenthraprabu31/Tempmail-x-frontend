import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './EmailCard.css';

/**
 * Email Card Component for inbox/outbox lists
 * @param {Object} email - Email object
 * @param {function} onDelete - Delete handler
 */
const EmailCard = ({ email, onDelete }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/email/${email.id}`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this email?')) {
            onDelete(email.id);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now - d;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return d.toLocaleDateString();
    };

    return (
        <motion.div
            className={`email-card ${!email.isRead ? 'email-unread' : ''}`}
            onClick={handleClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4, boxShadow: 'var(--shadow-lg)' }}
            transition={{ duration: 0.2 }}
        >
            <div className="email-card-header">
                <div className="email-from">
                    {email.isOutbound ? (
                        <>
                            <span className="email-label">To:</span> {email.to}
                        </>
                    ) : (
                        <>
                            <span className="email-label">From:</span> {email.from}
                        </>
                    )}
                </div>
                <div className="email-date">{formatDate(email.createdAt)}</div>
            </div>

            <div className="email-subject">{email.subject}</div>

            <div className="email-preview">
                {email.body.substring(0, 100)}
                {email.body.length > 100 && '...'}
            </div>

            <div className="email-card-footer">
                {!email.isRead && <span className="email-badge">New</span>}
                <button
                    className="email-delete-btn"
                    onClick={handleDelete}
                    aria-label="Delete email"
                >
                    🗑️
                </button>
            </div>
        </motion.div>
    );
};

export default EmailCard;
