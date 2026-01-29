import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

router.get("/", async (_, res) => {
  res.json(await Post.find().sort({ createdAt: -1 }));
});

router.post("/", auth, async (req, res) => {
  const post = await Post.create(req.body);
  res.json(post);
});

export default router;