import express from 'express';
import { 
  registerUser,
  loginUser,
  getUserData,
  applyForJob,
  getUserJobApplications,
  updateUserResume,
  updateUserProfile
} from '../controllers/userController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Public routes
router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/user', protectUser, getUserData);
router.get('/applications', protectUser, getUserJobApplications);
router.post('/apply', protectUser, applyForJob);
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume);
router.put('/profile', protectUser, upload.single('image'), updateUserProfile);

export default router;