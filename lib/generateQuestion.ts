import { filterFacts, filterSeeds, makeFillBlankParts, seedToQuestion, shuffle, styleToTypes } from "@/lib/quiz";
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

export function generateQuiz(settings: QuizSettings, weakSubtopics: string[] = [], random = Math.random) {
  const allowedTypes = styleToTypes(settings.style);
  const typeCounts = new Map<KnowledgeQuestionType, number>();
  const seedPool = filterSeeds(settings, weakSubtopics).map(seedToQuestion);
  const factPool = shuffle(filterFacts(settings, weakSubtopics), random).map((fact) => {
    const types = fact.questionTypes.filter((type) => allowedTypes.includes(type));
    // Rotate among the least-used supported types; randomise ties so data order
    // does not decide which style wins. Filtering guarantees a non-empty list.
    const type = shuffle(types, random).reduce((leastUsed, candidate) =>
      (typeCounts.get(candidate) ?? 0) < (typeCounts.get(leastUsed) ?? 0) ? candidate : leastUsed
    );
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    return factToQuestion(fact, type, random);
  });
  const available = [...shuffle(seedPool, random), ...shuffle(factPool, random)];
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
  // Deal one question of each available type per round. This also prevents the
  // seed-first pool from hiding the variety of dynamically generated questions.
  let varied = unique;
  if (settings.style === "mixed") {
    const types = shuffle(Array.from(new Set(unique.map((q) => q.type))), random);
    const queues = types.map((type) => unique.filter((q) => q.type === type));
    varied = [];
    while (queues.some((queue) => queue.length)) {
      queues.forEach((queue) => { const question = queue.shift(); if (question) varied.push(question); });
    }
    // Whole-unit Organisms practice still covers every section first, drawing
    // from the type-balanced order within each section.
    if (settings.topic === "Year 8 Organisms" && !settings.subtopic) {
      const sections = Array.from(new Set(unique.map((q) => q.subtopic)));
      const sectionQueues = sections.map((section) => varied.filter((q) => q.subtopic === section));
      const selectedTypeCounts = new Map<KnowledgeQuestionType, number>();
      varied = [];
      while (sectionQueues.some((queue) => queue.length)) {
        sectionQueues.forEach((queue) => {
          if (!queue.length) return;
          const index = queue.reduce((best, question, candidate) =>
            (selectedTypeCounts.get(question.type) ?? 0) < (selectedTypeCounts.get(queue[best].type) ?? 0) ? candidate : best,
            0
          );
          const [question] = queue.splice(index, 1);
          selectedTypeCounts.set(question.type, (selectedTypeCounts.get(question.type) ?? 0) + 1);
          varied.push(question);
        });
      }
    }
  }
  const selected = varied.slice(0, settings.count);

  return selected.map((question, index) => ({ ...question, options: question.options ? shuffle(question.options, random) : undefined, id: `${question.id}-${index}` }));
}

function factToQuestion(fact: KnowledgeFact, type: KnowledgeQuestionType, random: () => number): GeneratedQuestion {
  if (type === "multiple-choice") return multipleChoiceFromFact(fact, random);
  if (type === "fill-blank") {
    const blank = makeFillBlankParts(fact.fact);
    return { ...baseFromFact(fact, type, `Fill in the missing word: ${blank.question}`), answer: blank.answer, acceptedAnswers: [blank.answer], keywords: [blank.answer] };
  }
  if (type === "explain") {
    return baseFromFact(fact, type, fact.explainPrompt ?? `${fact.recallPrompt} Explain the idea in your own words.`);
  }
  if (type === "spot-the-mistake") {
    const mistake = fact.commonMistakes[0] ?? "The science word has been mixed up.";
    return baseFromFact(
      fact,
      type,
      `A student says: "${mistake.replace(/\.$/, "")}." What is wrong? Write the correct idea.`
    );
  }
  if (type === "application") {
    return baseFromFact(
      fact,
      type,
      fact.applicationPrompt ?? fact.recallPrompt
    );
  }
  return baseFromFact(fact, "recall", makeRecallPrompt(fact));
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
    answer: type === "explain" || type === "application" ? fact.explanation : fact.acceptedAnswers[0] ?? fact.fact,
    acceptedAnswers: fact.acceptedAnswers,
    keywords: fact.keywords,
    explanation: fact.explanation,
    hint: `Think about: ${fact.keywords.slice(0, 2).join(" and ")}.`
  };
}

function multipleChoiceFromFact(fact: KnowledgeFact, random: () => number): GeneratedQuestion {
  const answer = fact.acceptedAnswers[0] ?? fact.fact;
  const options = shuffle([
    answer,
    ...MCQ_DISTRACTORS.filter((option) => option.toLowerCase() !== answer.toLowerCase())
  ], random).slice(0, 4);

  if (!options.includes(answer)) options[0] = answer;

  return {
    ...baseFromFact(fact, "multiple-choice", makeRecallPrompt(fact)),
    options: shuffle(options, random),
    answer
  };
}

function makeRecallPrompt(fact: KnowledgeFact) {
  return fact.recallPrompt;
}
