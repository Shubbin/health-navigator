import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token failed" });
  }
};
