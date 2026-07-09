import express from 'express';
import {
  createCapsule,
  getMyCapsules,
  getCapsuleById,
  updateCapsule,
  deleteCapsule,
  getPublicCapsules,
  toggleFavorite,
} from '../controllers/capsuleController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadFields } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public route for public unlocked capsules
router.get('/public', getPublicCapsules);

// Protected routes for user capsules
router
  .route('/')
  .post(protect, uploadFields, createCapsule)
  .get(protect, getMyCapsules);

router
  .route('/:id')
  .get(protect, getCapsuleById)
  .put(protect, uploadFields, updateCapsule)
  .delete(protect, deleteCapsule);

router.put('/:id/favorite', protect, toggleFavorite);

export default router;
