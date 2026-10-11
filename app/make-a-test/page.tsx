"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import organisms from "@/data/organisms.json";
import { TopicSelector } from "@/components/TopicSelector";
import type { DifficultySetting, QuestionStyle } from "@/types/quiz";
import { loadUpcomingTest } from "@/lib/readiness";

const counts = [5, 10, 15, 20];
const difficulties: DifficultySetting[] = ["easy", "mixed", "challenge"];
const styles: { value: QuestionStyle; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "quick-recall", label: "Quick recall" },
  { value: "multiple-choice", label: "Multiple choice" },
  { value: "explain", label: "Explain" },
  { value: "spot-the-mistake", label: "Spot the mistake" }
];

export default function MakeTestPage() {
  const [topic, setTopic] = useState("Year 8 Organisms");
  const [subtopic, setSubtopic] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultySetting>("mixed");
  const [style, setStyle] = useState<QuestionStyle>("mixed");
  useEffect(() => { const saved = loadUpcomingTest(); setTopic(saved.topics[0]); }, []);

  const quizUrl = useMemo(() => {
    const params = new URLSearchParams({
      topic,
      subtopic,
      count: String(count),
      difficulty,
      style
    });
    return `/quiz?${params.toString()}`;
  }, [topic, subtopic, count, difficulty, style]);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="font-bold text-pink-300">← Readiness dashboard</Link>
        <header className="mt-5">
          <p className="font-semibold text-purple-300">Readispark · Focused revision</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Make a test</h1>
          <p className="mt-3 text-lg text-zinc-300">Choose what to revise and how you want to practise. Your results will help build your readiness.</p>
        </header>

        <section className="mt-5 rounded-lg bg-surface p-5 shadow-soft">
          <TopicSelector value={topic} onChange={(value) => { setTopic(value); setSubtopic(""); }} />
          {topic === "Year 8 Organisms" ? (
            <div className="mt-5">
              <label htmlFor="organisms-section" className="text-sm font-semibold text-ink">Focus on an area</label>
              <select id="organisms-section" value={subtopic} onChange={(event) => setSubtopic(event.target.value)} className="mt-2 w-full rounded-lg border-2 border-zinc-700 bg-surface p-3 text-ink">
                <option value="">All Organisms areas</option>
                {organisms.sections.map((area) => <option key={area}>{area}</option>)}
              </select>
            </div>
          ) : null}

          <div className="mt-6 grid gap-5">
            <div>
              <label className="text-sm font-semibold text-ink">Number of questions</label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {counts.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCount(option)}
                    aria-pressed={count === option}
                    className={`rounded-lg border-2 py-3 font-bold ${
                      count === option ? "border-pink-400 bg-purple-950 text-pink-300" : "border-zinc-700 bg-surface"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-ink">Difficulty</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {difficulties.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDifficulty(option)}
                    aria-pressed={difficulty === option}
                    className={`rounded-lg border-2 py-3 font-bold capitalize ${
                      difficulty === option ? "border-pink-400 bg-purple-950 text-pink-300" : "border-zinc-700 bg-surface"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-ink">Question style</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {styles.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStyle(option.value)}
                    aria-pressed={style === option.value}
                    className={`rounded-lg border-2 px-3 py-3 text-left font-bold ${
                      style === option.value ? "border-pink-400 bg-purple-950 text-pink-300" : "border-zinc-700 bg-surface"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href={quizUrl} className="rounded-lg bg-brand-pink px-5 py-4 text-center text-lg font-bold text-white">
              Start test
            </Link>
            <Link
              href={`${quizUrl}&weakOnly=true`}
              className="rounded-lg bg-brand-purple px-5 py-4 text-center text-lg font-bold text-white"
            >
              Practise weak areas
            </Link>
          </div>
          <Link href={`/print?${new URLSearchParams({ topic, subtopic }).toString()}`} className="mt-4 block rounded-lg border-2 border-zinc-700 px-5 py-4 text-center font-bold">Printable test & answer sheet</Link>
          <p className="mt-2 text-sm text-zinc-400">The printable version uses a fixed set of up to 20 questions for your selected topic and area.</p>
        </section>
      </div>
    </main>
  );
}
