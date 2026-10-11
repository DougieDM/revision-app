"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import organisms from "@/data/organisms.json";
import { QuestionIllustration } from "@/components/QuestionIllustration";
import { DigestiveDiagram } from "@/components/DigestiveDiagram";

type Confidence = "Not yet" | "Getting there" | "Confident";
const confidenceOptions: Confidence[] = ["Not yet", "Getting there", "Confident"];
const checklistKey = "revisionary-organisms-checklist-v1";

export default function OrganismsPage() {
  const [section, setSection] = useState("");
  const [ratings, setRatings] = useState<Record<string, Confidence>>({});
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try { setRatings(JSON.parse(localStorage.getItem(checklistKey) ?? "{}")); }
    catch { setStorageAvailable(false); }
  }, []);
  function rate(id: string, value: Confidence) {
    const next = { ...ratings, [id]: value };
    setRatings(next);
    try { localStorage.setItem(checklistKey, JSON.stringify(next)); }
    catch { setStorageAvailable(false); }
  }
  const confident = organisms.checklist.filter((item) => ratings[item.id] === "Confident").length;
  const quizUrl = `/quiz?${new URLSearchParams({ topic: organisms.title, subtopic: section, count: "10", difficulty: "mixed", style: "mixed" })}`;
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/" className="font-bold text-pink-300">← Home</Link>
        <section className="rounded-lg bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-pink-300">YEAR 8 · ORGANISMS 8.3–8.4</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Revise for this test</h1>
          <p className="mt-3 text-zinc-300">Read a learning point, hide the answer and try saying it in your own words. Then practise with a quiz.</p>
          <p className="mt-3 text-sm text-zinc-300">Textbook: Kerboodle pages 122–143. You do not need active site, substrate or the lock and key model for this test.</p>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-pink-300" aria-label="Revision sections">
            <Link href="/label-diagram">Label a diagram</Link>
            <Link href="/label-diagram/digestive">Label the digestive system</Link>
            <a href="#notes">Notes</a><a href="#checklist">Checklist</a><a href="#glossary">Glossary</a><a href="#resources">Videos & links</a>
          </nav>
        </section>
        <section id="notes" className="rounded-lg bg-surface p-5 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">Learning points</h2>
          <label htmlFor="notes-area" className="mt-4 block text-sm font-semibold">Choose an area</label>
          <select id="notes-area" value={section} onChange={(e) => setSection(e.target.value)} className="mt-2 w-full rounded-lg border-2 border-zinc-700 bg-surface p-3">
            <option value="">All Organisms areas</option>
            {organisms.sections.map((area) => <option key={area}>{area}</option>)}
          </select>
          <Link href={quizUrl} className="mt-4 inline-block rounded-lg bg-brand-pink px-4 py-3 font-bold text-white">Practise {section || "this test"}</Link>
          {section === "Digestive system" ? <DigestiveDiagram labelled /> : null}
          <div className="mt-5 space-y-3">
            {organisms.notes.filter((note) => !section || note.subtopic === section).map((note) => (
              <details key={note.id} className="rounded-lg border border-zinc-700 p-4">
                <summary className="cursor-pointer font-semibold text-ink"><span className="mb-1 block text-xs font-bold text-purple-300">{note.subtopic}</span>{note.question}</summary>
                <QuestionIllustration question={note.question} />
                <p className="mt-3 font-semibold text-pink-300">{note.answer}</p>
                <p className="mt-2 leading-relaxed text-zinc-300">{note.explanation}</p>
              </details>
            ))}
          </div>
        </section>
        <section id="checklist" className="rounded-lg bg-surface p-5 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">School test checklist</h2>
          <p className="mt-2 text-zinc-300">{confident} of {organisms.checklist.length} objectives marked confident.</p>
          <p className="mt-1 text-sm text-zinc-400">{storageAvailable ? "Your confidence ratings are saved on this device." : "Ratings work for this session, but could not be saved on this device."}</p>
          <div className="mt-5 space-y-4">
            {organisms.checklist.map((item) => (
              <fieldset key={item.id} className="rounded-lg border border-zinc-700 p-3">
                <legend className="px-1 text-sm font-bold text-purple-300">{item.area}</legend>
                <p className="font-semibold">{item.objective}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {confidenceOptions.map((value) => <button type="button" key={value} aria-pressed={ratings[item.id] === value} onClick={() => rate(item.id, value)} className={`rounded-lg border-2 px-2 py-3 text-sm font-bold ${ratings[item.id] === value ? "border-pink-400 bg-purple-950 text-pink-300" : "border-zinc-700"}`}>{value}</button>)}
                </div>
              </fieldset>
            ))}
          </div>
        </section>
        <section id="glossary" className="rounded-lg bg-surface p-5 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">Key words</h2>
          <dl className="mt-4 space-y-4">
            {organisms.glossary.map((entry) => <div key={entry.term}><dt className="font-bold text-pink-300">{entry.term}</dt><dd className="mt-1 text-zinc-300">{entry.definition}</dd></div>)}
          </dl>
        </section>
        <section id="resources" className="rounded-lg bg-surface p-5 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">School videos & further reading</h2>
          <ul className="mt-4 space-y-3">
            {organisms.videos.map((video) => <li key={video.url}><a href={video.url} target="_blank" rel="noopener noreferrer" className="font-bold text-pink-300 underline">{video.label} ↗</a></li>)}
          </ul>
          <h3 className="mt-6 text-lg font-bold">BBC Bitesize links from school</h3>
          <ul className="mt-3 space-y-3">{organisms.resources.map((resource) => <li key={resource.url}><a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-pink-300 underline">{resource.label} ↗</a></li>)}</ul>
          <p className="mt-4 text-sm text-zinc-300">School provides no Bitesize link for food tests or gut bacteria; use the learning points above and your textbook.</p>
          <p className="mt-4 text-xs text-zinc-400">Based on the Organisms knowledge organiser and school checklist/glossary.</p>
        </section>
      </div>
    </main>
  );
}
