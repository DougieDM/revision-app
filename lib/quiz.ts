import knowledgeBase from "@/data/knowledge-base.json";
import seedQuestions from "@/data/questions.seed.json";
import type {
  Difficulty,
  DifficultySetting,
  GeneratedQuestion,
  KnowledgeFact,
  KnowledgeQuestionType,
  QuestionStyle,
  QuizSettings,
  SeedQuestion
} from "@/types/quiz";

export const FUTURE_TOPICS = ["Forces"];
export const AVAILABLE_TOPICS = [
  "All available topics",
  "Acids and Alkalis",
  "Ecosystems",
  "Skills in Science",
  "Waves"
];

export const facts = knowledgeBase as KnowledgeFact[];
export const seeds = seedQuestions as SeedQuestion[];

export function shuffle<T>(items: T[], random = Math.random): T[] {
  return [...items].sort(() => random() - 0.5);
}

export function makeRandom(seed: string) {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function styleToTypes(style: QuestionStyle): KnowledgeQuestionType[] {
  if (style === "quick-recall") return ["recall", "fill-blank"];
  if (style === "multiple-choice") return ["multiple-choice"];
  if (style === "explain") return ["explain", "application"];
  if (style === "spot-the-mistake") return ["spot-the-mistake"];
  return ["recall", "multiple-choice", "fill-blank", "explain", "spot-the-mistake", "application"];
}

export function difficultyMatches(itemDifficulty: Difficulty, setting: DifficultySetting) {
  if (setting === "mixed") return true;
  if (setting === "easy") return itemDifficulty === "easy";
  return itemDifficulty === "medium" || itemDifficulty === "challenge";
}

export function filterFacts(settings: QuizSettings, weakSubtopics: string[] = []) {
  const types = styleToTypes(settings.style);
  return facts.filter((fact) => {
    const topicMatches =
      settings.topic === "All available topics" || fact.topic === settings.topic;
    const typeMatches = fact.questionTypes.some((type) => types.includes(type));
    const weakMatches = !settings.weakOnly || weakSubtopics.includes(fact.subtopic);
    return topicMatches && typeMatches && weakMatches && difficultyMatches(fact.difficulty, settings.difficulty);
  });
}

export function filterSeeds(settings: QuizSettings, weakSubtopics: string[] = []) {
  const types = styleToTypes(settings.style);
  return seeds.filter((seed) => {
    const topicMatches =
      settings.topic === "All available topics" || seed.topic === settings.topic;
    const weakMatches = !settings.weakOnly || weakSubtopics.includes(seed.subtopic);
    return topicMatches && types.includes(seed.type) && weakMatches && difficultyMatches(seed.difficulty, settings.difficulty);
  });
}

export function markAnswer(question: GeneratedQuestion, userAnswer: string) {
  const answer = normalise(userAnswer);
  if (!answer) return false;
  if (question.type === "multiple-choice") return answer === normalise(question.answer);

  const accepted = question.acceptedAnswers.map(normalise);
  if (accepted.some((acceptedAnswer) => answer.includes(acceptedAnswer) || acceptedAnswer.includes(answer))) {
    return true;
  }

  const keywordHits = question.keywords.filter((keyword) => answer.includes(normalise(keyword)));
  const needed = question.type === "explain" || question.type === "application" ? 2 : 1;
  return keywordHits.length >= needed;
}

export function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s+\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getTopicBreakdown(answers: { topic: string; correct: boolean }[]) {
  return answers.reduce<Record<string, { correct: number; total: number }>>((breakdown, answer) => {
    if (!breakdown[answer.topic]) breakdown[answer.topic] = { correct: 0, total: 0 };
    breakdown[answer.topic].total += 1;
    if (answer.correct) breakdown[answer.topic].correct += 1;
    return breakdown;
  }, {});
}

export function getWeakAreas(answers: { subtopic: string; correct: boolean }[]) {
  const misses = answers.reduce<Record<string, number>>((all, answer) => {
    if (!answer.correct) all[answer.subtopic] = (all[answer.subtopic] ?? 0) + 1;
    return all;
  }, {});

  return Object.entries(misses)
    .sort((a, b) => b[1] - a[1])
    .map(([subtopic]) => subtopic);
}

export function buildPrintableTest() {
  const random = makeRandom("nova-printable-test-v1");
  return shuffle(seeds, random).slice(0, 20).map(seedToQuestion);
}

export function seedToQuestion(seed: SeedQuestion): GeneratedQuestion {
  return {
    id: seed.id,
    sourceId: seed.id,
    topic: seed.topic,
    subtopic: seed.subtopic,
    difficulty: seed.difficulty,
    type: seed.type,
    question: seed.question,
    options: seed.options,
    answer: seed.answer,
    acceptedAnswers: seed.acceptedAnswers ?? [seed.answer],
    keywords: seed.keywords ?? [],
    explanation: seed.explanation,
    hint: seed.hint ?? "Look for the key science word in the question."
  };
}

function factToPrintableQuestion(fact: KnowledgeFact, random: () => number): GeneratedQuestion {
  const type = shuffle(fact.questionTypes, random)[0] ?? "recall";
  const question =
    type === "fill-blank"
      ? makeFillBlank(fact.fact)
      : type === "explain" || type === "application"
        ? `Explain this idea: ${fact.fact}`
        : `What do you know about this? ${fact.fact.replace(/\.$/, "")}.`;

  return {
    id: `print-${fact.id}`,
    sourceId: fact.id,
    topic: fact.topic,
    subtopic: fact.subtopic,
    difficulty: fact.difficulty,
    type,
    question,
    answer: fact.acceptedAnswers[0] ?? fact.fact,
    acceptedAnswers: fact.acceptedAnswers,
    keywords: fact.keywords,
    explanation: fact.explanation,
    hint: "Use the science words you have practised."
  };
}

export function makeFillBlank(fact: string) {
  const words = fact.replace(/\.$/, "").split(" ");
  const targetIndex = Math.max(0, words.findIndex((word) => word.length > 5));
  const target = words[targetIndex] ?? words[words.length - 1];
  words[targetIndex] = "______";
  return words.join(" ") + `.`;
}
