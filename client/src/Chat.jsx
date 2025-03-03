import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import AuthContext from "./context/AuthContext";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";
const socket = io(API_URL);

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [recipient, setRecipient] = useState(""); // Recipient for DMs

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

    if (!user) return <h2>Please Login to Chat</h2>;

    return (
        <div>
            <h2>Private Messages</h2>

            {/* Online Users Section */}
            <div style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
                <h4>Online Users:</h4>
                {onlineUsers.length > 0 ? (
                    onlineUsers
                        .filter((username) => username !== user.username) // Don't show self
                        .map((username, index) => (
                            <div key={index} onClick={() => fetchPrivateMessages(username)} style={{ cursor: "pointer", color: "blue" }}>
                                📩 {username}
                            </div>
                        ))
                ) : (
                    <p>No users online.</p>
                )}
            </div>

            {/* Chat Messages */}
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.username === user.username ? "right" : "left" }}>
                            <strong>{msg.username}: </strong> {msg.message}
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>

            {/* Input and Send Button */}
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendPrivateMessage}>Send</button>
        </div>
    );
};

export default Chat;
