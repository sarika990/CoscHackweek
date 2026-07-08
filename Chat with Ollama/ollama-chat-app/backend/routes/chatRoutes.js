import express from 'express';
import { chatController } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', chatController.handleChat);
router.get('/health', chatController.handleHealthCheck);

export default router;
