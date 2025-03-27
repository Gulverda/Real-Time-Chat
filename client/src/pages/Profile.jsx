import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.VITE_API || "http://localhost:5000";


const Profile = () => {
    const [user, setUser] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/api/auth/verify`, {
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
            const response = await axios.put(
                `${API_URL}/api/auth/update-profile`, {
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

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${API_URL}/api/auth/change-password`, {
                oldPassword,
                newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage(response.data.message);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error changing password", error);
            setMessage(error.response?.data?.error || "Failed to change password");
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

            <div className="mb-6">
                <label htmlFor="oldPassword" className="block text-gray-700 text-lg font-medium mb-2">Old Password</label>
                <input
                    id="oldPassword"
                    type="password"
                    placeholder="Enter your old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="newPassword" className="block text-gray-700 text-lg font-medium mb-2">New Password</label>
                <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 text-lg font-medium mb-2">Confirm New Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div className="text-center mb-4">
                <button 
                    onClick={handleChangePassword} 
                    className="w-full sm:w-auto py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                    Change Password
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
