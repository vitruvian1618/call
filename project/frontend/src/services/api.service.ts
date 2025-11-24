import axios from 'axios';
import { AnswerResponse, Interview, Question } from '../types';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const startInterview = async (): Promise<{ interview: Interview; question: Question }> => {
  const res = await axios.post(`${baseUrl}/interviews/start`);
  return res.data;
};

export const sendAnswer = async (
  interviewId: string,
  questionId: string,
  audioBlob: Blob
): Promise<AnswerResponse> => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'answer.webm');
  formData.append('questionId', questionId);

  const res = await axios.post(`${baseUrl}/interviews/${interviewId}/answer`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
