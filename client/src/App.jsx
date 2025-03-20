import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Chat/Chat";
import Login from "./Auth/Login";
import Register from "./Auth/Register";  // Import Register component
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Router>
            <Navbar />
            <div className="App">
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
