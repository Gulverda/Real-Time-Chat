import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import AuthContext from "./context/AuthContext";

const socket = io("http://localhost:5000");

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!user) return;

        axios
            .get("http://localhost:5000/api/messages", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => setMessages(res.data))
            .catch((err) => console.error("Error fetching messages:", err));

        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [user]); // Re-run effect when `user` changes

    const sendMessage = () => {
        if (!message.trim()) return;
        if (!user) return alert("You must be logged in to send messages.");

        socket.emit("sendMessage", { username: user.username, message });
        setMessage("");
    };

    if (!user) return <h2>Please Login to Chat</h2>;

    return (
        <div>
            <h2>Realtime Chat</h2>
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.username}: </strong> {msg.message}
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
