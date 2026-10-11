// Run with node scripts/verify-organisms.cjs. Exercise the actual TypeScript functions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText, filename);
const { generateQuiz } = require('../lib/generateQuestion.ts');
const { buildPrintableTest, filterSeeds, markAnswer, seeds } = require('../lib/quiz.ts');
const content = require('../data/organisms.json');
const questions = require('../data/organisms.questions.json');
assert.equal(content.checklist.length, 27);
assert.equal(content.sections.length, 10);
assert.equal(questions.length, 260);
assert.equal(new Set(seeds.map(q => q.id)).size, seeds.length);
for (const q of questions) {
  assert(content.sections.includes(q.subtopic));
  assert(!/active site|substrate|lock.and.key/i.test(q.question));
  if (q.type === 'multiple-choice') {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert(q.options.includes(q.answer));
    assert(markAnswer(q, q.answer));
    assert(!markAnswer(q, q.options.find(o => o !== q.answer)));
  }
}
for (const subtopic of ['', ...content.sections]) {
  for (const style of ['mixed', 'quick-recall', 'multiple-choice', 'explain', 'spot-the-mistake']) {
    for (const difficulty of ['easy', 'mixed', 'challenge']) {
      const settings = {topic: content.title, subtopic, count: 20, difficulty, style};
      const quiz = generateQuiz(settings);
      assert(quiz.length > 0, JSON.stringify(settings));
      assert.equal(new Set(quiz.map(q => q.sourceId.replace(/_(multiple-choice|recall|spot-the-mistake|explain)$/, ""))).size, quiz.length);
      const allowed = new Set(filterSeeds(settings).map(q => q.id));
      assert(quiz.every(q => allowed.has(q.sourceId)));
      assert(quiz.every(q => q.topic === content.title && (!subtopic || q.subtopic === subtopic)));
    }
  }
  const printable = buildPrintableTest(content.title, subtopic);
  assert(printable.every(q => q.topic === content.title && (!subtopic || q.subtopic === subtopic)));
  assert.deepEqual(printable, buildPrintableTest(content.title, subtopic));
}
const settings = {topic: content.title, count: 20, style: 'mixed', difficulty: 'mixed'};
assert.equal(new Set(generateQuiz(settings).slice(0,10).map(q => q.subtopic)).size, 10);
const weak = generateQuiz({...settings, weakOnly:true}, ['Food tests', 'Indicators and pH']);
assert(weak.every(q => q.subtopic === 'Food tests'));
assert(generateQuiz({...settings, subtopic:'Breathing', weakOnly:true}, ['Indicators and pH']).every(q => q.subtopic === 'Breathing'));
const print = buildPrintableTest(content.title);
assert.equal(print.length, 20);
assert.equal(new Set(print.map(q => q.subtopic)).size, 10);
assert(generateQuiz({...settings,topic:'Ecosystems'}).every(q => q.topic === 'Ecosystems'));
// Existing progress survives, and Organisms answers extend it rather than resetting it.
const saved = new Map([['revisionary-year-7-science-progress', JSON.stringify({questionsAnswered:3,correctAnswers:2,weakSubtopics:{'Indicators and pH':2},topicStats:{Ecosystems:{answered:3,correct:2}},recentScores:[]})]]);
global.window = {localStorage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)}};
const { recordQuizResult } = require('../lib/progress.ts');
const progress = recordQuizResult({score:0,total:1,answers:[{questionId:'test',topic:content.title,subtopic:'Food tests',correct:false,userAnswer:'not sure'}]});
assert.equal(progress.questionsAnswered,4);
assert.equal(progress.topicStats.Ecosystems.answered,3);
assert.equal(progress.topicStats[content.title].answered,1);
assert.equal(progress.weakSubtopics['Food tests'],2);
console.log('Organisms verification passed: all focus/style/difficulty combinations, weak-area scoping, printable parity, marking and progress preservation.');
