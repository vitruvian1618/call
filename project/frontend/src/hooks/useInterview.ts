import axios from 'axios';
import { useCallback, useState } from 'react';
import { startInterview, sendAnswer } from '../services/api.service';
import { AnswerResponse, Interview, Question } from '../types';
import { playAudio } from '../services/audio.service';

export const useInterview = () => {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnswerResponse[]>([]);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await startInterview();
      setInterview(data.interview);
      setCurrentQuestion(data.question);
      await playAudio(data.question.audio_url);
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Intervju se ni mogel začeti.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (audioBlob: Blob | null) => {
      if (!interview || !currentQuestion || !audioBlob) return;
      setLoading(true);
      setError(null);
      try {
        const response = await sendAnswer(interview.id, currentQuestion.id, audioBlob);
        setAnswers((prev) => [...prev, response]);
        if (response.completed) {
          setCurrentQuestion(null);
        } else if (response.nextQuestion) {
          setCurrentQuestion(response.nextQuestion);
          await playAudio(response.nextQuestion.audio_url);
        }
      } catch (err) {
        const message =
          axios.isAxiosError(err) && err.response?.data?.error
            ? err.response.data.error
            : 'Oddaja odgovora ni uspela.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [interview, currentQuestion]
  );

  return { interview, currentQuestion, loading, error, answers, start, submitAnswer };
};
