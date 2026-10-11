import assert from "node:assert/strict";
import { test } from "node:test";
import organisms from "../data/organisms.json";
import { generateQuiz } from "../lib/generateQuestion";
import { facts, makeRandom, markAnswer, seeds } from "../lib/quiz";

const teacherWording = /the source (asks|expects)|this is the (source|glossary) definition|that is the (source|glossary) definition|this objective is from|questions should|pupils should|the checklist (asks|says)/i;
const words = (text: string) => text.trim().split(/\s+/).length;

test("Every fact has short student-facing prompts for its supported styles", () => {
  for (const fact of facts) {
    const prompts = [fact.recallPrompt];
    if (fact.questionTypes.includes("explain")) prompts.push(fact.explainPrompt!);
    if (fact.questionTypes.includes("application")) prompts.push(fact.applicationPrompt!);
    for (const prompt of prompts) {
      assert.ok(prompt?.trim(), fact.id);
      assert.ok(words(prompt) <= 40, `${fact.id}: long prompt`);
      assert.ok(!prompt.includes(fact.fact), `${fact.id}: answer in prompt`);
      assert.ok(!teacherWording.test(prompt), fact.id);
    }
  }
});

test("Notes, questions and explanations teach students instead of describing source files", () => {
  const texts = [
    ...facts.flatMap((f) => [f.fact, f.explanation]),
    ...seeds.flatMap((q) => [q.question, q.explanation, q.hint ?? ""]),
    ...organisms.notes.flatMap((n) => [n.question, n.answer, n.explanation]),
    ...organisms.glossary.map((g) => g.definition),
    ...organisms.checklist.map((c) => c.objective)
  ];
  for (const text of texts) assert.ok(!teacherWording.test(text), text);
  for (const q of seeds) assert.ok(words(q.question) <= 50, q.id);
});

test("Edited multiple-choice questions retain four distinct choices and the correct answer", () => {
  for (const q of seeds.filter((q) => q.type === "multiple-choice")) {
    assert.equal(q.options?.length, 4, q.id);
    assert.equal(new Set(q.options).size, 4, q.id);
    assert.ok(q.options?.includes(q.answer), q.id);
  }
});

test("Generated missing-word questions accept the missing word", () => {
  const questions = generateQuiz({ topic: "All available topics", count: 10000, difficulty: "mixed", style: "quick-recall" }, [], makeRandom("missing-word"));
  const blanks = questions.filter((q) => q.id.startsWith("gen-") && q.type === "fill-blank");
  assert.ok(blanks.length > 0);
  for (const q of blanks) {
    assert.ok(q.question.includes("______"), q.sourceId);
    assert.equal(words(q.answer), 1, q.sourceId);
    assert.ok(markAnswer(q, q.answer), q.sourceId);
    assert.ok(!markAnswer(q, "not the right word"), q.sourceId);
  }
});
