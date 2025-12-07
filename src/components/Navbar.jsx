import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './Button';
import './Navbar.css';

/**
 * Navigation Bar Component
 */
const Navbar = () => {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-logo">
                    <span className="gradient-text">TempMailX</span>
                </Link>

                <div className="navbar-menu">
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                            <Link to="/inbox" className="navbar-link">Inbox</Link>
                            <Link to="/outbox" className="navbar-link">Outbox</Link>
                            <Link to="/compose" className="navbar-link">Compose</Link>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
