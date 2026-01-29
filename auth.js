import jwt from "jsonwebtoken";

export default function(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, "kavix_secret");
    next();
  } catch {
    res.sendStatus(403);
  }
}