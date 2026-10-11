"use client";

import { topicLabel } from "@/lib/topicLabels";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProgressState } from "@/types/quiz";
import { defaultTest, getTestReadiness, getTopicReadiness, loadUpcomingTest, revisionTopics, saveUpcomingTest, type UpcomingTest } from "@/lib/readiness";

export function ProgressSummary({ progress }: { progress: ProgressState }) {
  const [test, setTest] = useState<UpcomingTest>(defaultTest);
  const [draft, setDraft] = useState<UpcomingTest>(defaultTest);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { const saved = loadUpcomingTest(); setTest(saved); setDraft(saved); }, []);
  const readiness = getTestReadiness(progress, test);
  const nextAreas = readiness.topics.flatMap((topic) => topic.areas.map((area) => ({ ...area, topic: topic.topic }))).sort((a, b) => a.score - b.score).slice(0, 3);
  const accuracy = progress.questionsAnswered ? Math.round(progress.correctAnswers / progress.questionsAnswered * 100) : 0;
  const allTopics = revisionTopics.map((topic) => getTopicReadiness(progress, topic));
  const practiceUrl = (topic: string, area = "") => `/quiz?${new URLSearchParams({ topic, subtopic: area, count: "10", difficulty: "mixed", style: "mixed" })}`;

  return (
    <div className="space-y-6">
      <header>
        <p className="font-semibold text-purple-300">Readispark · Your revision dashboard</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Feel ready for your next test.</h1>
        <p className="mt-3 text-zinc-300">Your progress is saved in this browser on this device. Friends using their own devices have separate results. Sharing this browser profile shares these results.</p>
      </header>

      <section className="rounded-lg border border-pink-500 bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-sm font-bold uppercase tracking-wide text-pink-300">Upcoming test</p><h2 className="mt-2 text-2xl font-bold">{test.title}</h2><p className="mt-2 text-sm text-zinc-300">{test.topics.map(topicLabel).join(" · ")}</p></div>
          <button type="button" onClick={() => { setDraft(test); setEditing(!editing); setMessage(""); }} className="rounded-lg border border-purple-400 px-4 py-3 font-bold text-purple-300">{editing ? "Cancel" : "Change test"}</button>
        </div>
        {editing ? (
          <form className="mt-5 space-y-4 rounded-lg border border-zinc-700 p-4" onSubmit={(event) => {
            event.preventDefault();
            if (!draft.topics.length || !draft.title.trim()) { setMessage("Give your test a name and select at least one topic."); return; }
            const next = { ...draft, title: draft.title.trim() };
            const saved = saveUpcomingTest(next); setTest(next); setEditing(false);
            setMessage(saved ? "Upcoming test updated. Your practice history is kept." : "Test updated for this visit, but this browser could not save it.");
          }}>
            <div><label htmlFor="test-title" className="block font-bold">Test name</label><input id="test-title" required maxLength={100} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="mt-2 w-full rounded-lg border border-zinc-600 bg-black p-3" /></div>
            <fieldset><legend className="font-bold">Topics in this test</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{revisionTopics.map((topic) => <label key={topic} className="flex items-center gap-3"><input type="checkbox" checked={draft.topics.includes(topic)} onChange={(event) => setDraft({ ...draft, topics: event.target.checked ? [...draft.topics, topic] : draft.topics.filter((item) => item !== topic) })} className="h-5 w-5 accent-pink-500" />{topicLabel(topic)}</label>)}</div></fieldset>
            <p className="text-sm text-zinc-400">Choose from the topics currently available. New school test content can be added when it arrives.</p>
            <button className="rounded-lg bg-brand-pink px-4 py-3 font-bold text-white">Save upcoming test</button>
          </form>
        ) : null}
        {test.topics.includes("Year 8 Organisms") ? <Link href="/organisms" className="mt-4 inline-block font-bold text-purple-300 underline">Revision notes, checklist & videos</Link> : null}
        <p role="status" className="mt-3 text-sm text-pink-300">{message}</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div><p className="text-6xl font-black text-pink-300">{readiness.score}<span className="text-3xl">%</span></p><p className="mt-2 font-bold">{readiness.level}</p></div>
          <div><Meter score={readiness.score} label="Overall readiness" /><p className="mt-3 text-zinc-300">Overall readiness for the topics in this test. Each topic counts equally, including areas you haven’t practised yet.</p></div>
        </div>
        <details className="mt-5 text-sm text-zinc-300"><summary className="cursor-pointer font-bold text-purple-300">How this score works</summary><p className="mt-3 leading-relaxed">We look at your latest answers to up to 10 different learning points in each area. To build your score, try at least five different points, or all of them if there are fewer than five. Areas you have not tried yet score zero. We average the area scores for each topic, then the topic scores for your test. Written answers are marked automatically. You can use your own words, but include every key idea.</p><p className="mt-2">This score helps you choose what to practise. It does not predict your test mark. Older quiz scores stay in your history but do not count towards this score.</p></details>
      </section>

      <section className="rounded-lg bg-surface p-5"><h2 className="text-xl font-bold">Your next revision steps</h2><p className="mt-2 text-zinc-300">Start with areas you have practised least or found hardest.</p><div className="mt-4 grid gap-3 sm:grid-cols-3">{nextAreas.map((area) => <Link key={`${area.topic}:${area.area}`} href={practiceUrl(area.topic, area.area)} className="rounded-lg border border-purple-500 bg-purple-950 p-4"><p className="text-xs text-purple-300">{topicLabel(area.topic)}</p><h3 className="mt-2 font-bold">{area.area}</h3><p className="mt-2 text-sm text-zinc-300">{area.practised ? `${area.score}% readiness` : "Not practised yet"}</p><p className="mt-3 font-bold text-pink-300">Practise this area →</p></Link>)}</div></section>

      <section><h2 className="text-2xl font-bold">Readiness by topic</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{allTopics.map((topic) => <article key={topic.topic} className="rounded-lg bg-surface p-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="text-lg font-bold">{topicLabel(topic.topic)}</h3>{test.topics.includes(topic.topic) ? <span className="rounded-full bg-pink-950 px-3 py-1 text-xs font-bold text-pink-300">In your test</span> : null}</div><p className="mt-4 text-3xl font-black text-pink-300">{topic.score}%</p><p className="mt-1 font-semibold text-purple-300">{topic.level}</p><div className="mt-3"><Meter score={topic.score} label={`${topicLabel(topic.topic)} readiness`} /></div><p className="mt-3 text-sm text-zinc-300">{topic.practised} of {topic.areas.length} areas practised</p><details className="mt-3 text-sm"><summary className="cursor-pointer text-purple-300">See area readiness</summary><ul className="mt-3 space-y-2">{topic.areas.map((area) => <li key={area.area} className="flex justify-between gap-3"><span>{area.area}</span><span className="shrink-0 text-zinc-300">{area.practised ? `${area.score}%` : "Not started"}</span></li>)}</ul></details><Link href={practiceUrl(topic.topic)} className="mt-5 inline-block rounded-lg bg-brand-pink px-4 py-3 font-bold text-white">Practise topic</Link></article>)}</div></section>

      <section className="rounded-lg bg-surface p-5"><h2 className="text-xl font-bold">Practice history</h2><p className="mt-3 text-zinc-300">{progress.questionsAnswered} questions answered · {accuracy}% correct overall</p><p className="mt-2 text-sm text-zinc-400">Your overall accuracy includes all your quiz scores. Readiness also checks how many different areas you have tried.</p><div className="mt-4 space-y-2">{progress.recentScores.length ? progress.recentScores.map((score, index) => <div key={`${score.date}-${index}`} className="flex justify-between rounded-lg bg-zinc-900 p-3"><span>{new Date(score.date).toLocaleDateString("en-GB")}</span><strong>{score.score}/{score.total}</strong></div>) : <p className="text-zinc-300">Complete a practice session to start building your readiness.</p>}</div></section>
    </div>
  );
}

function Meter({ score, label }: { score: number; label: string }) {
  return <div role="progressbar" aria-label={label} aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} className="h-3 overflow-hidden rounded-full bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${score}%` }} /></div>;
}
