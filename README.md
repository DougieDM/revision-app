# Readispark

A mobile-first Next.js revision and test preparation app for Year 7 and Year 8 science. Readispark acts like a supportive tutor: questions are generated from a structured local knowledge base, feedback is gentle, and progress is saved in the browser.

The app uses a black dark-mode background, charcoal cards, pink primary actions and purple secondary actions. Light text and visible focus outlines support readability. Printable tests and answer sheets remain black on white. The dashboard home page uses `public/readispark-logo-approved.png`, with a pink-purple icon, white lettering, responsive sizing, accessible alternative text and Next.js image optimisation. The original logo is retained.

## Current test: Year 8 Organisms 8.3–8.4

The home screen is the readiness dashboard. `/make-a-test` uses the first topic in your upcoming test (Organisms by default), with a selector for its ten areas. All previous topics remain available. `/organisms` provides 65 learning points, the 27 school objectives with device-local confidence ratings, 50 glossary terms, the eight school BBC Bitesize links and both supplied YouTube links. The video titles/transcripts could not be retrieved; videos are linked as school video 1 and 2 and are not used as question sources.

`data/organisms.questions.json` contains 260 authored question variants (65 learning points × multiple choice, recall, explanation and correcting a misconception). Multiple choice uses plausible topic-specific alternatives. Written Organisms answers are assessed by the learner against a model answer, avoiding unreliable keyword grading. Each question style offers easy and more challenging questions. Whole-unit quizzes and printable tests sample every section before additional questions; Each quiz asks about a learning point once; narrow filters can produce fewer questions than requested when their pool is smaller. Printable tests and answer sheets retain the selected topic and area and use the same deterministic question order.

Sources: `Year_8_Organisms_Knowledge_Organiser.pdf` and `Organisms_Checklist__Glossary__Bitesize_Links_so.docx`. The checklist's exclusion of active site, substrate and lock-and-key terminology takes precedence over the organiser's mention. Glossary typos in respiration and deficiency were corrected. Food-test procedures, bell-jar limitations, nutrient deficiencies and effects of alcohol/smoking are KS3 explanations of the listed objectives.

Existing quiz progress keys are retained. The new checklist has a separate key, `revisionary-organisms-checklist-v1`.

## Topics

- Acids and Alkalis
- Ecosystems
- Skills in Science
- Waves
- Organisms

## Features

- Random quizzes from a rich local JSON knowledge base
- 5, 10, 15 or 20 question quizzes
- Easy, mixed and challenge difficulty
- Mixed, quick recall, multiple choice, explain and spot-the-mistake modes
- Hint and "I don't know" support
- Immediate feedback with simple explanations
- Weak-area tracking by topic and subtopic
- Local progress saved with `localStorage`
- Printable 20-question test and separate answer sheet
- No login and no database in version 1

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

The build script uses Next's webpack compiler for compatibility with local and Railway builds.

Start the production server:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

Run question-generation regression tests:

```bash
npm test
```

Generated questions use only fact types supported by the selected question style.
Mixed quizzes balance the available types, while whole-unit Organisms quizzes
continue to cover every section first. Small pools produce shorter quizzes with
a notice; empty pools show no matching questions. Weak-area practice keeps its
weak-area filter rather than silently falling back to general practice.

## Railway Deployment

1. Push this project to a GitHub repository.
2. In Railway, create a new project from the GitHub repo.
3. Railway should detect the Next.js app automatically.
4. Use these commands if Railway asks:
   - Build command: `npm run build`
   - Start command: `npm run start`
5. No database or environment variables are required for version 1.

## Data

All revision content and questions target students aged 12–13. See
`docs/content-guidelines.md` for the writing rules. Facts include direct recall,
explanation and application prompts; feedback explains the science rather than
describing the source document. Missing-word questions accept the missing word.

- `data/knowledge-base.json` contains 180 structured source-backed facts.
- `data/questions.seed.json` contains 120 ready-made source-backed seed questions.
- `lib/generateQuestion.ts` combines seed questions with dynamically generated questions from the knowledge base.

The current content is restricted to the supplied school science test source files:

- `6.1_Knowledge_Organiser.pdf`
- `Skills_in_Science_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `Y7_Acids_and_Alkalis_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `Y7_Ecosystems_Checklist__Glossary__BBC_Bitesize_Links-2.docx`
- `Y7_Ecosystems_Knowledge_Organiser.pdf`
- `Y7_Waves_Knowledge_Organiser.pdf`
- `Y7_Waves_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `7F_Mindmap_for_Acids_and_Alkalis.jpg.png`

To add more content, add facts to the knowledge base using the same shape and, optionally, add seed questions with clear Year 7 wording.

## Readiness dashboard and device-local progress

`/` shows readiness for every available topic, area breakdowns, suggested practice and the overall readiness of the upcoming test. Learners can edit the test title and select its included topics; these settings use `readispark-upcoming-test-v1`. New curriculum content still needs to be added when a new school test covers material outside the available topics.

Readiness uses the most recent answer to up to 10 distinct learning points per area. Organisms question styles share their learning-point ID. Area score = correct / max(number tracked, min(5, number of available points)) × 100. Topic score averages every area, including zero for unpractised areas. Overall test score averages the selected topics equally. Labels are Not started, Getting started (under 50%), Building confidence (50–79%), and Looking strong (80%+). These are product guidance thresholds, not calibrated predictions of a test mark. Written questions include self-assessment. Readiness evidence begins with practice completed after this update; historical totals remain available but cannot be converted into missing area evidence.

Existing localStorage progress and checklist keys are deliberately retained to preserve previous users’ data. No results are sent to a server. Different devices/browser profiles have independent results; people sharing a browser profile share its statistics. Clearing site data removes saved progress, and changing devices does not transfer it. Storage failures show a message after practice. Resetting practice progress clears history and readiness after confirmation, while retaining upcoming-test settings and checklist confidence ratings.

Verification: `npm run build`, `npm run lint`, `node scripts/verify-organisms.cjs`, and `node scripts/verify-readiness.cjs`.

The homepage uses the Readispark logo and wordmark. Earlier logo variants are retained as reference assets.

## Navigation

The readiness dashboard is the home page at `/`. The former `/progress` route redirects to `/` for compatibility. Custom topic, area, question count, difficulty and question-style settings are at `/make-a-test`, with links to start a test, practise weak areas and print a test. Home and summary links return to the dashboard; the no-matching-questions link returns to the test builder.
