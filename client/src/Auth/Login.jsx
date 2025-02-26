import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
    
        const res = await login(username, password); // Now `res` is an object with `success` and `error`
        setLoading(false);
    
        if (!res.success) {
            setError(res.error); // ✅ Set error message
        } else {
            window.location.reload(); // ✅ Refresh the page after successful login
        }
    };
    

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
};

export default Login;
