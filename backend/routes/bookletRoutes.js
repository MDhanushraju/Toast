import express from 'express';
import { getBooklets, getBookletById, createBooklet, updateBooklet, deleteBooklet } from '../controllers/bookletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getBooklets);
router.get('/:id', protect, getBookletById);
router.post('/', protect, createBooklet);
router.put('/:id', protect, updateBooklet);
router.delete('/:id', protect, deleteBooklet);

export default router;
