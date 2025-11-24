import { Request, Response } from 'express';
import { asyncHandler, HttpError } from '../utils/errors.js';
import { synthesizeSpeech } from '../services/openai.service.js';

export const speak = asyncHandler(async (req: Request, res: Response) => {
  const { text, voice } = req.body as { text?: string; voice?: string };
  if (!text) {
    throw new HttpError(400, 'Text is required');
  }

  try {
    const audio = await synthesizeSpeech(text, voice || 'nova');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(audio);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'TTS failed';
    throw new HttpError(502, 'Pretvorba besedila ni uspela', message);
  }
});
