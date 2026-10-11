const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) { return resolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args); };
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText, filename);
const store = new Map();
global.window = {localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)}};
const { emptyProgress, loadProgress, recordQuizResult, clearProgress } = require('../lib/progress.ts');
const { getTopicReadiness, getTestReadiness, defaultTest, loadUpcomingTest, saveUpcomingTest } = require('../lib/readiness.ts');
const organisms = require('../data/organisms.json');
assert.equal(getTestReadiness(emptyProgress, defaultTest).score, 0);
assert.equal(getTopicReadiness(emptyProgress, 'Year 8 Organisms').level, 'Not started');
store.set('nova-year-7-science-progress', JSON.stringify({questionsAnswered:20,correctAnswers:15,topicStats:{Ecosystems:{answered:20,correct:15}},weakSubtopics:{},recentScores:[]}));
assert.equal(loadProgress().questionsAnswered,20);
assert.equal(getTestReadiness(loadProgress(),defaultTest).score,0); // Historical totals cannot imply area coverage.
const result = (sourceId, area, correct) => ({score:Number(correct),total:1,answers:[{questionId:sourceId+'-0',sourceId,topic:organisms.title,subtopic:area,correct,userAnswer:''}]});
for(let i=0;i<20;i++) recordQuizResult(result('organisms_001_recall','Gas exchange',true));
let progress=loadProgress();
assert.equal(progress.readinessEvidence[organisms.title]['Gas exchange'].length,1);
assert.equal(getTopicReadiness(progress,organisms.title).areas[0].score,20);
recordQuizResult(result('organisms_001_multiple-choice','Gas exchange',false));
assert.equal(getTopicReadiness(loadProgress(),organisms.title).score,0); // Other styles share the learning point; latest miss replaces success.
for(const area of organisms.sections) {
  for(const note of organisms.notes.filter(n=>n.subtopic===area).slice(0,5)) recordQuizResult(result(note.id+'_recall',area,true));
}
progress=loadProgress();
assert.equal(getTestReadiness(progress,defaultTest).score,100);
assert.equal(progress.topicStats.Ecosystems.answered,20);
assert.equal(getTestReadiness(progress,{title:'Next test',topics:[organisms.title,'Ecosystems']}).score,50);
for(let i=0;i<12;i++) recordQuizResult(result('new_'+i,'Gas exchange',i%2===0));
assert.equal(loadProgress().readinessEvidence[organisms.title]['Gas exchange'].length,10);
assert.equal(getTopicReadiness(loadProgress(),organisms.title).areas[0].score,50);
assert(saveUpcomingTest({title:'Next test',topics:['Waves']}));
assert.deepEqual(loadUpcomingTest(),{title:'Next test',topics:['Waves']});
store.set('readispark-upcoming-test-v1',JSON.stringify({title:'Bad',topics:['Unknown']}));
assert.deepEqual(loadUpcomingTest(),defaultTest);
store.set('readispark-upcoming-test-v1','bad json');assert.deepEqual(loadUpcomingTest(),defaultTest);
clearProgress();assert.equal(loadProgress().questionsAnswered,0);
console.log('Readiness verification passed: legacy preservation, coverage, distinct learning points, latest answers, rolling window, test changes and reset.');
