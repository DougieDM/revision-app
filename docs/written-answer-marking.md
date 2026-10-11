# Written-answer marking

Marking runs locally in the browser. No answers are sent to an AI service.
Multiple choice still requires the selected answer, and missing-word questions
still use their generated missing word. Question IDs, styles, filters and saved
progress keys have not changed.

All 65 Organisms learning points have reviewed, concise answer alternatives.
A model explanation may include extra teaching detail: students do not have to
repeat it all when a shorter answer completely answers the question. Food-test
colour questions accept an appropriate positive result. A question asking for
one role accepts either appropriate role.

Selected questions also have `marking` criteria:

- Every group in `all` is a required idea. Any phrase within that group expresses
  the idea. Independent groups can appear in either order.
- Phrase matching retains direction, quantity, sequence and science words.
  It allows whole-word spelling variants and specific equivalent verb forms.
- A `reject` phrase vetoes an approximate match containing a known misconception,
  even if other required ideas are present.
- Exact complete authored answers are accepted first, including legitimate
  negative statements, such as enzymes not being used up. Other negated or
  uncertain answers are conservatively rejected by the idea matcher.
- Questions without criteria use complete phrase alternatives. Arbitrary words
  cannot be skipped between the science words to manufacture a match.

For example, the gas exchange answer requires both oxygen entering the blood and
carbon dioxide leaving it. Describing diffusion in either sentence order is
accepted. Naming the gases alone, describing just one transfer, reversing either
transfer or denying it is rejected.

This is a deterministic matcher, not a general natural-language understanding
system. Unsupported paraphrases, especially ones mixing positive and negative
clauses, may still be missed. Add reviewed equivalent phrases and regression
examples rather than loosening the score to accept a percentage of keywords.
Students see an example answer and a short explanation to help them compare.

Validation: `npm test`, `npm run lint`, `npm run build`,
`node scripts/verify-organisms.cjs`, and `node scripts/verify-readiness.cjs`.
