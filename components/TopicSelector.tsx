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
                ? "border-pink-400 bg-purple-950 text-pink-300"
                : "border-zinc-700 bg-surface text-ink hover:border-pink-400"
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
            className="rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 px-4 py-3 text-left text-base font-semibold text-zinc-500"
          >
            {topic} <span className="text-sm font-medium">Coming soon</span>
          </button>
        ))}
      </div>
    </div>
  );
}
