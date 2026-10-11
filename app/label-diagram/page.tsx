"use client";

import Link from "next/link";
import { useState } from "react";
import { RespiratoryDiagram } from "@/components/RespiratoryDiagram";
import { checkDiagramLabels, respiratoryLabels } from "@/lib/diagramLabels";
import { recordQuizResult } from "@/lib/progress";

export default function LabelDiagramPage() {
  const [answers, setAnswers] = useState<string[]>(respiratoryLabels.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  function check() {
    if (results) return;
    const marked = checkDiagramLabels(answers);
    setResults(marked);
    try {
      recordQuizResult({ score: marked.filter(Boolean).length, total: marked.length,
        answers: respiratoryLabels.map((label, index) => ({ questionId: `respiratory-label-${index}`, sourceId: `respiratory-label-${label.name.toLowerCase()}`, topic: "Year 8 Organisms", subtopic: "Gas exchange", correct: marked[index], userAnswer: answers[index] })) });
    } catch { setSaveFailed(true); }
  }
  return <main className="min-h-screen px-4 py-6"><div className="mx-auto max-w-3xl">
    <Link href="/organisms" className="font-bold text-pink-300">← Organisms revision</Link>
    <section className="mt-5 rounded-lg bg-surface p-5">
      <p className="font-bold text-purple-300">Organisms · Gas exchange</p>
      <h1 className="mt-2 text-3xl font-black">Label the respiratory system</h1>
      <p className="mt-3 text-zinc-300">Fill in the six numbered labels. Other parts are already named to help you. Each label counts towards your practice progress.</p>
      <RespiratoryDiagram />
      <form className="mt-5" onSubmit={(event) => { event.preventDefault(); check(); }}>
        <div className="grid gap-4 sm:grid-cols-2">{respiratoryLabels.map((label, index) => <div key={label.name}>
          <label htmlFor={`label-${index}`} className="font-bold">Label {index + 1}</label>
          <input id={`label-${index}`} autoComplete="off" value={answers[index]} disabled={results !== null} onChange={(event) => setAnswers(answers.map((answer, position) => position === index ? event.target.value : answer))} className={`mt-2 w-full rounded-lg border-2 bg-black p-3 ${results ? results[index] ? "border-emerald-400" : "border-purple-400" : "border-zinc-600 focus:border-pink-400"}`} aria-describedby={results ? `result-${index}` : undefined} />
          {results ? <p id={`result-${index}`} className={`mt-2 font-semibold ${results[index] ? "text-emerald-300" : "text-purple-300"}`}>{results[index] ? "✓ Correct" : `The answer is ${label.name.toLowerCase()}.`}</p> : null}
        </div>)}</div>
        {results ? <div role="status" className="mt-5 rounded-lg border border-emerald-400 bg-emerald-950 p-4"><p className="font-bold text-emerald-300">{results.filter(Boolean).length} of {results.length} labels correct</p><p className="mt-2">Air passes through the trachea, bronchi and bronchioles. Gas exchange takes place in the alveoli inside the lungs. The diaphragm helps change the volume of the chest during breathing.</p></div> : null}
        {saveFailed ? <p role="status" className="mt-3 text-pink-300">This browser could not save your results. They are shown here for this session.</p> : null}
        {!results ? <button className="mt-5 rounded-lg bg-brand-pink px-5 py-3 font-bold" type="button" onClick={check}>Check labels</button> : <button className="mt-5 rounded-lg bg-brand-pink px-5 py-3 font-bold" type="button" onClick={() => { setAnswers(respiratoryLabels.map(() => "")); setResults(null); setSaveFailed(false); }}>Try again</button>}
      </form>
    </section>
  </div></main>;
}
