import { describe, it, expect } from "vitest";
import { classify, splitStatements } from "../src/index.js";

const first = (sql: string) => classify(splitStatements(sql, "x.sql").statements[0]!);

describe("classify", () => {
  it("parses create table columns, defaults and references", () => {
    const c = first(`CREATE TABLE public.posts (
      id uuid primary key default gen_random_uuid(),
      author_id uuid not null references public.profiles(id) on delete cascade,
      title text not null,
      body text,
      created_at timestamp with time zone not null default now(),
      constraint fk_cat foreign key (category_id) references public.categories (id)
    );`);
    expect(c.kind).toBe("create-table");
    if (c.kind !== "create-table") return;
    expect(c.schema).toBe("public");
    expect(c.table).toBe("posts");
    expect(c.columns.map((x) => x.name)).toEqual(["id", "author_id", "title", "body", "created_at"]);
    expect(c.columns[1]).toMatchObject({ notNull: true, hasDefault: false, primaryKey: false, references: { table: "public.profiles", column: "id" } });
    expect(c.columns[0]).toMatchObject({ primaryKey: true, hasDefault: true });
    expect(c.columns[4]!.type).toBe("timestamp with time zone");
    expect(c.tableFks).toEqual([{ columns: ["category_id"], refTable: "public.categories" }]);
  });

  it("parses policies with roles, using and with check", () => {
    const c = first(`CREATE POLICY "Users update own" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);`);
    expect(c).toMatchObject({ kind: "create-policy", table: "profiles", policy: "Users update own", command: "UPDATE", roles: ["authenticated"], using: "auth.uid() = id", check: "auth.uid() = id", permissive: true });
  });

  it("parses alter table variants", () => {
    expect(first("alter table public.a enable row level security;")).toMatchObject({ kind: "enable-rls", table: "a" });
    expect(first("alter table a drop column if exists b;")).toMatchObject({ kind: "drop-column", column: "b", ifExists: true });
    expect(first("alter table a add column c text not null;")).toMatchObject({ kind: "add-column", column: { name: "c", notNull: true, hasDefault: false } });
    expect(first("alter table a alter column c type integer using c::int;")).toMatchObject({ kind: "alter-column-type", column: "c", newType: "integer" });
    expect(first("alter table a alter column c set not null;")).toMatchObject({ kind: "set-not-null", column: "c" });
    expect(first("alter table a rename column c to d;")).toMatchObject({ kind: "rename", objectType: "column", from: "c", to: "d" });
    expect(first("alter table a rename to z;")).toMatchObject({ kind: "rename", objectType: "table", to: "z" });
    expect(first("alter table a add constraint fk foreign key (b_id) references b(id);")).toMatchObject({ kind: "add-foreign-key", columns: ["b_id"], refTable: "b" });
    expect(first("alter table a drop constraint fk;")).toMatchObject({ kind: "drop-constraint", constraint: "fk" });
  });

  it("parses indexes, functions, grants and dml", () => {
    expect(first("create index if not exists idx on public.a using btree (b_id, created_at desc);")).toMatchObject({ kind: "create-index", table: "a", columns: ["b_id", "created_at"], ifNotExists: true });
    expect(first("create or replace function public.f() returns trigger language plpgsql security definer set search_path = public as $$ begin return new; end; $$;")).toMatchObject({ kind: "create-function", name: "f", securityDefiner: true, setsSearchPath: true });
    expect(first("create function public.g() returns void language sql as $$ select 1; -- security definer $$;")).toMatchObject({ kind: "create-function", securityDefiner: false });
    expect(first("grant insert, update on public.a to anon, authenticated;")).toMatchObject({ kind: "grant", privileges: ["insert", "update"], roles: ["anon", "authenticated"] });
    expect(first("delete from a;")).toMatchObject({ kind: "delete", hasWhere: false });
    expect(first("delete from a where id = 1;")).toMatchObject({ kind: "delete", hasWhere: true });
    expect(first("update a set x = 1;")).toMatchObject({ kind: "update", hasWhere: false });
    expect(first("truncate table a, b restart identity;")).toMatchObject({ kind: "truncate", tables: ["a", "b"] });
    expect(first("drop table if exists a cascade;")).toMatchObject({ kind: "drop-table", ifExists: true, cascade: true });
    expect(first("drop policy if exists \"p\" on public.a;")).toMatchObject({ kind: "drop-policy", policy: "p", ifExists: true });
    expect(first("drop function f(uuid);")).toMatchObject({ kind: "drop-object", objectType: "function", ifExists: false });
  });
});
