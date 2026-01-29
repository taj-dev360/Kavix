import mongoose from "mongoose";

export default mongoose.model("User", new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: { type: String, default: "" },
  avatar: String,
  followers: [String],
  following: [String]
}));