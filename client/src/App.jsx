import { useContext } from "react";
import Chat from "./Chat";
import Login from "./Auth/Login";
import AuthContext from "./context/AuthContext";

function App() {
    const { user, loading, logout } = useContext(AuthContext);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="App">
            {user ? (
                <>
                    <button onClick={logout}>Logout</button>
                    <Chat />
                </>
            ) : (
                <Login />
            )}
        </div>
    );
}

export default App;
