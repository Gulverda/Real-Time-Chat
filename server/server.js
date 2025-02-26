import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import authRoutes from "./routes/auth.js";
import { protect } from "./middleware/authMiddleware.js";


dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("MongoDB Connected ✅"));
mongoose.connection.on("error", (err) => console.error("MongoDB Connection Error:", err));
mongoose.connection.on("disconnected", () => console.log("MongoDB Disconnected ❌"));

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for messages
  socket.on("sendMessage", async ({ username, message }) => {
    try {
      const newMessage = new Message({ username, message });
      await newMessage.save();
      io.emit("receiveMessage", newMessage); // Send to all clients
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Typing Indicator Feature
  socket.on("typing", (username) => {
    socket.broadcast.emit("userTyping", username); // Notify others
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Routes
app.use("/api/auth", authRoutes);

// Fetch Previous Messages
app.get("/api/messages", protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages.reverse()); // Send in correct order
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));