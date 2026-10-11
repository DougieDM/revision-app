# Revisionary

A mobile-first Next.js revision quiz app for Year 7 and Year 8 science. Revisionary acts like a supportive tutor: questions are generated from a structured local knowledge base, feedback is gentle, and progress is saved in the browser.

## Current test: Year 8 Organisms 8.3–8.4

The home screen defaults to Organisms, with a selector for its ten areas. All previous topics remain available. `/organisms` provides 65 learning points, the 27 school objectives with device-local confidence ratings, 50 glossary terms, the eight school BBC Bitesize links and both supplied YouTube links. The video titles/transcripts could not be retrieved; videos are linked as school video 1 and 2 and are not used as question sources.

`data/organisms.questions.json` contains 260 authored question variants (65 learning points × multiple choice, recall, explanation and correcting a misconception). Multiple choice uses plausible topic-specific alternatives. Written Organisms answers are assessed by the learner against a model answer, avoiding unreliable keyword grading. Each question style offers easy and more challenging questions. Whole-unit quizzes and printable tests sample every section before additional questions; Each quiz asks about a learning point once; narrow filters can produce fewer questions than requested when their pool is smaller. Printable tests and answer sheets retain the selected topic and area and use the same deterministic question order.

Sources: `Year_8_Organisms_Knowledge_Organiser.pdf` and `Organisms_Checklist__Glossary__Bitesize_Links_so.docx`. The checklist's exclusion of active site, substrate and lock-and-key terminology takes precedence over the organiser's mention. Glossary typos in respiration and deficiency were corrected. Food-test procedures, bell-jar limitations, nutrient deficiencies and effects of alcohol/smoking are KS3 explanations of the listed objectives.

Existing quiz progress keys are retained. The new checklist has a separate key, `revisionary-organisms-checklist-v1`.

## Topics

- Acids and Alkalis
- Ecosystems
- Skills in Science
- Waves
- Year 8 Organisms
- Forces is shown as a locked future topic only

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

## Railway Deployment

1. Push this project to a GitHub repository.
2. In Railway, create a new project from the GitHub repo.
3. Railway should detect the Next.js app automatically.
4. Use these commands if Railway asks:
   - Build command: `npm run build`
   - Start command: `npm run start`
5. No database or environment variables are required for version 1.

## Data

- `data/knowledge-base.json` contains 180 structured source-backed facts.
- `data/questions.seed.json` contains 120 ready-made source-backed seed questions.
- `lib/generateQuestion.ts` combines seed questions with dynamically generated questions from the knowledge base.

The current content is restricted to the supplied Isla science test source files:

- `6.1_Knowledge_Organiser.pdf`
- `Skills_in_Science_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `Y7_Acids_and_Alkalis_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `Y7_Ecosystems_Checklist__Glossary__BBC_Bitesize_Links-2.docx`
- `Y7_Ecosystems_Knowledge_Organiser.pdf`
- `Y7_Waves_Knowledge_Organiser.pdf`
- `Y7_Waves_Checklist__Glossary__BBC_Bitesize_Links.docx`
- `7F_Mindmap_for_Acids_and_Alkalis.jpg.png`

To add more content, add facts to the knowledge base using the same shape and, optionally, add seed questions with clear Year 7 wording.
