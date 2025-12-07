import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmailProvider } from './context/EmailContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupVerifyOTP from './pages/SignupVerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Outbox from './pages/Outbox';
import Compose from './pages/Compose';
import EmailReader from './pages/EmailReader';
import './styles/index.css';

/**
 * Main App Component
 * Handles routing and context providers
 */
function App() {
    return (
        <AuthProvider>
            <EmailProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/signup/verify-otp" element={<SignupVerifyOTP />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/verify-otp" element={<VerifyOTP />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inbox"
                            element={
                                <ProtectedRoute>
                                    <Inbox />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/outbox"
                            element={
                                <ProtectedRoute>
                                    <Outbox />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/compose"
                            element={
                                <ProtectedRoute>
                                    <Compose />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/email/:id"
                            element={
                                <ProtectedRoute>
                                    <EmailReader />
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Footer />
                </Router>
            </EmailProvider>
        </AuthProvider>
    );
}

export default App;
