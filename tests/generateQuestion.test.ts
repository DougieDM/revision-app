import assert from "node:assert/strict";
import { test } from "node:test";
import { generateQuiz } from "../lib/generateQuestion";
import { facts, filterFacts, filterSeeds, makeRandom, seeds, styleToTypes } from "../lib/quiz";
import type { QuestionStyle, QuizSettings } from "../types/quiz";

const settings: QuizSettings = {
  topic: "All available topics", count: 10000, difficulty: "mixed", style: "mixed"
};
const styles: QuestionStyle[] = ["quick-recall", "multiple-choice", "explain", "spot-the-mistake", "mixed"];

for (const style of styles) {
  test(`${style}: every eligible fact generates an allowed, supported type`, () => {
    const selected = { ...settings, style };
    const questions = generateQuiz(selected, [], makeRandom(style));
    const dynamic = questions.filter((q) => q.id.startsWith("gen-"));
    assert.equal(dynamic.length, filterFacts(selected).length);
    assert.ok(dynamic.length > 0);
    for (const q of questions) assert.ok(styleToTypes(style).includes(q.type), `${q.sourceId}: ${q.type}`);
    for (const q of dynamic) {
      assert.ok(facts.find((fact) => fact.id === q.sourceId)!.questionTypes.includes(q.type));
      if (q.type === "multiple-choice") {
        assert.equal(q.options?.length, 4);
        assert.ok(q.options?.includes(q.answer));
      }
    }
  });

  test(`${style}: small and empty pools never broaden the selected filters`, () => {
    const topics = Array.from(new Set([...facts, ...seeds].map((item) => item.topic)));
    for (const topic of topics) {
      const subtopics = Array.from(new Set([...facts, ...seeds].filter((item) => item.topic === topic).map((item) => item.subtopic)));
      for (const subtopic of subtopics) {
        for (const difficulty of ["easy", "challenge", "mixed"] as const) {
          const selected = { ...settings, style, topic, subtopic, difficulty };
          const allowedSources = new Set([...filterFacts(selected), ...filterSeeds(selected)].map((item) => item.id));
          const questions = generateQuiz(selected, [], makeRandom(`${style}:${topic}:${subtopic}:${difficulty}`));
          assert.ok(questions.length <= allowedSources.size);
          assert.equal(questions.length === 0, allowedSources.size === 0);
          for (const q of questions) {
            assert.ok(allowedSources.has(q.sourceId));
            assert.ok(styleToTypes(style).includes(q.type));
            assert.equal(q.topic, topic);
            assert.equal(q.subtopic, subtopic);
          }
        }
      }
    }
    assert.deepEqual(generateQuiz({ ...settings, style, topic: "Unavailable topic" }), []);
    assert.deepEqual(generateQuiz({ ...settings, style, weakOnly: true }, []), []);
    assert.deepEqual(generateQuiz({ ...settings, style, weakOnly: true }, ["Unavailable weak area"]), []);
  });
}

test("Mixed: generated facts use all supported types and short quizzes include variety", () => {
  for (let run = 0; run < 20; run += 1) {
    const all = generateQuiz(settings, [], makeRandom(`all:${run}`));
    const dynamic = all.filter((q) => q.id.startsWith("gen-"));
    assert.deepEqual(new Set(dynamic.map((q) => q.type)), new Set(styleToTypes("mixed")));
    const short = generateQuiz({ ...settings, count: 12 }, [], makeRandom(`short:${run}`));
    for (const type of styleToTypes("mixed")) assert.equal(short.filter((q) => q.type === type).length, 2);
  }
});

test("Weak-area practice keeps matching subtopics and respects every style", () => {
  const subtopic = facts[0].subtopic;
  for (const style of styles) {
    const questions = generateQuiz({ ...settings, style, weakOnly: true }, [subtopic], makeRandom(style));
    for (const q of questions) {
      assert.equal(q.subtopic, subtopic);
      assert.ok(styleToTypes(style).includes(q.type));
    }
  }
});

test("Organisms retains one question per learning point", () => {
  for (const style of styles) {
    const questions = generateQuiz({ ...settings, topic: "Year 8 Organisms", style }, [], makeRandom(style));
    const learningPoints = questions.map((q) => q.sourceId.replace(/_(multiple-choice|recall|spot-the-mistake|explain)$/, ""));
    assert.equal(new Set(learningPoints).size, questions.length);
  }
});

test("Whole-unit Organisms quizzes cover all ten sections first", () => {
  for (let run = 0; run < 20; run += 1) {
    for (const style of styles) {
      const questions = generateQuiz({ ...settings, topic: "Year 8 Organisms", count: 10, style }, [], makeRandom(`sections:${run}:${style}`));
      assert.equal(new Set(questions.map((q) => q.subtopic)).size, 10);
      if (style === "mixed") assert.ok(new Set(questions.map((q) => q.type)).size >= 3);
    }
  }
});
