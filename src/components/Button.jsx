import { motion } from 'framer-motion';
import './Button.css';

/**
 * Reusable Button Component
 * @param {string} variant - Button style: 'primary', 'secondary', 'ghost', 'danger'
 * @param {string} size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} fullWidth - Whether button should take full width
 * @param {boolean} loading - Show loading state
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} type - Button type: 'button', 'submit', 'reset'
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    children,
    onClick,
    type = 'button',
    ...props
}) => {
    const className = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`;

    return (
        <motion.button
            className={className}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="btn-spinner"></span>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
