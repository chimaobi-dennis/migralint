import { describe, it, expect } from "vitest";
import { lintMigrations, splitStatements, defaultConfig, rules } from "../src/index.js";

const run = (sql: string, config = defaultConfig, file = "20250101000000_t.sql") => lintMigrations([splitStatements(sql, file)], { config });
const ids = (sql: string, config = defaultConfig) => run(sql, config).map((f) => f.ruleId);

const BASE = `create table public.a (id uuid primary key, owner uuid not null);
alter table public.a enable row level security;
create policy "own" on public.a for select to authenticated using ((select auth.uid()) = owner);
`;

describe("rules", () => {
  it("clean migration has no findings", () => {
    expect(run(BASE)).toEqual([]);
  });

  it.each([
    ["D001", "drop table public.a;"],
    ["D002", "alter table public.a drop column owner;"],
    ["D003", "truncate public.a;"],
    ["D004", "delete from public.a;"],
    ["D005", "update public.a set owner = null;"],
    ["D006", "drop function public.f(uuid);"],
    ["D007", "alter table public.a alter column owner type text;"],
    ["D008", "alter table public.a rename column owner to user_id;"],
    ["D009", "alter table public.a add column note text not null;"],
    ["D009", "alter table public.a alter column owner set not null;"],
    ["D010", "alter table public.a drop constraint a_pkey;"],
    ["S003", `create policy "w" on public.a for insert with check (true);`],
    ["S003", `create policy "w" on public.a for update using (true);`],
    ["S003", `create policy "w" on public.a for all using (true);`],
    ["S004", `create policy "r" on public.a for select using (true);`],
    ["S005", `create policy "m" on public.a for select using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');`],
    ["S006", "create function public.f() returns void language sql security definer as $$ select 1 $$;"],
    ["S007", "grant insert on public.a to anon;"],
    ["S008", `create policy "r" on public.a for select using (auth.role() = 'authenticated');`],
    ["P002", `create policy "r" on public.a for select using (auth.uid() = owner);`],
    ["H003", `drop policy "own" on public.a;`],
    ["H004", `create policy "own" on public.a for select using (false);`],
  ])("%s fires on: %s", (id, sql) => {
    expect(ids(BASE + sql)).toContain(id);
  });

  it("D009 does not fire for a NOT NULL column with a default, or on a brand new table", () => {
    expect(ids(BASE + "alter table public.a add column n int not null default 0;")).not.toContain("D009");
    expect(ids("create table public.b (id uuid primary key, x text not null); alter table public.b enable row level security; create policy p on public.b for select using (false);")).not.toContain("D009");
  });

  it("S001 fires for tables without RLS, S002 for RLS without policies", () => {
    expect(ids("create table public.a (id int);")).toEqual(["S001"]);
    expect(ids("create table public.a (id int); alter table public.a enable row level security;")).toEqual(["S002"]);
  });

  it("S001 ignores schemas out of scope and tables listed as public", () => {
    expect(ids("create table private.a (id int);")).toEqual([]);
    expect(ids("create table public.lookup (id int);", { ...defaultConfig, publicTables: ["lookup"] })).toEqual([]);
  });

  it("S003 does not fire for a restrictive policy or a scoped write", () => {
    expect(ids(BASE + `create policy "w" on public.a as restrictive for insert with check (true);`)).not.toContain("S003");
    expect(ids(BASE + `create policy "w" on public.a for insert with check ((select auth.uid()) = owner);`)).not.toContain("S003");
  });

  it("S004 is low when only authenticated, skipped for publicTables", () => {
    const f = run(BASE + `create policy "r" on public.a for select to authenticated using (true);`).find((x) => x.ruleId === "S004");
    expect(f?.severity).toBe("low");
    expect(ids(BASE + `create policy "r" on public.a for select using (true);`, { ...defaultConfig, publicTables: ["a"] })).not.toContain("S004");
  });

  it("P001 fires for an unindexed FK and clears once an index exists", () => {
    const fk = "create table public.p (id uuid primary key); alter table public.p enable row level security; create policy x on public.p for select using (false);" +
      "create table public.c (id uuid primary key, p_id uuid references public.p(id)); alter table public.c enable row level security; create policy y on public.c for select using (false);";
    expect(ids(fk)).toContain("P001");
    expect(ids(fk + "create index on public.c (p_id);")).not.toContain("P001");
    expect(ids(fk + "create index on public.c (p_id, created_at);")).not.toContain("P001");
    expect(ids(fk + "create index on public.c (created_at, p_id);")).toContain("P001");
  });

  it("H001/H002/H005 are schema level", () => {
    const a = splitStatements("create table public.a (id int); alter table public.a enable row level security; create policy p on public.a for select using (false);", "20250101000000_a.sql");
    const b = splitStatements("create policy q on public.zzz for select using (false); create index on public.zzz (x);", "20250101000000_b.sql");
    const c = splitStatements("select 1;", "notes.sql");
    const found = lintMigrations([a, b, c], { config: defaultConfig }).map((f) => `${f.ruleId}:${f.file}`);
    expect(found).toContain("H002:20250101000000_b.sql");
    expect(found).toContain("H001:notes.sql");
    expect(found.filter((x) => x.startsWith("H005"))).toEqual(["H005:20250101000000_b.sql"]);
  });

  it("honours inline ignores, file ignores, disabledRules and severity overrides", () => {
    expect(ids(BASE + "-- migralint:ignore D001\ndrop table public.a;")).not.toContain("D001");
    expect(run("-- migralint:ignore-file\ncreate table public.a (id int);")).toEqual([]);
    expect(ids("create table public.a (id int);", { ...defaultConfig, disabledRules: ["S001"] })).toEqual([]);
    expect(run("create table public.a (id int);", { ...defaultConfig, severity: { S001: "low" } })[0]!.severity).toBe("low");
  });

  it("every rule id is unique and has a category", () => {
    expect(new Set(rules.map((r) => r.id)).size).toBe(rules.length);
    for (const r of rules) expect(["destructive", "security", "performance", "hygiene"]).toContain(r.category);
  });
});
