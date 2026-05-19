"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FeedbackCard } from "@/components/FeedbackCard";
import { QuestionCard } from "@/components/QuestionCard";
import { QuizSummary } from "@/components/QuizSummary";
import { generateQuiz } from "@/lib/generateQuestion";
import { getWeakSubtopics, loadProgress, recordQuizResult } from "@/lib/progress";
import { markAnswer } from "@/lib/quiz";
import type { AnswerRecord, DifficultySetting, GeneratedQuestion, QuestionStyle, QuizSettings } from "@/types/quiz";

export function QuizClient() {
  const params = useSearchParams();
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; dontKnow?: boolean } | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [finished, setFinished] = useState(false);
  const topic = params.get("topic") ?? "All available topics";
  const count = Number(params.get("count") ?? 10);
  const difficulty = (params.get("difficulty") as DifficultySetting) ?? "mixed";
  const style = (params.get("style") as QuestionStyle) ?? "mixed";
  const weakOnly = params.get("weakOnly") === "true";

  const settings: QuizSettings = useMemo(
    () => ({
      topic,
      count: Number.isNaN(count) ? 10 : count,
      difficulty,
      style,
      weakOnly
    }),
    [topic, count, difficulty, style, weakOnly]
  );

  useEffect(() => {
    const progress = loadProgress();
    const weakSubtopics = getWeakSubtopics(progress, 10);
    setQuestions(generateQuiz(settings, weakSubtopics));
  }, [settings]);

  const current = questions[index];

  function recordCurrent(correct: boolean, userAnswer: string) {
    if (!current) return;
    setAnswers((existing) => [
      ...existing,
      {
        questionId: current.id,
        topic: current.topic,
        subtopic: current.subtopic,
        correct,
        userAnswer
      }
    ]);
    setFeedback({ correct, dontKnow: userAnswer === "I don't know" });
  }

  function submitAnswer() {
    if (!current) return;
    const correct = markAnswer(current, answer);
    recordCurrent(correct, answer);
  }

  function nextQuestion() {
    setAnswer("");
    setShowHint(false);
    setFeedback(null);

    if (index + 1 >= questions.length) {
      recordQuizResult({
        score: answers.filter((item) => item.correct).length,
        total: answers.length,
        answers
      });
      setFinished(true);
      return;
    }

    setIndex((value) => value + 1);
  }

  function restart(weakOnly: boolean) {
    const progress = loadProgress();
    const weakSubtopics = getWeakSubtopics(progress, 10);
    setQuestions(generateQuiz({ ...settings, weakOnly }, weakSubtopics));
    setIndex(0);
    setAnswer("");
    setShowHint(false);
    setFeedback(null);
    setAnswers([]);
    setFinished(false);
  }

  if (!current && !finished) {
    return (
      <main className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-ink">Getting your quiz ready...</h1>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <QuizSummary
            score={answers.filter((item) => item.correct).length}
            total={answers.length}
            answers={answers}
            onRetryWeak={() => restart(true)}
            onNewQuiz={() => restart(false)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-ocean">
            Home
          </Link>
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-500 shadow-sm">
            Nova quiz
          </span>
        </div>
        {feedback ? (
          <FeedbackCard
            question={current}
            correct={feedback.correct}
            dontKnow={feedback.dontKnow}
            onNext={nextQuestion}
            isLast={index + 1 === questions.length}
          />
        ) : (
          <QuestionCard
            question={current}
            questionNumber={index + 1}
            total={questions.length}
            answer={answer}
            showHint={showHint}
            onAnswerChange={setAnswer}
            onSubmit={submitAnswer}
            onDontKnow={() => recordCurrent(false, "I don't know")}
            onToggleHint={() => setShowHint((value) => !value)}
          />
        )}
      </div>
    </main>
  );
}
