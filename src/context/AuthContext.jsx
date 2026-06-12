import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://localhost:7233/api/Authenticate';

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        if (token) {
            const decoded = parseJwt(token);
            setUser({ 
                username: localStorage.getItem('username'),
                role: decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User"
            });
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
            const decoded = parseJwt(data.token);
            const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User";

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            
            setToken(data.token);
            setUser({ username, role });
            
            return { success: true, role };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
