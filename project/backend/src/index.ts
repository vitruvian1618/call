import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { appConfig } from './config/app.config.js';
import interviewsRoutes from './routes/interviews.routes.js';
import sttRoutes from './routes/stt.routes.js';
import ttsRoutes from './routes/tts.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();
app.use(cors({ origin: appConfig.clientUrl }));
app.use(express.json());

// Ensure default multer middleware uses memory storage when applied
const upload = multer({ storage: multer.memoryStorage() });
app.use(upload.none());

app.use(`${appConfig.apiPrefix}/interviews`, interviewsRoutes);
app.use(`${appConfig.apiPrefix}/stt`, sttRoutes);
app.use(`${appConfig.apiPrefix}/tts`, ttsRoutes);

app.use(errorHandler);

app.listen(appConfig.port, () => {
  logger.info(`Server listening on port ${appConfig.port}`);
});
