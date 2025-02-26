import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "messages" },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
