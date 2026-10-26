# React 19 upgrade validation

Validated on 26 October 2026 against main commit `6e0df89`.

## Dependency alignment

- React and React DOM: `19.3.1`.
- React and React DOM TypeScript definitions: `19.3.0`.
- Next.js remains `16.4.3`; TypeScript remains `5.5.3`; ESLint remains `9.39.5`.
- Next.js 16.4.3's installed package metadata accepts `^19.0.0` for both runtime packages.
- Regenerated the npm lockfile normally, then verified a clean `npm ci --ignore-scripts --strict-peer-deps --no-audit --no-fund` and `npm ls react react-dom @types/react @types/react-dom`. No force or legacy-peer-deps flags were used. The resulting tree has one aligned copy of each React package.
- Dependabot now groups all four packages, and CI explicitly uses strict peer dependency checks.

The independent upgrades in PRs #6 and #10 fail because each leaves part of the React family on version 18. This combined change supersedes those proposals.

## Compatibility review

Reviewed the [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide). The app already uses the modern JSX transform and functional components. No removed ReactDOM rendering APIs, string refs, legacy context, React internals, zero-argument useRef calls or global JSX namespace annotations were found in application code. No component or science-content migrations were needed; browser storage keys and content IDs remain unchanged.

## Automated validation

All checks passed under Node `22.23.4`:

- Clean install with strict peer checks.
- `npm test`: 47 tests passed, including written-answer paraphrases, incomplete answers, reversed scientific relationships, negative statements and question-generation filters.
- `npm run lint`.
- `npx --no-install tsc --noEmit`.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- `node scripts/verify-organisms.cjs`: focus/style/difficulty combinations, weak-area scope, printable parity, marking and progress preservation passed.
- `node scripts/verify-readiness.cjs`: legacy history, distinct learning points, recent answers, rolling evidence window, test changes and reset passed.
- `npm run build`: all 11 pages generated successfully with Next.js 16.4.3.

## Production-browser smoke checks

A temporary Playwright 1.51.1 / Chromium 134 harness exercised the locally served production build (Node 22); no browser-test dependencies were added to the app.

- Loaded the home dashboard with a pre-existing progress fixture in the unchanged `revisionary-year-7-science-progress` key (20 answers, 15 correct, including Ecosystems history).
- Completed one-question Organisms / Gas exchange quizzes using multiple-choice, quick-recall and explain styles. Selected the correct multiple-choice answer, typed an authored correct recall answer and typed an incorrect explanation. Checked feedback and final scores of 1/1, 1/1 and 0/1.
- Loaded both respiratory and digestive diagram images, entered all six correct labels, checked 6/6 results and disabled inputs, then used Try again to clear inputs.
- Verified cumulative saved progress: 35 answers, 29 correct, original Ecosystems history retained. Reloading preserved these totals.
- No browser console errors, uncaught exceptions or hydration errors occurred during these checks.

These checks cover representative interactions, not every browser/device or every question. The broader written-answer and content tests provide additional marking coverage. Reverting the dependency/configuration change restores the React 18 dependency set; progress data requires no conversion.
