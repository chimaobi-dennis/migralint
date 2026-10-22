import type { LintResult } from "../types.js";

export function formatJson(result: LintResult): string {
  return JSON.stringify({ tool: "migralint", version: 1, ...result }, null, 2);
}
