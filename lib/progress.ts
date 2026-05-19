import type { AnswerRecord, ProgressState, QuizResult } from "@/types/quiz";

const STORAGE_KEY = "nova-year-7-science-progress";

export const emptyProgress: ProgressState = {
  questionsAnswered: 0,
  correctAnswers: 0,
  weakSubtopics: {},
  topicStats: {},
  recentScores: []
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...emptyProgress, ...JSON.parse(saved) } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function recordQuizResult(result: QuizResult) {
  const current = loadProgress();
  const next: ProgressState = {
    ...current,
    questionsAnswered: current.questionsAnswered + result.total,
    correctAnswers: current.correctAnswers + result.score,
    weakSubtopics: { ...current.weakSubtopics },
    topicStats: { ...current.topicStats },
    recentScores: [
      { score: result.score, total: result.total, date: new Date().toISOString() },
      ...current.recentScores
    ].slice(0, 8)
  };

  result.answers.forEach((answer: AnswerRecord) => {
    if (!next.topicStats[answer.topic]) next.topicStats[answer.topic] = { answered: 0, correct: 0 };
    next.topicStats[answer.topic].answered += 1;
    if (answer.correct) {
      next.topicStats[answer.topic].correct += 1;
      next.weakSubtopics[answer.subtopic] = Math.max(0, (next.weakSubtopics[answer.subtopic] ?? 0) - 1);
    } else {
      next.weakSubtopics[answer.subtopic] = (next.weakSubtopics[answer.subtopic] ?? 0) + 2;
    }
  });

  saveProgress(next);
  return next;
}

export function getWeakSubtopics(progress: ProgressState, limit = 8) {
  return Object.entries(progress.weakSubtopics)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([subtopic]) => subtopic);
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
