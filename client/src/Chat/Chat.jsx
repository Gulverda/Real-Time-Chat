import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";
const socket = io(API_URL);

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [recipient, setRecipient] = useState("");

    useEffect(() => {
        if (!user) return;

        socket.emit("userJoined", user.username);

        socket.on("updateOnlineUsers", (users) => {
            setOnlineUsers(users);
        });

        socket.on("receivePrivateMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.emit("userLeft", user.username);
            socket.off("receivePrivateMessage");
            socket.off("updateOnlineUsers");
        };
    }, [user]);

    const fetchPrivateMessages = async (recipient) => {
        if (!recipient) return;
        setRecipient(recipient);

        try {
            const res = await axios.get(`${API_URL}/api/messages/${user.username}/${recipient}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMessages(res.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    const sendPrivateMessage = () => {
        if (!message.trim() || !recipient) return;

        socket.emit("sendPrivateMessage", { sender: user.username, recipient, message });
        setMessage("");
    };

    if (!user) return <h2 className="text-center text-xl font-semibold">Please Login to Chat</h2>;

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Private Messages</h2>

            {/* Online Users Section */}
            <div className="mb-4 p-3 border border-gray-300 rounded-lg bg-gray-100">
                <h4 className="text-xl font-semibold mb-2">Online Users:</h4>
                {onlineUsers.length > 0 ? (
                    onlineUsers.filter((username) => username !== user.username).map((username, index) => (
                        <div 
                            key={index} 
                            onClick={() => fetchPrivateMessages(username)} 
                            className="cursor-pointer text-blue-600 hover:underline"
                        >
                            📩 {username}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No users online.</p>
                )}
            </div>

            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto border border-gray-300 p-3 rounded-lg mb-4 bg-gray-50">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`mb-2 ${msg.username === user.username ? "text-right" : "text-left"}`}
                        >
                            <strong className={`text-sm ${msg.username === user.username ? "text-blue-600" : "text-gray-700"}`}>{msg.username}: </strong>
                            <span className={`px-2 py-1 rounded-lg inline-block ${msg.username === user.username ? "bg-blue-100" : "bg-gray-200"}`}>{msg.message}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No messages yet.</p>
                )}
            </div>

            {/* Input and Send Button */}
            <div className="flex items-center gap-2">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button 
                    onClick={sendPrivateMessage} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
