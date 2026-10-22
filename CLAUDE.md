# migralint — project context

Linter for Postgres / Supabase SQL migrations. TypeScript, Node 20+, ESM, no SQL parser dependency.

- `src/sql/split.ts` — file → statements (comments, strings, $$ bodies, ignore directives).
- `src/sql/classify.ts` — statement → discriminated union (`Classified`). Add new shapes here.
- `src/model.ts` — applies classified statements to a `SchemaModel`.
- `src/rules/index.ts` — rules; `statement` rules see the pre-statement model, `schema` rules the final one.
- `src/index.ts` — `lint()` / `lintMigrations()`; `src/cli/index.ts` — commander CLI.
- `examples/migrations/` — deliberately flawed sample used by README and CI.

Rules of the repo:
- Tests: `npm test`. Typecheck: `npm run typecheck`. Lint: `npm run lint`.
- Every new rule needs a test case and a README table row.
- Never add a database connection to the default path; the tool must work from SQL text alone.
