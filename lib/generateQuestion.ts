import { filterFacts, filterSeeds, makeFillBlank, seedToQuestion, shuffle } from "@/lib/quiz";
import type { GeneratedQuestion, KnowledgeFact, KnowledgeQuestionType, QuizSettings } from "@/types/quiz";

const MCQ_DISTRACTORS = [
  "pH 7",
  "producer",
  "dependent variable",
  "stigma",
  "neutralisation",
  "repeat measurements",
  "decomposer",
  "universal indicator",
  "control variable",
  "germination"
];

export function generateQuiz(settings: QuizSettings, weakSubtopics: string[] = []) {
  const seedPool = filterSeeds(settings, weakSubtopics).map(seedToQuestion);
  const factPool = filterFacts(settings, weakSubtopics).map(factToQuestion);
  const pool = [...shuffle(seedPool), ...shuffle(factPool)];
  const fallbackPool = [
    ...shuffle(filterSeeds({ ...settings, weakOnly: false }).map(seedToQuestion)),
    ...shuffle(filterFacts({ ...settings, weakOnly: false }).map(factToQuestion))
  ];
  const available = pool.length ? pool : fallbackPool;
  let ordered = available;
  if (settings.topic === "Year 8 Organisms" && !settings.subtopic) {
    const sections = Array.from(new Set(available.map((q) => q.subtopic)));
    const queues = sections.map((section) => available.filter((q) => q.subtopic === section));
    ordered = [];
    while (queues.some((queue) => queue.length)) {
      queues.forEach((queue) => { const question = queue.shift(); if (question) ordered.push(question); });
    }
  }
  const seenLearningPoints = new Set<string>();
  const unique = ordered.filter((question) => {
    if (question.topic !== "Year 8 Organisms") return true;
    const learningPoint = question.sourceId.replace(/_(multiple-choice|recall|spot-the-mistake|explain)$/, "");
    if (seenLearningPoints.has(learningPoint)) return false;
    seenLearningPoints.add(learningPoint);
    return true;
  });
  const selected = unique.slice(0, settings.count);

  return selected.map((question, index) => ({ ...question, options: question.options ? shuffle(question.options) : undefined, id: `${question.id}-${index}` }));
}

function factToQuestion(fact: KnowledgeFact): GeneratedQuestion {
  const type = chooseType(fact.questionTypes);
  if (type === "multiple-choice") return multipleChoiceFromFact(fact);
  if (type === "fill-blank") return baseFromFact(fact, type, makeFillBlank(fact.fact));
  if (type === "explain") {
    return baseFromFact(fact, type, `Explain this science idea: ${fact.fact}`);
  }
  if (type === "spot-the-mistake") {
    const mistake = fact.commonMistakes[0] ?? "The science word has been mixed up.";
    return baseFromFact(
      fact,
      type,
      `Revisionary hears this answer: "${mistake}." What is the mistake?`
    );
  }
  if (type === "application") {
    return baseFromFact(
      fact,
      type,
      `Use your science knowledge to answer this: ${fact.fact}`
    );
  }
  return baseFromFact(fact, "recall", makeRecallPrompt(fact));
}

function chooseType(types: KnowledgeQuestionType[]) {
  const preferred = ["multiple-choice", "recall", "fill-blank", "explain", "spot-the-mistake", "application"] as const;
  return preferred.find((type) => types.includes(type)) ?? types[0] ?? "recall";
}

function baseFromFact(fact: KnowledgeFact, type: KnowledgeQuestionType, question: string): GeneratedQuestion {
  return {
    id: `gen-${fact.id}-${type}`,
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
    hint: `Think about: ${fact.keywords.slice(0, 2).join(" and ")}.`
  };
}

function multipleChoiceFromFact(fact: KnowledgeFact): GeneratedQuestion {
  const answer = fact.acceptedAnswers[0] ?? fact.fact;
  const options = shuffle([
    answer,
    ...MCQ_DISTRACTORS.filter((option) => option.toLowerCase() !== answer.toLowerCase())
  ]).slice(0, 4);

  if (!options.includes(answer)) options[0] = answer;

  return {
    ...baseFromFact(fact, "multiple-choice", makeRecallPrompt(fact)),
    options: shuffle(options),
    answer
  };
}

function makeRecallPrompt(fact: KnowledgeFact) {
  const firstKeyword = fact.keywords[0] ?? fact.subtopic;
  if (fact.fact.includes("pH")) return `What does this pH fact mean: ${fact.fact}`;
  if (fact.fact.includes(" is ")) return `What is ${firstKeyword}?`;
  return `Recall a fact about ${fact.subtopic.toLowerCase()}: ${fact.fact}`;
}
