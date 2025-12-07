import { forwardRef } from 'react';
import './Input.css';

/**
 * Reusable Input Component
 * @param {string} type - Input type
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {boolean} fullWidth - Whether input should take full width
 * @param {string} icon - Icon to display (optional)
 */
const Input = forwardRef(({
    type = 'text',
    label,
    placeholder,
    error,
    fullWidth = true,
    icon,
    ...props
}, ref) => {
    return (
        <div className={`input-wrapper ${fullWidth ? 'input-full' : ''}`}>
            {label && <label className="input-label">{label}</label>}

            <div className="input-container">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    ref={ref}
                    type={type}
                    className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
                    placeholder={placeholder}
                    {...props}
                />
            </div>

            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
