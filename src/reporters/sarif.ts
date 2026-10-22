import { rules } from "../rules/index.js";
import type { LintResult, Severity } from "../types.js";

const LEVEL: Record<Severity, "error" | "warning" | "note"> = { critical: "error", high: "error", medium: "warning", low: "note" };

export function formatSarif(result: LintResult, version = "0.1.0"): string {
  const index = new Map(rules.map((r, i) => [r.id, i]));
  return JSON.stringify(
    {
      $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json",
      version: "2.1.0",
      runs: [
        {
          tool: {
            driver: {
              name: "migralint",
              version,
              informationUri: "https://github.com/chimaobi-dennis/migralint",
              rules: rules.map((r) => ({
                id: r.id,
                name: r.name,
                shortDescription: { text: r.name },
                fullDescription: { text: r.description },
                help: r.help ? { text: r.help } : undefined,
                defaultConfiguration: { level: LEVEL[r.severity] },
                properties: { category: r.category, severity: r.severity },
              })),
            },
          },
          results: result.findings.map((f) => ({
            ruleId: f.ruleId,
            ruleIndex: index.get(f.ruleId),
            level: LEVEL[f.severity],
            message: { text: f.message },
            locations: [{ physicalLocation: { artifactLocation: { uri: f.file, uriBaseId: "%SRCROOT%" }, region: { startLine: f.line } } }],
            properties: { category: f.category, severity: f.severity },
          })),
        },
      ],
    },
    null,
    2,
  );
}
