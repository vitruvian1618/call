import { Router } from 'express';
import multer from 'multer';
import { transcribe } from '../controllers/stt.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('audio'), transcribe);

export default router;
