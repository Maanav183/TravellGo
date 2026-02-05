import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initial load
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user'); // Clear corrupted data
            }
        }
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Helper to handle inconsistent ID naming in backend
    const getCustomerId = () => {
        if (!user) return null;
        return user.customer_id || user.Customer_id || user.customerId || user.id;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, getCustomerId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
