import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, { username, password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 1000); // Redirect to login after 1 sec
        } catch (err) {
            setMessage(err.response?.data?.error || "Registration failed!");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-[#FDFDFF] border border-[#E1E2FF] shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full p-3 mb-4 border border-[#A5A6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5A6F6]"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full p-3 mb-4 border border-[#A5A6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5A6F6]"
                />
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required
                    className="w-full p-3 mb-4 border border-[#A5A6F6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A5A6F6]"
                />
                <button 
                    type="submit"
                    className="w-full p-3 bg-[#5D5FEF] text-white rounded-lg hover:bg-blue-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
