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
      setReceivedRequests((prev) => prev.filter((req) => req._id !== userId));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (friendId) => {
    try {
      await axios.delete(`${API_URL}/api/friends/reject/${friendId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setReceivedRequests((prev) => prev.filter((req) => req._id !== friendId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="p-6 bg-[#FDFDFF] shadow-sm border border-[#E1E2FF] rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search Users</h2>
        <div className="relative">
          <button onClick={() => setShowNotifications((prev) => !prev)}>
            <BellIcon className="w-6 h-6 text-gray-600" />
            {receivedRequests.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#5D5FEF] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
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
                    <div className="accept_reject_buttons flex gap-2">
                    <button
                      className="text-sm px-3 py-1 bg-[#5D5FEF] text-white rounded-lg hover:bg-blue-600"
                      onClick={() => acceptFriendRequest(request._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      Reject
                    </button>
                    </div>
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
          className="flex-1 p-2 border border-[#E1E2FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E1E2FF]"
          placeholder="Enter username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-[#5D5FEF] text-white rounded-lg hover:bg-[#7275cb] flex items-center justify-center"
          onClick={searchUsers}
          disabled={loading}
        >
          {loading ? "..." : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              width="16"
              height="25"
              fill="white"
            >
              <g transform="scale(8.53333,8.53333)">
                <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z"></path>
              </g>
            </svg>
          )}
        </button>

      </div>
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <h3 className="font-semibold mt-4">Found Users</h3>
      <ul className="divide-y">
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id} className="py-2 flex justify-between items-center">
              {/* <span>{user.username} ({user.email})</span> */}
              <span>{user.username}</span>
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
