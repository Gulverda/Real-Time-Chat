import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import LoadingSpinner from "../components/Loading/LoadingSpinner";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);  

        const res = await login(username, password);

        console.log(res);  

        setLoading(false); 

        if (!res.success) {
            setError(res.error); // ✅ Set error message
        } else {
            window.location.href = "/";  // Redirect to home page after successful login
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-[#FDFDFF] border border-[#E1E2FF] shadow-sm rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full p-3 bg-[#5D5FEF] text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? <LoadingSpinner /> : null}
                Login
            </button>
        </div>
    );
};

export default Login;
