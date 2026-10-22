import pc from "picocolors";
import type { Finding, LintResult, Severity } from "../types.js";

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];
const COLOR: Record<Severity, (s: string) => string> = {
  critical: (s) => pc.bold(pc.red(s)),
  high: pc.red,
  medium: pc.yellow,
  low: pc.cyan,
};

export function countBySeverity(findings: Finding[]): Record<Severity, number> {
  const c: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) c[f.severity]++;
  return c;
}

export function formatPretty(result: LintResult): string {
  const lines: string[] = [];
  let lastFile = "";
  for (const f of result.findings) {
    if (f.file !== lastFile) {
      if (lastFile) lines.push("");
      lines.push(pc.underline(f.file));
      lastFile = f.file;
    }
    lines.push(`  ${pc.dim(String(f.line).padStart(4))}  ${COLOR[f.severity](f.severity.padEnd(8))} ${pc.bold(f.ruleId)} ${pc.dim(f.ruleName)}  ${f.message}`);
    lines.push(`        ${pc.dim(f.excerpt)}`);
    if (f.help) lines.push(`        ${pc.green("↳")} ${pc.dim(f.help)}`);
  }
  const counts = countBySeverity(result.findings);
  const summary = SEVERITY_ORDER.filter((s) => counts[s]).map((s) => COLOR[s](`${counts[s]} ${s}`)).join(", ");
  lines.push("");
  lines.push(pc.dim(`Linted ${result.files.length} migration(s), ${result.statements} statement(s) in ${result.durationMs} ms.`));
  lines.push(result.findings.length === 0 ? pc.green("✔ No problems found.") : `${pc.red("✖")} ${result.findings.length} problem(s): ${summary}`);
  return lines.join("\n");
}
