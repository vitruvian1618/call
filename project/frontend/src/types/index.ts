export type Question = {
  id: string;
  text: string;
  code: string;
  options?: { code: string; label: string }[];
  audio_url?: string;
  tts_error?: string;
};

export type Interview = {
  id: string;
  startedAt: string;
  completedAt?: string;
};

export type AnswerResponse = {
  transcript: string;
  codes: string[];
  confidence?: number;
  nextQuestion?: Question;
  completed: boolean;
};
