import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage
        const savedUser = localStorage.getItem('bng_user');
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Failed to parse saved user:', e);
                localStorage.removeItem('bng_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            
            if (response.success && response.data) {
                const userData = {
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name,
                    fullName: response.data.name,
                    role: response.data.role,
                    token: response.data.token
                };
                
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('bng_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, error: response.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: error.message || 'An error occurred during login. Please try again.' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('bng_user');
        localStorage.removeItem('bng_token');
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('bng_user', JSON.stringify(updatedUser));
    };

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
