# Changelog

## 0.1.0 — 2026-10-22

First release of migralint.

- Statement splitter and classifier for Postgres migration SQL
- Schema model across migrations
- 25 rules: destructive (D), security (S), performance (P), hygiene (H)
- `.migralint.yml` configuration and inline ignore directives
- `--changed-since` for pull request checks
- Pretty, JSON and SARIF output
