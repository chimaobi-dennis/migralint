# migralint Roadmap

Status key: ✅ done · 🔨 in progress · ⏳ planned

## Phase 1 — Core linter (v0.1) ✅ 2026-10-22

- ✅ Statement splitter that understands comments, strings and dollar-quoted bodies
- ✅ Classifier for tables, columns, references, alter variants, policies, indexes, functions, grants, DML
- ✅ Schema model built across migrations in order
- ✅ 25 rules across destructive, security, performance and hygiene categories
- ✅ `.migralint.yml` with schemas, public tables, disabled rules and severity overrides
- ✅ Inline `migralint:ignore` and `ignore-file` directives
- ✅ `--changed-since <ref>` for focused pull request checks
- ✅ Pretty, JSON and SARIF reporters
- ✅ 44 tests, CI with SARIF upload

## Phase 2 — Fewer false positives, more context (v0.2) ⏳ target: 2 weeks

- ⏳ Import an existing schema (`supabase db dump --schema-only` or `pg_dump`) as a
  baseline so tables created outside migrations are known (removes most H005 noise)
- ⏳ Understand `CREATE VIEW`, `CREATE TRIGGER` and `ALTER POLICY`
- ⏳ Rule: policy references a column that does not exist on the table
- ⏳ Rule: `ON DELETE CASCADE` chain longer than N tables
- ⏳ Rule: `CREATE INDEX` on a large table without `CONCURRENTLY` (opt-in, since
  Supabase migrations run inside a transaction)
- ⏳ Publish to npm with provenance

## Phase 3 — Workflow integration (v0.3) ⏳ target: 4 weeks

- ⏳ GitHub Action with inline pull request annotations
- ⏳ `pre-commit` hook and Husky recipe
- ⏳ `migralint explain <rule>` with worked before/after examples
- ⏳ Auto-fix suggestions as a unified diff for H003, P001 and P002
- ⏳ Custom rules in `.migralint.yml` (regex on statement text with a message and severity)

## Phase 4 — Prisma, Drizzle and plain Postgres (v0.4) ⏳ target: 8 weeks

- ⏳ Prisma `migration.sql` folders and Drizzle `drizzle/*.sql` discovery
- ⏳ Optional live mode: connect to a database and compare the migration model
  against `pg_catalog` to find drift
- ⏳ Row-count hints from the live database to grade destructive findings by impact

## Non-goals

- Replacing `supabase db lint` or a full SQL parser. migralint stays dependency-light
  and text-based so it runs anywhere in milliseconds.
- Applying migrations. It reads SQL; it never connects unless asked to in live mode.

## Housekeeping

- [ ] Rename the repository to `migralint` and update `package.json`
- [ ] Record a short terminal demo for the README
