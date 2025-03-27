import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import SearchUsers from "../components/SearchUser/SearchUsers";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";
const socket = io(API_URL);

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [recipient, setRecipient] = useState("");
    const [sentMessages, setSentMessages] = useState(new Set()); // Track sent messages

    useEffect(() => {
        if (!user) return;

        const fetchFriends = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/friends`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setOnlineUsers(res.data); 
            } catch (err) {
                console.error("Error fetching friends:", err);
            }
        };

        fetchFriends();
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
        setSentMessages((prev) => new Set(prev).add(recipient));
    };

    if (!user) return <h2 className="text-center text-xl font-semibold">Please Login to Chat</h2>;

return (
    <div className="p-4 md:flex grid max-w-[1440px] w-full justify-center mt-20">
            <SearchUsers />
<div className="max-w-[800px] w-full p-4 bg-white shadow-lg rounded-lg md:flex grid h-[500px]">
    {/* Friends List */}
    <div className="md:w-1/3 w-full p-3 border-r border-gray-300 bg-gray-100 overflow-y-auto">
        <h4 className="text-xl font-semibold mb-2">Friends</h4>
        {onlineUsers.length > 0 ? (
            onlineUsers.map((friend) => (
                <div
                    key={friend._id} 
                    onClick={() => fetchPrivateMessages(friend.username)}
                    className="cursor-pointer text-blue-600 hover:underline flex items-center p-2 rounded-md hover:bg-gray-200"
                >
                    <span>👤 {friend.username}</span> 
                    {sentMessages.has(friend.username) && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 ml-2"></span>
                    )}
                </div>
            ))
        ) : (
            <p className="text-gray-500">No friends yet.</p>
        )}
    </div>



    
    {/* Online Users Section */}
    {/* <div className="mb-4 p-3 border border-gray-300 rounded-lg bg-gray-100">
        <h4 className="text-xl font-semibold mb-2">Online Users:</h4>
        {onlineUsers.length > 0 ? (
            onlineUsers.filter((friend) => friend.username !== user.username).map((friend) => (
                <div
                    key={friend._id}
                    onClick={() => fetchPrivateMessages(friend.username)}
                    className="cursor-pointer text-blue-600 hover:underline flex items-center"
                >
                    <span>📩 {friend.username}</span> 
                    {sentMessages.has(friend.username) && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 ml-2"></span>
                    )}
                </div>
            ))
        ) : (
            <p className="text-gray-500">No users online.</p>
        )}
    </div> */}

    {/* Chat Section */}
    <div className="md:w-2/3 w-full flex flex-col p-4">
        <h2 className="text-2xl font-bold text-center mb-4">Private Messages</h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto border border-gray-300 p-3 rounded-lg bg-gray-50">
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-2 ${msg.username === user.username ? "text-right" : "text-left"}`}
                    >
                        <strong className={`text-sm ${msg.username === user.username ? "text-blue-600" : "text-gray-700"}`}>
                            {msg.username}:
                        </strong>
                        <span
                            className={`px-2 py-1 rounded-lg inline-block ${msg.username === user.username ? "bg-blue-100" : "bg-gray-200"}`}
                        >
                            {msg.message}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No messages yet.</p>
            )}
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center gap-2 mt-2">
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={sendPrivateMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Send
            </button>
        </div>
    </div>
</div>
    </div>
    );
};

export default Chat;
