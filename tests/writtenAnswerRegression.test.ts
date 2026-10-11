import assert from "node:assert/strict";
import { test } from "node:test";
import { markAnswer, seedToQuestion, seeds, facts } from "../lib/quiz";
import { generateQuiz } from "../lib/generateQuestion";

function question(id: number, type = "recall") {
  return seedToQuestion(seeds.find(q => q.id === `organisms_${String(id).padStart(3, "0")}_${type}`)!);
}

const cases: [number, string[], string[]][] = [
  [1, [
    "Oxygen passes from the air into the blood and carbon dioxide passes from the blood into the air",
    "Carbon dioxide diffuses from the blood into the air. Oxygen diffuses from the air into the blood.",
    "O2 moves from air to blood. CO2 moves from blood to air.",
    "Oxygen is absorbed into the blood and carbon dioxide is released from the blood.",
    "The blood absorbs oxygen and carbon dioxide leaves the blood."
  ], [
    "Oxygen passes into the blood", "Carbon dioxide leaves the blood", "Oxygen blood carbon dioxide air",
    "Oxygen moves from the blood into the air and carbon dioxide moves from the air into the blood",
    "Oxygen never enters the blood and carbon dioxide leaves the blood",
    "Oxygen doesn't enter blood and carbon dioxide leaves blood",
    "Oxygen doesn’t enter blood and carbon dioxide leaves blood",
    "Oxygen enters blood but carbon dioxide does not leave blood",
    "Oxygen enters blood and carbon dioxide leaves blood, but oxygen also leaves blood",
    "Maybe oxygen enters blood and carbon dioxide leaves blood",
    "Oxygen enters blood and carbon dioxide enters blood and leaves blood"
  ]],
  [4, ["A good blood supply, thin walls and a large surface area"], ["Large surface area and thin walls", "Thick walls and a good blood supply"]],
  [5, ["More carbon dioxide and less oxygen"], ["More oxygen and less carbon dioxide", "Less oxygen"]],
  [6, ["Respiration uses glucose and oxygen to release energy and makes water and carbon dioxide"], ["Glucose reacts with oxygen to release energy", "Carbon dioxide reacts with water to make glucose and oxygen", "Glucose and oxygen react to make carbon dioxide and water"]],
  [7, ["It becomes flat and gets shorter"], ["It relaxes and becomes flat", "It flattens"]],
  [9, ["Pressure decreases because chest volume increases"], ["Chest volume increases so pressure increases", "Pressure decreases"]],
  [10, ["Pressure increases, the muscles relax and chest volume decreases"], ["The muscles relax and chest volume decreases", "Muscles contract, chest volume decreases and pressure increases"]],
  [30, ["They reduce heat loss and store energy"], ["They store energy"]],
  [36, ["It turns blue-black"], ["Purple", "It doesn't turn blue-black"]],
  [37, ["Heat in a hot water bath after adding Benedict's solution"], ["Add Benedict's solution", "Add iodine and heat in a hot water bath"]],
  [38, ["Blue turns brick-red", "Blue turns orange"], ["It stays blue", "Purple", "Brick-red or blue"]],
  [39, ["Blue turns purple", "Blue turns lilac"], ["Blue turns blue-black", "It stays blue"]],
  [40, ["A white cloudy emulsion forms"], ["A clear mixture", "Blue-black"]],
  [48, ["Large food molecules are broken down into small soluble molecules"], ["Small food molecules are broken down into large soluble molecules", "Breaking food into pieces"]],
  [51, ["The gullet carries food from the mouth to the stomach"], ["Moves food from the stomach to the mouth", "Moves food from the mouth to the lungs"]],
  [53, ["The small intestine", "Nutrients pass through the wall of the small intestine into the blood"], ["Small", "The large intestine", "The small intestine or stomach", "The small intestine and the large intestine"]],
  [59, ["It speeds up chemical reactions in living organisms"], ["It slows chemical reactions", "A biological catalyst that is used up in the reaction"]],
  [60, ["Amylase converts starch to sugars", "Starch into sugars"], ["Sugars into starch", "Protein into amino acids", "Starch", "Starch into sugars and protein into amino acids"]],
  [61, ["Protease converts proteins to amino acids"], ["Amino acids into proteins", "Starch into sugars"]],
  [62, ["Lipase converts fats to fatty acids and glycerol", "Lipids into glycerol and fatty acids"], ["Fats into fatty acids", "Fatty acids and glycerol into fats"]],
  [64, ["Some gut bacteria make vitamins", "Some gut bacteria help digest food"], ["All bacteria are harmful"]],
  [65, ["Small soluble nutrients pass through the intestine wall into the blood"], ["Nutrients pass from blood into intestine", "Nutrients enter the blood"]]
];

for (const [id, correct, incorrect] of cases) {
  test(`Organisms ${id}: complete paraphrases pass; incomplete or wrong science fails`, () => {
    for (const type of ["recall", "explain"]) {
      const q = question(id, type);
      for (const answer of correct) assert.equal(markAnswer(q, answer), true, `${type}: ${answer}`);
      for (const answer of incorrect) assert.equal(markAnswer(q, answer), false, `${type}: ${answer}`);
    }
  });
}

test("Every authored written alternative and model remains accepted", () => {
  for (const seed of seeds.filter(q => q.type !== "multiple-choice")) {
    for (const answer of [...(seed.acceptedAnswers ?? []), seed.answer]) {
      assert.equal(markAnswer(seedToQuestion(seed), answer), true, `${seed.id}: ${answer}`);
    }
  }
});

test("Routes retain ordering and do not lose direction words", () => {
  assert.ok(markAnswer(question(3), "Windpipe, bronchi, bronchioles, alveoli"));
  assert.ok(markAnswer(question(3), "Trachea then bronchi then bronchioles and alveoli"));
  assert.equal(markAnswer(question(3), "Alveoli, bronchioles, bronchi, trachea"), false);
  assert.equal(markAnswer(question(3), "Trachea, oesophagus, bronchi, bronchioles, alveoli"), false);
  assert.ok(markAnswer(question(49), "Mouth, gullet, stomach, small intestine, large intestine, rectum, anus"));
  assert.equal(markAnswer(question(49), "Mouth, oesophagus, stomach, large intestine, small intestine, rectum, anus"), false);
});

test("Scientifically correct negative statements remain supported", () => {
  assert.ok(markAnswer(question(13), "The jar does not show the ribs moving"));
  assert.equal(markAnswer(question(13), "The jar does show the ribs moving"), false);
  const q = question(59, "explain");
  assert.ok(markAnswer(q, q.answer));
  assert.equal(markAnswer(q, q.answer.replace("not used up", "used up")), false);
});

test("Multiple choice stays exact and missing words retain their generated answer", () => {
  const q = question(1, "multiple-choice");
  assert.ok(markAnswer(q, q.answer));
  assert.equal(markAnswer(q, cases[0][1][0]), false);
  for (const fact of facts.filter(f => f.questionTypes.includes("fill-blank"))) {
    const quiz = generateQuiz({topic: fact.topic, subtopic: fact.subtopic, count: 1000, difficulty: "mixed", style: "quick-recall"});
    for (const item of quiz.filter(q => q.type === "fill-blank")) assert.ok(markAnswer(item, item.answer));
  }
});

test("Generic matching keeps negatives, full words and relationships", () => {
  const q = { ...question(51), marking: undefined };
  assert.equal(markAnswer(q, "Food moves from stomach to mouth"), false);
  assert.equal(markAnswer(q, "Food does not move from mouth to stomach"), false);
  assert.ok(markAnswer({...q, answer: "No light passes through", acceptedAnswers: ["No light passes through"]}, "No light passes through"));
  assert.equal(markAnswer({...q, answer: "No light passes through", acceptedAnswers: ["No light passes through"]}, "Light passes through"), false);
  assert.equal(markAnswer(question(55), "Water and sugar"), false);
  assert.equal(markAnswer(question(53), "Small intestinal"), false);
});
