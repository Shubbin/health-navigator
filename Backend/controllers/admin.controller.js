import { User } from '../models/User.js';

export const searchUsers = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  const regex = new RegExp(query, 'i');
  const users = await User.find({
    $or: [
      { name: regex },
      { email: regex },
      { role: regex }
    ],
  }).select('-password');

  res.json({ users });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["user", "admin", "superAdmin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  res.json(user);
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


