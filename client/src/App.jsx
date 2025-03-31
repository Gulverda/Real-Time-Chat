import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Chat from "./Chat/Chat";
import Login from "./Auth/Login";
import Register from "./Auth/Register";  // Import Register component
import AuthContext from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Profile";

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <h2>Loading...</h2>;

    return (
        <Router>
            <Navbar />
            <div className="App flex w-full justify-center">
                <Routes>
                    <Route path="/" element={user ? <Chat /> : <Navigate replace to="/login" />} />
                    <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate replace to="/" />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate replace to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
