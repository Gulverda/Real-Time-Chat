import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Chat/Chat";
import Login from "./Auth/Login";
import Register from "./Auth/Register";  // Import Register component
import AuthContext from "./context/AuthContext";

function App() {
    const { user, loading, logout } = useContext(AuthContext);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Router>
            <div className="App">
                {user && 
                <button onClick={logout} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200">
                    Logout
                </button>}
                <Routes>
                    <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
