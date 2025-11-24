export type Answer = {
  questionId: string;
  transcript: string;
  codes: string[];
  confidence?: number;
};

export type Interview = {
  id: string;
  startedAt: string;
  completedAt?: string;
  answers: Answer[];
};
