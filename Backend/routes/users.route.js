import express from 'express';
import{ User }from '../models/user.model.js';  

const router = express.Router();

// GET /api/users - fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password for security
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// PATCH /api/users/:id/role - update user role
router.patch('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    console.error('Failed to update user role:', error);
    res.status(500).json({ message: 'Server error updating role' });
  }
});

export default router;
