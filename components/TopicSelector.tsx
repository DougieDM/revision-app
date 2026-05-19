"use client";

import { AVAILABLE_TOPICS, FUTURE_TOPICS } from "@/lib/quiz";

interface TopicSelectorProps {
  value: string;
  onChange: (topic: string) => void;
}

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-ink" htmlFor="topic">
        Choose a topic
      </label>
      <div className="grid gap-2">
        {AVAILABLE_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            className={`rounded-lg border-2 px-4 py-3 text-left text-base font-semibold transition ${
              value === topic
                ? "border-ocean bg-teal-50 text-ocean"
                : "border-slate-200 bg-white text-ink hover:border-teal-200"
            }`}
          >
            {topic}
          </button>
        ))}
        {FUTURE_TOPICS.map((topic) => (
          <button
            key={topic}
            type="button"
            disabled
            className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-left text-base font-semibold text-slate-400"
          >
            {topic} <span className="text-sm font-medium">Coming soon</span>
          </button>
        ))}
      </div>
    </div>
  );
}
