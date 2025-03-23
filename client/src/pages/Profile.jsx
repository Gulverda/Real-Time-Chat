import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/auth/verify", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put("http://localhost:5000/api/auth/update-profile", {
                username: newUsername,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({ ...user, username: newUsername });
            setMessage(response.data.message);
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage(error.response?.data?.error || "Failed to update profile");
        }
    };
    

    if (!user) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Profile Page</h2>
            
            <div className="mb-4 text-center">
                <p className="text-xl font-medium text-gray-700"><strong>Username:</strong> {user.username}</p>
            </div>
            
            <div className="mb-6">
                <label htmlFor="newUsername" className="block text-gray-700 text-lg font-medium mb-2">New Username</label>
                <input
                    id="newUsername"
                    type="text"
                    placeholder="Enter your new username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            
            <div className="text-center">
                <button 
                    onClick={handleUpdate} 
                    className="w-full sm:w-auto py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Update
                </button>
            </div>
            
            {message && (
                <div className={`mt-4 text-center p-3 rounded-lg ${message.includes('Failed') ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
