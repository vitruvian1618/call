import { Router } from 'express';
import { speak } from '../controllers/tts.controller.js';

const router = Router();

router.post('/', speak);

export default router;
