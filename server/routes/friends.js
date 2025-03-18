import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Friend from "../models/Friends.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get pending friend requests (both sent and received)
router.get("/pending", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const userFriendData = await Friend.findOne({ user: userId }).populate("pendingRequests", "username");
        const receivedRequests = await Friend.find({ pendingRequests: userId }).populate("user", "username");

        res.json({
            sentRequests: userFriendData?.pendingRequests || [],
            receivedRequests: receivedRequests.map(req => req.user),
        });
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        res.status(500).json({ error: "Failed to fetch pending requests" });
    }
});

// ✅ Search users by username
router.get("/search", protect, async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        const users = await User.find({ username: { $regex: query, $options: "i" } }).select("username _id");
        res.json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Failed to search users" });
    }
});

// ✅ Get friend list
router.get("/", protect, async (req, res) => {
    try {
        const userFriends = await Friend.findOne({ user: req.user.id }).populate("friends", "username");
        res.json(userFriends?.friends || []);
    } catch (err) {
        console.error("Error fetching friends:", err);
        res.status(500).json({ error: "Failed to fetch friends" });
    }
});

// ✅ Send friend request
router.post("/add/:friendId", protect, async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.user.id;

        if (friendId === userId) {
            return res.status(400).json({ error: "You cannot send a request to yourself." });
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ error: "User not found." });
        }

        // Add request only if not already sent
        const userFriendData = await Friend.findOneAndUpdate(
            { user: userId },
            { $addToSet: { pendingRequests: friendId } },
            { upsert: true, new: true }
        );

        // Ensure recipient knows they have a pending request
        await Friend.findOneAndUpdate(
            { user: friendId },
            { $addToSet: { receivedRequests: userId } },
            { upsert: true, new: true }
        );

        res.json({ message: "Friend request sent." });
    } catch (err) {
        console.error("Error sending friend request:", err);
        res.status(500).json({ error: "Failed to send request" });
    }
});

// ✅ Accept friend request
router.post("/accept/:friendId", protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.friendId;

        const userFriendData = await Friend.findOne({ user: userId });

        if (!userFriendData || !userFriendData.receivedRequests.includes(friendId)) {
            return res.status(400).json({ message: "No pending request from this user." });
        }

        // Remove from receivedRequests and add to friends
        await Friend.findOneAndUpdate(
            { user: userId },
            {
                $pull: { receivedRequests: friendId },
                $addToSet: { friends: friendId },
            }
        );

        // Remove from sender's pendingRequests and add to friends
        await Friend.findOneAndUpdate(
            { user: friendId },
            {
                $pull: { pendingRequests: userId },
                $addToSet: { friends: userId },
            }
        );

        res.status(200).json({ message: "Friend request accepted successfully." });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Server error." });
    }
});


export default router;
