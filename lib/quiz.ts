import knowledgeBase from "@/data/knowledge-base.json";
import organismsQuestions from "@/data/organisms.questions.json";
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

export const AVAILABLE_TOPICS = [
  "All available topics",
  "Acids and Alkalis",
  "Ecosystems",
  "Skills in Science",
  "Waves",
  "Year 8 Organisms"
];

export const facts = knowledgeBase as KnowledgeFact[];
export const seeds = [...seedQuestions, ...organismsQuestions] as SeedQuestion[];

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
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
  // Retired styles in old links must not generate questions or broaden filters.
  if (style === "spot-the-mistake") return [];
  return ["recall", "multiple-choice", "fill-blank", "explain", "application"];
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
    return (!settings.subtopic || fact.subtopic === settings.subtopic) && topicMatches && typeMatches && weakMatches && difficultyMatches(fact.difficulty, settings.difficulty);
  });
}

export function filterSeeds(settings: QuizSettings, weakSubtopics: string[] = []) {
  const types = styleToTypes(settings.style);
  return seeds.filter((seed) => {
    const topicMatches =
      settings.topic === "All available topics" || seed.topic === settings.topic;
    const weakMatches = !settings.weakOnly || weakSubtopics.includes(seed.subtopic);
    return (!settings.subtopic || seed.subtopic === settings.subtopic) && topicMatches && types.includes(seed.type) && weakMatches && difficultyMatches(seed.difficulty, settings.difficulty);
  });
}

export function markAnswer(question: GeneratedQuestion, userAnswer: string) {
  const answer = normalise(userAnswer);
  if (!answer) return false;
  if (question.type === "multiple-choice") return answer === normalise(question.answer);

  // Check complete answer ideas, never a fragment or an isolated keyword.
  // Retain word order so reversed routes and relationships do not pass.
  return [...question.acceptedAnswers, question.answer].some((expected) => {
    const reference = normalise(expected);
    if (answer === reference) return true;
    const negated = (value: string) => /\b(not|never|no|cannot|can t|doesn t|don t|isn t|aren t|won t)\b/.test(value);
    if (negated(answer) !== negated(reference)) return false;
    const required = answerWords(reference);
    const given = answerWords(answer);
    if (!required.length) return false;
    let position = 0;
    for (const word of given) if (word === required[position]) position += 1;
    return position === required.length;
  });
}

function answerWords(value: string) {
  const filler = new Set("a an the is are was were be been being it its they their this that these those of to in on at by for with and or which so can will would should could because means also then very".split(" "));
  const aliases: Record<string, string> = { esophagus: "oesophagus", windpipe: "trachea", gullet: "oesophagus", lungs: "lung", air: "air", moves: "move", moving: "move", moved: "move", takes: "take", taking: "take", removes: "remove", removing: "remove", absorbs: "absorb", absorbed: "absorb", absorption: "absorb", increases: "increase", decreases: "decrease", nutrients: "nutrient", walls: "wall", molecules: "molecule" };
  return value.split(" ").filter(word => !filler.has(word)).map(word => aliases[word] ?? word);
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

export function buildPrintableTest(topic = "All available topics", subtopic = "") {
  const random = makeRandom(`revisionary-printable-test-v2:${topic}:${subtopic}`);
  const pool = seeds.filter((q) =>
    q.type !== "spot-the-mistake" &&
    (topic === "All available topics" || q.topic === topic) &&
    (!subtopic || q.subtopic === subtopic) &&
    (q.topic !== "Year 8 Organisms" || q.type === "recall")
  );
  // A whole-unit test samples every section before selecting further questions.
  const shuffled = shuffle(pool, random);
  const firstBySection = new Map<string, SeedQuestion>();
  if (topic === "Year 8 Organisms" && !subtopic) {
    shuffled.forEach((q) => { if (!firstBySection.has(q.subtopic)) firstBySection.set(q.subtopic, q); });
  }
  const first = Array.from(firstBySection.values());
  return [...first, ...shuffled.filter((q) => !first.includes(q))].slice(0, 20).map(seedToQuestion);
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
  return makeFillBlankParts(fact).question;
}

export function makeFillBlankParts(fact: string) {
  const words = fact.replace(/\.$/, "").split(" ");
  const targetIndex = Math.max(0, words.findIndex((word) => word.length > 5));
  const target = words[targetIndex] ?? words[words.length - 1];
  words[targetIndex] = "______";
  return { question: words.join(" ") + ".", answer: target.replace(/[^\w-]/g, "") };
}
