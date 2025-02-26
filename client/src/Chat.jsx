import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 100));

  // Fetch previous messages
  useEffect(() => {
    axios.get("http://localhost:5000/api/messages").then((res) => {
      setMessages(res.data);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { username, message };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Realtime Chat</h2>
      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}: </strong> {msg.message}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
