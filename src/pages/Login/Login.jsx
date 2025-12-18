import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="login-brand">
                    <div className="login-logo">P</div>
                    <h1>Pulpy Reporting Portal</h1>
                    <p>Affiliate Management Platform</p>
                </div>

                <div className="login-card">
                    <h2 className="login-title">Welcome Back!</h2>
                    <p className="login-subtitle">Sign in to continue to your dashboard</p>

                    {error && <div className="login-error">{error}</div>}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="login-options">
                            <label className="login-remember">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>
                        </div>

                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

            
                </div>
            </div>

            <div className="login-right">
                <div className="login-illustration">
                    <h2>Manage Your Offers</h2>
                    <p>Track affiliates, advertisers, and offers all in one place with our powerful dashboard.</p>

                    <div className="login-features">
                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                                    <line x1="7" y1="7" x2="7.01" y2="7" />
                                </svg>
                            </div>
                            <div>
                                <h4>Offer Management</h4>
                                <p>Create and manage unlimited offers</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                                    <path d="M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <div>
                                <h4>Affiliate Tracking</h4>
                                <p>Monitor affiliate performance in real-time</p>
                            </div>
                        </div>

                        <div className="login-feature">
                            <div className="login-feature-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="20" x2="12" y2="10" />
                                    <line x1="18" y1="20" x2="18" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="16" />
                                </svg>
                            </div>
                            <div>
                                <h4>Analytics Dashboard</h4>
                                <p>Get insights with detailed reports</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
