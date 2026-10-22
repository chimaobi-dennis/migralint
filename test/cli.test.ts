import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lint, formatSarif, formatJson, formatPretty } from "../src/index.js";

const CLI = join(process.cwd(), "src/cli/index.ts");
const runCli = (args: string[], cwd: string) => {
  try {
    return { code: 0, out: execFileSync("npx", ["tsx", CLI, ...args], { cwd, encoding: "utf8" }) };
  } catch (e) {
    const err = e as { status: number; stdout: string };
    return { code: err.status, out: err.stdout };
  }
};

describe("lint() and reporters", () => {
  const dir = mkdtempSync(join(tmpdir(), "migralint-"));
  mkdirSync(join(dir, "supabase/migrations"), { recursive: true });
  writeFileSync(join(dir, "supabase/migrations/20250101000000_init.sql"), "create table public.a (id uuid primary key, b_id uuid references public.b(id));\n");
  writeFileSync(join(dir, "supabase/migrations/20250102000000_rls.sql"), "alter table public.a enable row level security;\ncreate policy p on public.a for select using (true);\n");

  it("lints a directory in filename order and reports across files", () => {
    const r = lint([join(dir, "supabase/migrations")]);
    expect(r.files).toHaveLength(2);
    expect(r.findings.map((f) => f.ruleId).sort()).toEqual(["P001", "S004"]);
  });

  it("renders json, sarif and pretty", () => {
    const r = lint([join(dir, "supabase/migrations")]);
    expect(JSON.parse(formatJson(r)).findings).toHaveLength(2);
    const sarif = JSON.parse(formatSarif(r));
    expect(sarif.version).toBe("2.1.0");
    expect(sarif.runs[0].results).toHaveLength(2);
    expect(sarif.runs[0].tool.driver.rules.length).toBeGreaterThan(20);
    expect(formatPretty(r)).toContain("S004");
  });

  it("CLI exits 1 on findings at --fail-on and 0 with --fail-on none, and reads .migralint.yml", () => {
    expect(runCli(["lint"], dir).code).toBe(1);
    expect(runCli(["lint", "--fail-on", "none", "-q"], dir).code).toBe(0);
    writeFileSync(join(dir, ".migralint.yml"), "publicTables:\n  - a\ndisabledRules:\n  - P001\n");
    const r = runCli(["lint", "--format", "json", "--fail-on", "low"], dir);
    expect(r.code).toBe(0);
    expect(JSON.parse(r.out).findings).toEqual([]);
    rmSync(join(dir, ".migralint.yml"));
  });

  it("CLI lists rules", () => {
    const r = runCli(["rules", "--format", "json"], dir);
    expect(JSON.parse(r.out).some((x: { id: string }) => x.id === "S001")).toBe(true);
  });
});
