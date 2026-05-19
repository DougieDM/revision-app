"use client";

import type { ProgressState } from "@/types/quiz";
import { getWeakSubtopics } from "@/lib/progress";

interface ProgressSummaryProps {
  progress: ProgressState;
}

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  const accuracy = progress.questionsAnswered
    ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100)
    : 0;
  const weakAreas = getWeakSubtopics(progress, 6);

  return (
    <section className="rounded-lg bg-white p-5 shadow-soft">
      <p className="text-sm font-semibold text-berry">Progress with Nova</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">{accuracy}% accuracy</h1>
      <p className="mt-2 text-slate-600">
        {progress.questionsAnswered} questions answered, {progress.correctAnswers} correct.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {Object.entries(progress.topicStats).map(([topic, stats]) => (
          <div key={topic} className="rounded-lg bg-slate-50 p-4">
            <p className="font-bold text-ink">{topic}</p>
            <p className="mt-1 text-slate-600">
              {stats.correct}/{stats.answered} correct
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 p-4">
        <h2 className="text-lg font-bold text-ink">Weak areas to revisit</h2>
        {weakAreas.length ? (
          <ul className="mt-3 space-y-2">
            {weakAreas.map((area) => (
              <li key={area} className="text-ink">
                {area}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-ink">No weak areas saved yet. Try a quiz to begin.</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-ink">Recent scores</h2>
        <div className="mt-3 space-y-2">
          {progress.recentScores.length ? (
            progress.recentScores.map((score) => (
              <div key={score.date} className="flex justify-between rounded-lg bg-slate-50 p-3">
                <span>{new Date(score.date).toLocaleDateString()}</span>
                <strong>
                  {score.score}/{score.total}
                </strong>
              </div>
            ))
          ) : (
            <p className="text-slate-600">Scores will appear here after a quiz.</p>
          )}
        </div>
      </div>
    </section>
  );
}
