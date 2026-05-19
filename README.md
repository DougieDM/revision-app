# Nova Year 7 Science Revision

A mobile-first Next.js revision quiz app for Year 7 Science. Nova acts like a supportive tutor: questions are generated from a structured local knowledge base, feedback is gentle, and progress is saved in the browser.

## Topics

- Acids and Alkalis
- Ecosystems
- Skills in Science
- Revision technique / 5 Step Revision Plan
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

- `data/knowledge-base.json` contains 180 structured curriculum facts.
- `data/questions.seed.json` contains 120 ready-made seed questions.
- `lib/generateQuestion.ts` combines seed questions with dynamically generated questions from the knowledge base.

To add more content, add facts to the knowledge base using the same shape and, optionally, add seed questions with clear Year 7 wording.
