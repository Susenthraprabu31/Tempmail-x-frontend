import { useContext } from 'react';
import { EmailContext } from '../context/EmailContext';

/**
 * Custom hook to access email context
 */
export const useEmail = () => {
    const context = useContext(EmailContext);

    if (!context) {
        throw new Error('useEmail must be used within an EmailProvider');
    }

    return context;
};

export default useEmail;
