import type { GeneratedQuestion } from "@/types/quiz";

// Do not discard relationship words (from, into, out, before, after), quantities,
// or negatives. Those words can change the science even when nouns match.
const filler = new Set("a an the is are was were be been being it its they their this that these those can will would should could also and then".split(" "));
const aliases: Record<string, string> = {
  esophagus: "oesophagus", windpipe: "trachea", gullet: "oesophagus",
  alveolus: "alveoli", sacs: "sac", lungs: "lung", nutrients: "nutrient",
  walls: "wall", molecules: "molecule", proteins: "protein", sugars: "sugar",
  fats: "lipid", fat: "lipid", lipids: "lipid", feces: "faeces", poo: "faeces",
  moves: "move", moving: "move", moved: "move", passes: "move", pass: "move",
  passing: "move", diffuses: "move", diffuse: "move", diffusing: "move",
  takes: "take", taking: "take", removes: "remove", removing: "remove",
  absorbs: "absorb", absorbed: "absorb", absorbing: "absorb",
  increases: "increase", increasing: "increase", decreases: "decrease",
  decreasing: "decrease", contracts: "contract", contracting: "contract",
  flattens: "flatten", flattening: "flatten", relaxes: "relax", relaxing: "relax",
  breaks: "break", breaking: "break", produces: "produce", producing: "produce",
  makes: "make", making: "make", releases: "release", releasing: "release",
  adding: "add", adds: "add",
  kilojoules: "kj", kilojoule: "kj", anemia: "anaemia", fibres: "fibre", fiber: "fibre"
};

function tokens(value: string): string[] {
  return value.toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\bco2\b/g, "carbon dioxide").replace(/\bo2\b/g, "oxygen")
    .replace(/[^\w\s]/g, " ").trim().split(/\s+/)
    .filter(word => word && !filler.has(word)).map(word => aliases[word] ?? word);
}

function contains(given: string[], expected: string[]): boolean {
  return expected.length > 0 && given.some((_, start) =>
    expected.every((word, offset) => given[start + offset] === word));
}

function negated(value: string): boolean {
  return /\b(not|never|no|cannot|cant|dont|doesnt|didnt|isnt|arent|wont|wasnt|werent|hasnt|havent|without)\b/.test(value.toLowerCase().replace(/[’']/g, ""));
}

export function matchesWrittenAnswer(question: GeneratedQuestion, answer: string): boolean {
  const given = tokens(answer);
  const references = [...question.acceptedAnswers, question.answer];
  const rule = question.marking;
  // Exact complete authored answers include legitimate negatives such as
  // "bile is not an enzyme". They do not need approximate matching.
  if (references.some(reference => given.join(" ") === tokens(reference).join(" "))) return true;

  // Misconceptions veto an approximate match even when a correct phrase is also
  // present. Exact authored negatives above ("not used up") remain valid.
  if (rule?.reject?.some(phrase => contains(given, tokens(phrase)))) return false;

  if (rule) {
    // Negation and uncertainty must not turn a positive idea into a match.
    // Keep this conservative: arbitrary natural language is not reliably graded.
    if (negated(answer) || /\b(or|maybe|perhaps)\b/i.test(answer)) return false;
    return rule.all.length > 0 && rule.all.every(idea =>
      idea.some(phrase => contains(given, tokens(phrase))));
  }

  return references.some(reference => {
    if (negated(answer) !== negated(reference)) return false;
    if (/\b(or|maybe|perhaps)\b/i.test(answer) && !/\bor\b/i.test(reference)) return false;
    // No skipping arbitrary intervening science words: this prevents "small or
    // large intestine" or a reversed transfer with repeated nouns from passing.
    const required = tokens(reference);
    if (required.length <= 2 && /\b(and|but)\b/i.test(answer)) return false;
    return contains(given, required);
  });
}
