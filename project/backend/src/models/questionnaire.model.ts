export type QuestionOption = {
  code: string;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  code: string;
  options?: QuestionOption[];
  next?: string;
  branch?: Record<string, string>;
};

export type Questionnaire = {
  version: string;
  questions: Question[];
  firstQuestionId: string;
};
