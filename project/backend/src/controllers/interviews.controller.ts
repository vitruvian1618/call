import { Request, Response } from 'express';
import { questionnaire } from '../config/questionnaire.config.js';
import { asyncHandler, HttpError } from '../utils/errors.js';
import { createInterview, getNextQuestionId, getQuestionById, appendAnswer } from '../services/interview.service.js';
import { synthesizeSpeech, mapTranscriptToCodes } from '../services/openai.service.js';
import { saveInterview } from '../services/storage.service.js';
import { transcribeAudio } from '../services/soniox.service.js';
import { Interview } from '../models/interview.model.js';
import { logger } from '../utils/logger.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const activeInterviews = new Map<string, Interview>();

const questionWithAudio = async (questionId: string) => {
  const question = getQuestionById(questionId);
  if (!question) throw new HttpError(404, 'Question not found');
  const audioBuffer = await synthesizeSpeech(question.text);
  const audioUrl = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;
  return { ...question, audio_url: audioUrl };
};

export const startInterview = asyncHandler(async (_req: Request, res: Response) => {
  const interview = createInterview();
  activeInterviews.set(interview.id, interview);
  const firstQuestionId = getNextQuestionId();
  if (!firstQuestionId) throw new HttpError(500, 'Questionnaire not configured');
  const question = await questionWithAudio(firstQuestionId);
  res.json({ interview, question });
});

export const submitAnswer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionId } = req.body;
  const interview = activeInterviews.get(id);
  const hasFile = !!req.file;
  const fileInfo = req.file
    ? { mimetype: req.file.mimetype, size: req.file.size, originalName: req.file.originalname }
    : null;

  logger.info('STT upload diagnostic', { ...fileInfo, hasFile });

  if (!interview) {
    throw new HttpError(404, 'Interview not found');
  }

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

  let transcript = '';
  try {
    transcript = await transcribeAudio(req.file.buffer, req.file.originalname || 'upload.webm');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'STT failed';
    throw new HttpError(502, 'Transkripcija ni uspela', message);
  }

  const question = getQuestionById(questionId);
  if (!question) throw new HttpError(404, 'Question not found');
  let codes: string[] = [];
  let confidence: number | undefined;
  try {
    const mapping = await mapTranscriptToCodes(
      transcript,
      question.options?.map((o) => o.code),
      question.code
    );
    codes = mapping.codes;
    confidence = mapping.confidence;
  } catch (err) {
    logger.warn('Mapping failed', err);
  }

  const updatedInterview = appendAnswer(interview, {
    questionId,
    transcript,
    codes,
    confidence,
  });

  activeInterviews.set(id, updatedInterview);

  const nextQuestionId = getNextQuestionId(questionId, codes);

  if (!nextQuestionId) {
    const completed: Interview = { ...updatedInterview, completedAt: new Date().toISOString() };
    activeInterviews.delete(id);
    await saveInterview(completed);
    return res.json({ transcript, codes, confidence, completed: true });
  }

  const nextQuestion = await questionWithAudio(nextQuestionId);
  res.json({ transcript, codes, confidence, nextQuestion, completed: false });
});

export const getQuestionnaire = asyncHandler(async (_req: Request, res: Response) => {
  res.json(questionnaire);
});
