import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.sendStatus(401);
  const token = jwt.sign({ id: user._id }, "kavix_secret");
  res.json({ token, user });
});

export default router;