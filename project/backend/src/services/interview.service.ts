import { v4 as uuidv4 } from 'uuid';
import { questionnaire } from '../config/questionnaire.config.js';
import { Answer, Interview } from '../models/interview.model.js';
import { Question } from '../models/questionnaire.model.js';

export const createInterview = (): Interview => ({
  id: uuidv4(),
  startedAt: new Date().toISOString(),
  answers: [],
});

export const getQuestionById = (id: string): Question | undefined =>
  questionnaire.questions.find((q) => q.id === id);

export const getNextQuestionId = (currentQuestionId?: string, codes?: string[]): string | undefined => {
  if (!currentQuestionId) return questionnaire.firstQuestionId;
  const current = getQuestionById(currentQuestionId);
  if (!current) return undefined;
  if (current.branch && codes && codes.length) {
    for (const code of codes) {
      if (current.branch[code]) return current.branch[code];
    }
  }
  return current.next;
};

export const appendAnswer = (interview: Interview, answer: Answer): Interview => ({
  ...interview,
  answers: [...interview.answers, answer],
});
