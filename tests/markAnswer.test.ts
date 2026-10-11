import assert from "node:assert/strict";
import { test } from "node:test";
import { markAnswer, seedToQuestion, seeds } from "../lib/quiz";

test("Every authored answer is automatically accepted", () => {
  for (const seed of seeds) assert.ok(markAnswer(seedToQuestion(seed), seed.answer), seed.id);
});

test("Written answers need the complete idea, not a fragment or keyword", () => {
  const question = seedToQuestion(seeds.find(seed => seed.id === "organisms_001_recall")!);
  for (const answer of ["", "take", "oxygen", "blood", "Take oxygen into the blood", "Do not take oxygen into the blood and remove carbon dioxide"]) {
    assert.equal(markAnswer(question, answer), false, answer);
  }
  assert.ok(markAnswer(question, "It takes oxygen into the blood and removes carbon dioxide."));
  assert.equal(markAnswer(question, "Take carbon dioxide into the blood and remove oxygen"), false);
});

test("Short answers use whole words and supported synonyms", () => {
  const seed = seeds.find(seed => seed.topic === "Year 8 Organisms" && seed.type === "recall" && seed.answer === "Small intestine")!;
  const question = seedToQuestion(seed);
  assert.equal(markAnswer(question, "small"), false);
  assert.equal(markAnswer(question, "large intestine"), false);
  assert.ok(markAnswer(question, "The small intestine."));
});
