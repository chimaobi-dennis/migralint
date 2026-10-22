#!/usr/bin/env node
import { Command } from "commander";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import pc from "picocolors";
import { lint, rules, SEVERITY_ORDER, formatPretty, formatJson, formatSarif, CONFIG_FILENAME } from "../index.js";
import type { LintResult, Severity } from "../types.js";

const VERSION = "0.1.0";
const program = new Command();
program.name("migralint").description("Lint Postgres / Supabase SQL migrations for destructive, insecure and slow changes.").version(VERSION);

function defaultPaths(): string[] {
  for (const candidate of ["supabase/migrations", "migrations", "db/migrations", "prisma/migrations"]) if (existsSync(candidate)) return [candidate];
  return ["."];
}

function render(result: LintResult, format: string): string {
  if (format === "json") return formatJson(result);
  if (format === "sarif") return formatSarif(result, VERSION);
  return formatPretty(result);
}

function exceeds(result: LintResult, failOn: Severity | "none"): boolean {
  if (failOn === "none") return false;
  const t = SEVERITY_ORDER.indexOf(failOn);
  return result.findings.some((f) => SEVERITY_ORDER.indexOf(f.severity) <= t);
}

program
  .command("lint", { isDefault: true })
  .argument("[paths...]", "migration files or directories (default: supabase/migrations if present)")
  .option("-f, --format <format>", "pretty | json | sarif", "pretty")
  .option("-o, --output <file>", "write the report to a file")
  .option("--fail-on <severity>", "exit 1 at this severity or above (critical|high|medium|low|none)", "medium")
  .option("--changed-since <ref>", "only report findings in files added/changed since this git ref; all files still build the schema model")
  .option("-c, --config <file>", `path to ${CONFIG_FILENAME}`)
  .option("-q, --quiet", "print nothing when there are no findings", false)
  .action((paths: string[], o) => {
    const targets = paths.length ? paths : defaultPaths();
    let onlyFiles: string[] | undefined;
    if (o.changedSince) {
      const out = execFileSync("git", ["diff", "--name-only", "--diff-filter=AM", o.changedSince, "--", ...targets], { encoding: "utf8" });
      onlyFiles = out.split("\n").filter((l) => l.trim().endsWith(".sql")).map((l) => relative(process.cwd(), resolve(l)).replace(/\\/g, "/"));
    }
    const result = lint(targets, { configPath: o.config, onlyFiles });
    const out = render(result, o.format);
    if (o.output) {
      mkdirSync(resolve(o.output, ".."), { recursive: true });
      writeFileSync(o.output, out);
      console.error(pc.dim(`Report written to ${o.output}`));
      console.error(formatPretty(result).split("\n").slice(-2).join("\n"));
    } else if (!(o.quiet && result.findings.length === 0)) {
      console.log(out);
    }
    process.exitCode = exceeds(result, o.failOn) ? 1 : 0;
  });

program
  .command("rules")
  .description("list the rules")
  .option("-f, --format <format>", "table | json", "table")
  .action((o) => {
    if (o.format === "json") {
      console.log(JSON.stringify(rules.map(({ id, name, category, severity, description, help }) => ({ id, name, category, severity, description, help })), null, 2));
      return;
    }
    for (const r of rules) console.log(`${r.id}  ${r.severity.padEnd(8)} ${r.category.padEnd(11)} ${r.name.padEnd(32)} ${r.description}`);
    console.log(pc.dim(`\n${rules.length} rules`));
  });

program.parseAsync(process.argv);
