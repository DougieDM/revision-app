# Revisionary

Write all student-facing content for 12–13-year-olds. Read
`docs/content-guidelines.md` before adding or editing revision notes, questions,
answers, hints, glossary entries or summaries. Keep school science terms, but
explain unfamiliar words simply. Challenge should come from the science and
reasoning, not complicated wording.

Preserve content IDs and browser progress keys when changing wording. Generated
questions must respect the chosen style, topic, area, difficulty and weak-area
filters. Small pools must not silently broaden these choices.

After changing question generation or revision content, run `npm test`,
`npm run lint`, `npm run build`, `node scripts/verify-organisms.cjs` and
`node scripts/verify-readiness.cjs`.
