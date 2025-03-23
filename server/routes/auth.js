import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Register

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: "User Registered!" });
    } catch (error) {
        res.status(400).json({ errror: "Username already exists!"})
    }
});

// Login

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials!" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Verify

router.get("/verify", async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header
        if (!token) return res.status(401).json({ error: "Unauthorized - No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password"); // Get user data without password

        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user); // Send back user data
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});


// Update Profile - Change Username
router.put("/update-profile", protect, async (req, res) => {
    const { username } = req.body;
    const userId = req.user.id; 

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update username if different from current one
        if (user.username !== username) {
            user.username = username;
            await user.save();
            res.json({ message: "Username updated successfully!" });
        } else {
            res.status(400).json({ message: "New username is the same as the old one" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router;