import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // Listen for messages
  socket.on("sendMessage", async (data) => {
    const { username, message } = data;
    const newMessage = new Message({ username, message });
    await newMessage.save();

    io.emit("receiveMessage", newMessage); // Send message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// Routes
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(20);
  res.json(messages.reverse());
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
