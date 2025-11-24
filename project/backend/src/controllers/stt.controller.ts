import { Request, Response } from 'express';
import { asyncHandler, HttpError } from '../utils/errors.js';
import { transcribeAudio } from '../services/soniox.service.js';
import { logger } from '../utils/logger.js';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export const transcribe = asyncHandler(async (req: Request, res: Response) => {
  const hasFile = !!req.file;
  const fileInfo = req.file
    ? { mimetype: req.file.mimetype, size: req.file.size, originalName: req.file.originalname }
    : null;
  logger.info('STT upload diagnostic', { ...fileInfo, hasFile });

  if (!req.file || !req.file.buffer || req.file.size === 0) {
    throw new HttpError(400, 'Audio file is required');
  }

  try {
    const debugDir = join(process.cwd(), '..', 'data', 'debug');
    await mkdir(debugDir, { recursive: true });
    await writeFile(join(debugDir, 'debug-recording.webm'), req.file.buffer);
  } catch (err) {
    logger.warn('Debug audio write failed', err);
  }

  try {
    const transcript = await transcribeAudio(req.file.buffer, req.file.originalname || 'upload.webm');
    res.json({ transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription failed';
    throw new HttpError(502, 'Transkripcija ni uspela', message);
  }
});
