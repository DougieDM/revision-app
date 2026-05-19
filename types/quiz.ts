export type Difficulty = "easy" | "medium" | "challenge";

export type DifficultySetting = "easy" | "mixed" | "challenge";

export type QuestionStyle =
  | "mixed"
  | "quick-recall"
  | "multiple-choice"
  | "explain"
  | "spot-the-mistake";

export type KnowledgeQuestionType =
  | "recall"
  | "multiple-choice"
  | "fill-blank"
  | "explain"
  | "spot-the-mistake"
  | "application";

export interface KnowledgeFact {
  id: string;
  topic: string;
  subtopic: string;
  fact: string;
  keywords: string[];
  difficulty: Difficulty;
  questionTypes: KnowledgeQuestionType[];
  acceptedAnswers: string[];
  explanation: string;
  commonMistakes: string[];
}

export interface SeedQuestion {
  id: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  type: KnowledgeQuestionType;
  question: string;
  options?: string[];
  answer: string;
  acceptedAnswers?: string[];
  keywords?: string[];
  explanation: string;
  hint?: string;
}

export interface GeneratedQuestion {
  id: string;
  sourceId: string;
  topic: string;
  subtopic: string;
  difficulty: Difficulty;
  type: KnowledgeQuestionType;
  question: string;
  options?: string[];
  answer: string;
  acceptedAnswers: string[];
  keywords: string[];
  explanation: string;
  hint: string;
}

export interface QuizSettings {
  topic: string;
  count: number;
  difficulty: DifficultySetting;
  style: QuestionStyle;
  weakOnly?: boolean;
}

export interface AnswerRecord {
  questionId: string;
  topic: string;
  subtopic: string;
  correct: boolean;
  userAnswer: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: AnswerRecord[];
}

export interface ProgressState {
  questionsAnswered: number;
  correctAnswers: number;
  weakSubtopics: Record<string, number>;
  topicStats: Record<string, { answered: number; correct: number }>;
  recentScores: { score: number; total: number; date: string }[];
}
