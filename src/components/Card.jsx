import { motion } from 'framer-motion';
import './Card.css';

/**
 * Reusable Card Component with glassmorphism effect
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {boolean} hover - Enable hover animation
 */
const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <motion.div
            className={`card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-xl)' } : {}}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
