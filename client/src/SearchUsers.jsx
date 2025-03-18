import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  // Fetch pending friend requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/friends/pending`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSentRequests(res.data.sentRequests || []);
        setReceivedRequests(res.data.receivedRequests || []);
      } catch (err) {
        console.error("Error fetching pending requests:", err);
        setMessage("Error fetching pending requests.");
      }
    };
    fetchPendingRequests();
  }, []);

  // Search users
  const searchUsers = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get(`${API_URL}/api/friends/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setMessage("Error searching users.");
    } finally {
      setLoading(false);
    }
  };

  // Send Friend Request
  const sendFriendRequest = async (userId) => {
    if (!userId) return; // Prevent errors if userId is undefined
    try {
      await axios.post(`${API_URL}/api/friends/add/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(`Friend request sent to ${userId}`);
      setSentRequests((prev) => [...prev, { userId }]);
    } catch (err) {
      console.error("Error sending friend request:", err.response?.data || err.message);
      alert("Failed to send friend request.");
    }
  };

  // Accept Friend Request
  const acceptFriendRequest = async (userId) => {
    if (!userId) return; // Prevents calling API with undefined userId
    try {
      const res = await axios.post(`${API_URL}/api/friends/accept/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data.message);
      setReceivedRequests((prev) => prev.filter((req) => req.user?._id !== userId));
    } catch (error) {
      console.error("Error accepting friend request:", error.response?.data || error.message);
      alert("Failed to accept friend request.");
    }
  };

  return (
    <div className="search-container">
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Enter username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchUsers} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {message && <p className="message">{message}</p>}

      <h3>Found Users</h3>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              {user.username} ({user.email})
              <button onClick={() => sendFriendRequest(user._id)} disabled={sentRequests.some(req => req.userId === user._id)}>
                {sentRequests.some(req => req.userId === user._id) ? "Request Sent" : "Send Request"}
              </button>
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>

      <h3>Sent Friend Requests</h3>
      <ul>
        {sentRequests.length > 0 ? (
          sentRequests.map((request, index) => (
            <li key={request.userId || index}>
              Friend request sent to {request.userId}.
            </li>
          ))
        ) : (
          <p>No sent requests.</p>
        )}
      </ul>

      <h3>Received Friend Requests</h3>
      <ul>
        {receivedRequests.length > 0 ? (
          receivedRequests.map((request, index) => (
            <li key={request._id || index}>
              {request.username || "Unknown User"} sent you a friend request.
              <button onClick={() => acceptFriendRequest(request._id)}>
                Accept
              </button>
            </li>
          ))
        ) : (
          <p>No pending requests.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchUsers;
