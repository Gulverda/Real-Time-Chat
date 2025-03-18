import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, index: true }, // Index for faster lookups
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Accepted friends list
  pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Sent requests
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Incoming requests
});

export default mongoose.model("Friend", FriendSchema);
