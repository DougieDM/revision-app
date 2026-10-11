import organisms from "@/data/organisms.json";
import { AVAILABLE_TOPICS, facts, seeds } from "@/lib/quiz";
import type { ProgressState } from "@/types/quiz";

export const revisionTopics = AVAILABLE_TOPICS.filter((topic) => topic !== "All available topics");
export interface UpcomingTest { title: string; topics: string[] }
export const defaultTest: UpcomingTest = { title: "Year 8 Organisms · 8.3–8.4", topics: ["Year 8 Organisms"] };
const TEST_KEY = "readispark-upcoming-test-v1";

export function loadUpcomingTest(): UpcomingTest {
  try {
    const saved = JSON.parse(window.localStorage.getItem(TEST_KEY) ?? "null");
    const topics = Array.isArray(saved?.topics) ? revisionTopics.filter((topic) => saved.topics.includes(topic)) : [];
    return topics.length ? { title: typeof saved.title === "string" && saved.title.trim() ? saved.title.slice(0, 100) : "Upcoming science test", topics } : defaultTest;
  } catch { return defaultTest; }
}

export function saveUpcomingTest(test: UpcomingTest) {
  try { window.localStorage.setItem(TEST_KEY, JSON.stringify(test)); return true; }
  catch { return false; }
}

export function getTopicAreas(topic: string) {
  return topic === organisms.title ? organisms.sections : Array.from(new Set([...facts, ...seeds].filter((item) => item.topic === topic).map((item) => item.subtopic)));
}

export function getTopicReadiness(progress: ProgressState, topic: string) {
  const areas = getTopicAreas(topic).map((area) => {
    const evidence = progress.readinessEvidence?.[topic]?.[area] ?? [];
    const correct = evidence.filter((item) => item.correct).length;
    // Five distinct learning points, or the entire area when it is smaller.
    const pool = topic === organisms.title ? organisms.notes.filter((item) => item.subtopic === area) : [...facts, ...seeds].filter((item) => item.topic === topic && item.subtopic === area);
    const minimum = Math.min(5, pool.length || 5);
    const score = Math.round(correct / Math.max(minimum, evidence.length) * 100);
    return { area, score, practised: evidence.length, minimum };
  });
  const practised = areas.filter((area) => area.practised > 0).length;
  const score = areas.length ? Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length) : 0;
  return { topic, score, areas, practised, level: readinessLevel(score, practised) };
}

export function readinessLevel(score: number, practised: number) {
  if (!practised) return "Not started";
  if (score >= 80) return "Looking strong";
  if (score >= 50) return "Building confidence";
  return "Getting started";
}

export function getTestReadiness(progress: ProgressState, test: UpcomingTest) {
  const topics = test.topics.map((topic) => getTopicReadiness(progress, topic));
  const score = topics.length ? Math.round(topics.reduce((sum, topic) => sum + topic.score, 0) / topics.length) : 0;
  return { score, topics, level: readinessLevel(score, topics.reduce((sum, topic) => sum + topic.practised, 0)) };
}
