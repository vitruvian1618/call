import { Router } from 'express';
import multer from 'multer';
import { startInterview, submitAnswer, getQuestionnaire } from '../controllers/interviews.controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/start', startInterview);
router.post('/:id/answer', upload.single('audio'), submitAnswer);
router.get('/questionnaire', getQuestionnaire);

export default router;
