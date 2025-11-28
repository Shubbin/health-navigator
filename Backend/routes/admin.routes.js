import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import {
  searchUsers,
  deleteUser,
  updateUserRole,
  addCriminal,
  getCriminals,
  deleteCriminal,
  // ...other admin functions
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users/search', authMiddleware, adminMiddleware, searchUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.get('/users', authMiddleware, adminMiddleware, getUsers);


// Criminal routes
router.post('/criminals', authMiddleware, adminMiddleware, addCriminal);
router.get('/criminals', authMiddleware, adminMiddleware, getCriminals);
router.delete('/criminals/:id', authMiddleware, adminMiddleware, deleteCriminal);

export default router;
