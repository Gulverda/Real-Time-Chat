import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import authRoutes from "./routes/auth.js";
import friendRoutes from "./routes/friends.js"
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "https://real-time-chat-mu.vercel.app"],
  methods: ["GET", "POST"] },
});
const onlineUsers = new Map();

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

  socket.on("sendPrivateMessage", async ({ sender, recipient, message }) => {
    try {
      const newMessage = new Message({ username: sender, recipient, message });
      await newMessage.save();
      
      io.to(onlineUsers.get(recipient)).emit("receivePrivateMessage", newMessage);
      socket.emit("receivePrivateMessage", newMessage); // Also send to sender
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });
  

  // User joins chat
  socket.on("userJoined", (username) => {
    if (!username) return;
    onlineUsers.set(socket.id, username);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
  });

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

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
    console.log(`User Disconnected: ${socket.id}`);
  });

  // User leaves chat explicitly
  socket.on("userLeft", (username) => {
    for (let [key, value] of onlineUsers) {
      if (value === username) {
        onlineUsers.delete(key);
        break;
      }
    }
    io.emit("updateOnlineUsers", Array.from(onlineUsers.values()));
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);


// Fetch Previous Messages
app.get("/api/messages", protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages.reverse()); // Send in correct order
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/api/messages/:username/:recipient", protect, async (req, res) => {
  const { username, recipient } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { username, recipient },
        { username: recipient, recipient: username },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch private messages" });
  }
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));