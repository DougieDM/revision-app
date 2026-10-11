"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import organisms from "@/data/organisms.json";
import { TopicSelector } from "@/components/TopicSelector";
import type { DifficultySetting, QuestionStyle } from "@/types/quiz";

const counts = [5, 10, 15, 20];
const difficulties: DifficultySetting[] = ["easy", "mixed", "challenge"];
const styles: { value: QuestionStyle; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "quick-recall", label: "Quick recall" },
  { value: "multiple-choice", label: "Multiple choice" },
  { value: "explain", label: "Explain" },
  { value: "spot-the-mistake", label: "Spot the mistake" }
];

export default function HomePage() {
  const [topic, setTopic] = useState("Year 8 Organisms");
  const [subtopic, setSubtopic] = useState("");
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultySetting>("mixed");
  const [style, setStyle] = useState<QuestionStyle>("mixed");

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
        <section className="rounded-lg bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wide text-ocean">Revisionary</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-ink">
            Science practice that feels calm and doable.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Choose a topic, answer one question at a time, and Revisionary will help spot what to practise next.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href={quizUrl} className="rounded-lg bg-ocean px-5 py-4 text-center text-lg font-bold text-white">
              Start Quiz
            </Link>
            <Link
              href={`${quizUrl}&weakOnly=true`}
              className="rounded-lg bg-berry px-5 py-4 text-center text-lg font-bold text-white"
            >
              Practice Weak Areas
            </Link>
            <Link
              href={`/print?${new URLSearchParams({ topic, subtopic }).toString()}`}
              className="rounded-lg border-2 border-slate-200 bg-slate-50 px-5 py-4 text-center text-lg font-bold text-ink"
            >
              Printable Test
            </Link>
            <Link
              href="/progress"
              className="rounded-lg border-2 border-slate-200 bg-slate-50 px-5 py-4 text-center text-lg font-bold text-ink"
            >
              View Progress
            </Link>
          </div>
        </section>

        <section className="mt-5 rounded-lg border-2 border-teal-200 bg-teal-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-ocean">Isla’s current test · Year 8 · 8.3–8.4</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Organisms</h2>
          <p className="mt-2 text-slate-700">Breathing, gas exchange, drugs, alcohol, smoking, nutrients, food tests and digestion.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => { setTopic("Year 8 Organisms"); setSubtopic(""); }} className="rounded-lg bg-ocean px-4 py-3 font-bold text-white">Focus on this test</button>
            <Link href="/organisms" className="rounded-lg border-2 border-ocean px-4 py-3 font-bold text-ocean">Notes, checklist & videos</Link>
          </div>
        </section>

        <section className="mt-5 rounded-lg bg-white p-5 shadow-soft">
          <TopicSelector value={topic} onChange={(value) => { setTopic(value); setSubtopic(""); }} />
          {topic === "Year 8 Organisms" ? (
            <div className="mt-5">
              <label htmlFor="organisms-section" className="text-sm font-semibold text-ink">Focus on an area</label>
              <select id="organisms-section" value={subtopic} onChange={(event) => setSubtopic(event.target.value)} className="mt-2 w-full rounded-lg border-2 border-slate-200 bg-white p-3 text-ink">
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
                    className={`rounded-lg border-2 py-3 font-bold ${
                      count === option ? "border-ocean bg-teal-50 text-ocean" : "border-slate-200 bg-white"
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
                    className={`rounded-lg border-2 py-3 font-bold capitalize ${
                      difficulty === option ? "border-ocean bg-teal-50 text-ocean" : "border-slate-200 bg-white"
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
                    className={`rounded-lg border-2 px-3 py-3 text-left font-bold ${
                      style === option.value ? "border-ocean bg-teal-50 text-ocean" : "border-slate-200 bg-white"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
