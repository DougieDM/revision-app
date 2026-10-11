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
  const [loaded, setLoaded] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; dontKnow?: boolean } | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const topic = params.get("topic") ?? "All available topics";
  const subtopic = params.get("subtopic") ?? "";
  const count = Number(params.get("count") ?? 10);
  const difficulty = (params.get("difficulty") as DifficultySetting) ?? "mixed";
  const style = (params.get("style") as QuestionStyle) ?? "mixed";
  const weakOnly = params.get("weakOnly") === "true";

  const settings: QuizSettings = useMemo(
    () => ({
      topic,
      subtopic,
      count: Number.isFinite(count) ? Math.max(1, Math.min(20, Math.floor(count))) : 10,
      difficulty,
      style,
      weakOnly
    }),
    [topic, subtopic, count, difficulty, style, weakOnly]
  );

  useEffect(() => {
    const progress = loadProgress();
    const weakSubtopics = getWeakSubtopics(progress, 10);
    setQuestions(generateQuiz(settings, weakSubtopics));
    setLoaded(true);
  }, [settings]);

  const current = questions[index];

  function recordCurrent(correct: boolean, userAnswer: string) {
    if (!current) return;
    setAnswers((existing) => [
      ...existing,
      {
        questionId: current.id,
        sourceId: current.sourceId,
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
    if (current.topic === "Year 8 Organisms" && current.type !== "multiple-choice") { setReviewing(true); return; }
    const correct = markAnswer(current, answer);
    recordCurrent(correct, answer);
  }

  function nextQuestion() {
    setReviewing(false);
    setAnswer("");
    setShowHint(false);
    setFeedback(null);

    if (index + 1 >= questions.length) {
      try { recordQuizResult({
        score: answers.filter((item) => item.correct).length,
        total: answers.length,
        answers
      }); } catch { setSaveFailed(true); }
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
    setReviewing(false);
    setAnswer("");
    setShowHint(false);
    setFeedback(null);
    setAnswers([]);
    setFinished(false);
    setSaveFailed(false);
  }

  if (!current && !finished) {
    return (
      <main className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-2xl rounded-lg bg-surface p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-ink">{loaded ? "No questions match these choices" : "Getting your quiz ready..."}</h1>
          {loaded ? <Link href="/make-a-test" className="mt-4 inline-block font-bold text-pink-300">Choose another area, difficulty or question style</Link> : null}
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen px-4 py-6">
        <div className="mx-auto max-w-2xl">
          {saveFailed ? <p role="status" className="mb-4 rounded-lg border border-pink-400 bg-pink-950 p-4">Your results are shown below, but this browser could not save them. Enable browser storage to keep your progress.</p> : null}
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
          <Link href="/" className="font-bold text-pink-300">
            Home
          </Link>
          <span className="rounded-full bg-surface px-3 py-1 text-sm font-bold text-zinc-400 shadow-sm">
            Readispark practice
          </span>
        </div>
        {reviewing ? (
          <section className="rounded-lg bg-surface p-5 shadow-soft">
            <h1 className="text-2xl font-bold text-ink">Compare your answer</h1>
            <p className="mt-3 font-semibold">{current.question}</p>
            <p className="mt-4 text-sm font-bold text-zinc-400">Your answer</p>
            <p className="mt-1 whitespace-pre-wrap">{answer || "No answer entered"}</p>
            <p className="mt-4 text-sm font-bold text-pink-300">Model answer</p>
            <p className="mt-1">{current.answer}</p>
            <p className="mt-3 text-zinc-300">{current.explanation}</p>
            <p className="mt-4 text-sm text-zinc-300">Different wording is fine. Did you include the key science ideas? For explain questions, include the reasons too.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="rounded-lg bg-brand-pink p-4 font-bold text-white" onClick={() => { setReviewing(false); recordCurrent(true, answer); }}>I got the key ideas</button>
              <button className="rounded-lg bg-brand-purple p-4 font-bold text-white" onClick={() => { setReviewing(false); recordCurrent(false, answer); }}>I need more practice</button>
            </div>
          </section>
        ) : feedback ? (
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
