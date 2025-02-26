import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        axios.get("http://localhost:5000/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { username, password });
    
            // Store user and token
            setUser({ username: res.data.username, token: res.data.token });
            localStorage.setItem("token", res.data.token);
    
            return { success: true }; // ✅ Return success
        } catch (err) {
            return { success: false, error: err.response?.data?.error || "Login failed" }; // ✅ Return error
        }
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};
