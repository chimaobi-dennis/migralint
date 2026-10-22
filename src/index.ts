import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { splitStatements } from "./sql/split.js";
import { applyStatement, emptyModel } from "./model.js";
import { classify } from "./sql/classify.js";
import { rules as allRules, type Rule } from "./rules/index.js";
import { loadConfig } from "./config.js";
import type { Finding, LintResult, Migration, MigralintConfig } from "./types.js";

export * from "./types.js";
export { rules, ruleById } from "./rules/index.js";
export { splitStatements } from "./sql/split.js";
export { classify } from "./sql/classify.js";
export { buildModel, applyStatement } from "./model.js";
export { loadConfig, defaultConfig, CONFIG_FILENAME } from "./config.js";
export { formatPretty, SEVERITY_ORDER, countBySeverity } from "./reporters/pretty.js";
export { formatJson } from "./reporters/json.js";
export { formatSarif } from "./reporters/sarif.js";

export interface LintOptions {
  config?: MigralintConfig;
  configPath?: string;
  /** Only report findings located in these files (others still feed the schema model). */
  onlyFiles?: string[];
  rules?: Rule[];
}

/** Resolve a list of files/directories into ordered .sql migration paths. */
export function collectMigrationFiles(paths: string[]): string[] {
  const files = new Set<string>();
  for (const p of paths) {
    const abs = resolve(p);
    const st = statSync(abs);
    if (st.isDirectory()) {
      for (const entry of readdirSync(abs)) if (entry.toLowerCase().endsWith(".sql")) files.add(join(abs, entry));
    } else if (abs.toLowerCase().endsWith(".sql")) files.add(abs);
  }
  return [...files].sort((a, b) => (a.split("/").pop()! < b.split("/").pop()! ? -1 : 1));
}

export function parseMigrations(files: string[], root = process.cwd()): Migration[] {
  return files.map((f) => splitStatements(readFileSync(f, "utf8"), relative(root, f).replace(/\\/g, "/") || f));
}

/** Lint already-parsed migrations. */
export function lintMigrations(migrations: Migration[], opts: LintOptions = {}): Finding[] {
  const config = opts.config ?? defaultConfigFor(opts);
  const rules = (opts.rules ?? allRules).filter((r) => !config.disabledRules.includes(r.id));
  const findings: Finding[] = [];
  const only = opts.onlyFiles ? new Set(opts.onlyFiles.map((f) => f.replace(/\\/g, "/"))) : null;
  const push = (rule: Rule, f: ReturnType<NonNullable<Rule["statement"]>>[number], ignored: Set<string>, ignoreFile: boolean) => {
    if (ignoreFile || ignored.has(rule.id)) return;
    if (only && !only.has(f.file)) return;
    findings.push({
      ruleId: rule.id,
      ruleName: rule.name,
      category: rule.category,
      severity: config.severity[rule.id] ?? f.severity ?? rule.severity,
      message: f.message,
      file: f.file,
      line: f.line,
      excerpt: f.excerpt,
      help: rule.help,
    });
  };

  const model = emptyModel();
  const fileIgnores = new Map(migrations.map((m) => [m.file, m.ignoreFile]));
  for (const migration of migrations) {
    for (const stmt of migration.statements) {
      // Rules see the model as it was before the statement, then the statement is applied.
      const classified = classify(stmt);
      for (const rule of rules) {
        if (!rule.statement) continue;
        for (const f of rule.statement({ stmt, classified, model, migration, config })) push(rule, f, stmt.ignored, migration.ignoreFile);
      }
      applyStatement(model, stmt);
    }
  }
  for (const rule of rules) {
    if (!rule.schema) continue;
    for (const f of rule.schema({ model, migrations, config })) {
      const stmtIgnores = findIgnores(migrations, f.file, f.line);
      push(rule, f, stmtIgnores, fileIgnores.get(f.file) ?? false);
    }
  }
  return findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.ruleId.localeCompare(b.ruleId));
}

function defaultConfigFor(opts: LintOptions): MigralintConfig {
  return loadConfig(process.cwd(), opts.configPath);
}

function findIgnores(migrations: Migration[], file: string, line: number): Set<string> {
  const m = migrations.find((x) => x.file === file);
  return m?.statements.find((s) => s.line === line)?.ignored ?? new Set();
}

/** Lint files and directories. */
export function lint(paths: string[], opts: LintOptions = {}): LintResult {
  const started = Date.now();
  const files = collectMigrationFiles(paths);
  const migrations = parseMigrations(files);
  const config = opts.config ?? loadConfig(files[0] ? resolve(files[0], "..") : process.cwd(), opts.configPath);
  const findings = lintMigrations(migrations, { ...opts, config });
  return {
    startedAt: new Date(started).toISOString(),
    durationMs: Date.now() - started,
    files: migrations.map((m) => m.file),
    statements: migrations.reduce((n, m) => n + m.statements.length, 0),
    findings,
  };
}
