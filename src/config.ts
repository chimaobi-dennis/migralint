import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import type { MigralintConfig, Severity } from "./types.js";

export const CONFIG_FILENAME = ".migralint.yml";

export const defaultConfig: MigralintConfig = {
  disabledRules: [],
  severity: {},
  publicTables: [],
  schemas: ["public"],
};

export function loadConfig(dir: string, overridePath?: string): MigralintConfig {
  const file = overridePath ?? findUp(dir);
  if (!file || !existsSync(file)) return { ...defaultConfig };
  const raw = (parse(readFileSync(file, "utf8")) ?? {}) as Record<string, unknown>;
  const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  const sev: Record<string, Severity> = {};
  if (raw.severity && typeof raw.severity === "object") {
    for (const [k, v] of Object.entries(raw.severity as Record<string, unknown>)) sev[k.toUpperCase()] = String(v) as Severity;
  }
  return {
    disabledRules: list(raw.disabledRules).map((r) => r.toUpperCase()),
    severity: sev,
    publicTables: list(raw.publicTables),
    schemas: list(raw.schemas).length ? list(raw.schemas).map((s) => s.toLowerCase()) : defaultConfig.schemas,
  };
}

/** Walk up from `dir` looking for the config file (so `migralint supabase/migrations` finds the repo-root config). */
function findUp(dir: string): string | undefined {
  let cur = dir;
  for (let i = 0; i < 8; i++) {
    const candidate = join(cur, CONFIG_FILENAME);
    if (existsSync(candidate)) return candidate;
    const parent = join(cur, "..");
    if (parent === cur) break;
    cur = parent;
  }
  return undefined;
}
