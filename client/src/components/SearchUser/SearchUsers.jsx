import { useState, useEffect } from "react";
import axios from "axios";
import { BellIcon } from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API || "http://localhost:5000";

const SearchUsers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const sendFriendRequest = async (userId) => {
    if (!userId) return;
    try {
      await axios.post(`${API_URL}/api/friends/add/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSentRequests((prev) => [...prev, { userId }]);
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  const acceptFriendRequest = async (userId) => {
    if (!userId) return;
    try {
      await axios.post(`${API_URL}/api/friends/accept/${userId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReceivedRequests((prev) => prev.filter((req) => req.user?._id !== userId));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search Users</h2>
        <div className="relative">
          <button onClick={() => setShowNotifications((prev) => !prev)}>
            <BellIcon className="w-6 h-6 text-gray-600" />
            {receivedRequests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {receivedRequests.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-lg p-2">
              <h4 className="font-semibold">Pending Requests</h4>
              {receivedRequests.length > 0 ? (
                receivedRequests.map((request) => (
                  <div key={request._id} className="flex justify-between items-center py-1 border-b">
                    <span>{request.username || "Unknown User"}</span>
                    <button
                      className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => acceptFriendRequest(request._id)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No pending requests.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={searchUsers}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <h3 className="font-semibold mt-4">Found Users</h3>
      <ul className="divide-y">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="py-2 flex justify-between items-center">
              <span>{user.username} ({user.email})</span>
              <button
                className="text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={() => sendFriendRequest(user._id)}
                disabled={sentRequests.some(req => req.userId === user._id)}
              >
                {sentRequests.some(req => req.userId === user._id) ? "Request Sent" : "Send Request"}
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
};

export default SearchUsers;
