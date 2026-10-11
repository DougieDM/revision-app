"use client";

import { topicLabel } from "@/lib/topicLabels";
import { QuestionIllustration } from "@/components/QuestionIllustration";

import type { GeneratedQuestion } from "@/types/quiz";

interface QuestionCardProps {
  question: GeneratedQuestion;
  questionNumber: number;
  total: number;
  answer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onDontKnow: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  total,
  answer,
  onAnswerChange,
  onSubmit,
  onDontKnow
}: QuestionCardProps) {
  const progress = Math.round((questionNumber / total) * 100);

  return (
    <section className="rounded-lg bg-surface p-5 shadow-soft">
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-zinc-400">
          <span>
            Question {questionNumber} of {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
          <div className="h-full rounded-full bg-brand-pink" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="mb-2 text-sm font-semibold text-purple-300">{topicLabel(question.topic)}</p>
      <h1 className="text-2xl font-bold leading-snug text-ink">{question.question}</h1>
      <p className="mt-2 text-sm text-zinc-400">{question.subtopic}</p>
      <QuestionIllustration question={question.question} />

      {question.options?.length ? (
        <div className="mt-6 grid gap-3">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onAnswerChange(option)}
              className={`rounded-lg border-2 px-4 py-4 text-left text-lg font-semibold transition ${
                answer === option
                  ? "border-pink-400 bg-purple-950 text-pink-300"
                  : "border-zinc-700 bg-surface text-ink hover:border-pink-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          className="mt-6 min-h-32 w-full rounded-lg border-2 border-zinc-700 bg-surface p-4 text-lg text-ink outline-none focus:border-pink-400"
          aria-label="Your answer"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(event) => onAnswerChange(event.target.value)}
        />
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onSubmit}
          className="rounded-lg bg-brand-pink px-4 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-pink-700"
        >
          Check answer
        </button>
        <button
          type="button"
          onClick={onDontKnow}
          className="rounded-lg border-2 border-zinc-700 bg-zinc-900 px-4 py-4 text-lg font-bold text-zinc-200"
        >
          I don&apos;t know
        </button>
      </div>
    </section>
  );
}
