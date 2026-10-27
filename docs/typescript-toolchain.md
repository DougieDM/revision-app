# TypeScript compiler and tooling

The project uses TypeScript 7.0.2 for `npm run typecheck` and as the first step
of every production build. The existing Next.js 16.4.3, ESLint 9 and Tailwind 3
versions are unchanged.

TypeScript 7.0 has no JavaScript compiler API. The current stable
typescript-eslint 8.72.x supports TypeScript `>=4.8.4 <6.1.0`, so a direct
replacement of `typescript` with 7.0.2 fails strict peer dependency installation.
Updating eslint-config-next alone cannot supply that missing API.

We use Microsoft's documented side-by-side installation:

- `@typescript/native` aliases `typescript@7.0.2`, supplying `tsc`.
- `typescript` aliases `@typescript/typescript6@6.0.2`, supplying the JavaScript
  API and `tsc6` for ESLint and Next.js integration.

These are separate supported compiler roles, not a claim that typescript-eslint
supports the TypeScript 7 API. Keep both exact versions locked. Do not use
`--force`, `--legacy-peer-deps`, peer overrides or skipped build type checks.
Next.js may run its own API/CLI check with TypeScript 6; the build script always
requires the native TypeScript 7 check to succeed first.

`baseUrl` was removed because TypeScript 7 no longer accepts it; the existing
relative `paths` mapping remains. Global Node and React types are listed
explicitly for TypeScript 7's new `types` default.

Validation on Node 22:

```sh
npm ci --ignore-scripts --strict-peer-deps --no-audit --no-fund
npm audit --omit=dev --audit-level=high
npm test
npm run lint
npm run typecheck
npm run build
```

Revisit the alias only when a stable typescript-eslint release supports the new
native API and the entire validation sequence passes. TypeScript 7.1 beta is
not a replacement for stable tooling support.

Sources (checked 27 October 2026):

- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://typescript-eslint.io/users/dependency-versions/
