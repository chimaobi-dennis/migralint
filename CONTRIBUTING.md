# Contributing

```bash
npm install
npm test
npm run typecheck && npm run lint
```

## Adding a rule

1. Add an entry to `src/rules/index.ts`. Use the next free id in its category
   (`D` destructive, `S` security, `P` performance, `H` hygiene). Implement
   `statement` for per-statement checks or `schema` for checks on the final model.
2. Add a positive case to the `it.each` table in `test/rules.test.ts` and, if the
   rule could misfire, a negative case.
3. Add the rule to the table in `README.md`.
4. Run `npm run lint:self`; new rules must behave sensibly on the examples.

## Commit style

`type: short description` with `feat`, `fix`, `docs`, `test`, `chore` or `ci`.
