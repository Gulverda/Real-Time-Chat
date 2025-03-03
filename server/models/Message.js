import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    recipient: { type: String, required: false }, // Optional for DMs
  },
  { collection: "messages" },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
