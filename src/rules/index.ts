import { classify, type Classified } from "../sql/classify.js";
import type { Category, Finding, Migration, MigralintConfig, SchemaModel, Severity, Statement, TableModel } from "../types.js";

export interface StatementContext {
  stmt: Statement;
  classified: Classified;
  /** Model state *before* this statement was applied. */
  model: SchemaModel;
  migration: Migration;
  config: MigralintConfig;
}

export interface SchemaContext {
  model: SchemaModel;
  migrations: Migration[];
  config: MigralintConfig;
}

export type RuleFinding = Omit<Finding, "ruleId" | "ruleName" | "category" | "severity"> & { severity?: Severity };

export interface Rule {
  id: string;
  name: string;
  category: Category;
  severity: Severity;
  description: string;
  help?: string;
  /** Runs once per statement. */
  statement?: (ctx: StatementContext) => RuleFinding[];
  /** Runs once after all migrations are applied. */
  schema?: (ctx: SchemaContext) => RuleFinding[];
}

const excerpt = (s: Statement): string => s.text.length > 90 ? s.text.slice(0, 87) + "..." : s.text;
const at = (s: Statement, message: string, extra: Partial<RuleFinding> = {}): RuleFinding => ({ file: s.file, line: s.line, excerpt: excerpt(s), message, ...extra });
const inScope = (schema: string, config: MigralintConfig) => config.schemas.includes(schema.toLowerCase());
const isPublicTable = (t: TableModel, config: MigralintConfig) => config.publicTables.some((p) => p.toLowerCase() === t.name.toLowerCase() || p.toLowerCase() === `${t.schema}.${t.name}`.toLowerCase());
const isTrue = (expr?: string) => expr !== undefined && /^\s*true\s*$/i.test(expr);
const live = (model: SchemaModel) => [...model.tables.values()].filter((t) => !t.dropped);

export const rules: Rule[] = [
  // ---------------------------------------------------------------- destructive
  {
    id: "D001",
    name: "drop-table",
    category: "destructive",
    severity: "critical",
    description: "DROP TABLE permanently deletes the table and every row in it.",
    help: "Rename the table (e.g. to <name>_deprecated) in this migration and drop it in a later one after a backup is confirmed, or add `-- migralint:ignore D001` if the loss is intended.",
    statement: ({ stmt, classified: c }) => c.kind === "drop-table" ? [at(stmt, `DROP TABLE ${c.schema}.${c.table} deletes all of its data${c.cascade ? " and cascades to dependent objects" : ""}.`)] : [],
  },
  {
    id: "D002",
    name: "drop-column",
    category: "destructive",
    severity: "high",
    description: "DROP COLUMN permanently deletes the column's data.",
    help: "Stop writing to the column first, deploy, then drop it in a later migration once nothing reads it.",
    statement: ({ stmt, classified: c }) => c.kind === "drop-column" ? [at(stmt, `Dropping column ${c.table}.${c.column} deletes its data.`)] : [],
  },
  {
    id: "D003",
    name: "truncate",
    category: "destructive",
    severity: "critical",
    description: "TRUNCATE deletes every row and cannot be filtered.",
    statement: ({ stmt, classified: c }) => c.kind === "truncate" ? [at(stmt, `TRUNCATE empties ${c.tables.join(", ")}.`)] : [],
  },
  {
    id: "D004",
    name: "delete-without-where",
    category: "destructive",
    severity: "critical",
    description: "DELETE without a WHERE clause removes every row.",
    statement: ({ stmt, classified: c }) => c.kind === "delete" && !c.hasWhere ? [at(stmt, `DELETE FROM ${c.table} has no WHERE clause and removes every row.`)] : [],
  },
  {
    id: "D005",
    name: "update-without-where",
    category: "destructive",
    severity: "high",
    description: "UPDATE without a WHERE clause rewrites every row.",
    statement: ({ stmt, classified: c }) => c.kind === "update" && !c.hasWhere ? [at(stmt, `UPDATE ${c.table} has no WHERE clause and rewrites every row.`)] : [],
  },
  {
    id: "D006",
    name: "drop-object",
    category: "destructive",
    severity: "medium",
    description: "Dropping a schema, type, function, view or sequence can break dependent objects and clients.",
    statement: ({ stmt, classified: c }) => {
      if (c.kind !== "drop-object") return [];
      if (c.objectType === "schema") return [at(stmt, `DROP SCHEMA ${c.name} removes every object inside it.`, { severity: "critical" })];
      if (["index", "trigger", "extension"].includes(c.objectType)) return [];
      return [at(stmt, `DROP ${c.objectType.toUpperCase()} ${c.name}${c.cascade ? " CASCADE" : ""} may break dependent objects.`)];
    },
  },
  {
    id: "D007",
    name: "alter-column-type",
    category: "destructive",
    severity: "medium",
    description: "Changing a column's type rewrites the table, takes an exclusive lock, and may fail or lose precision.",
    help: "Add a new column with the new type, backfill, switch readers, then drop the old column.",
    statement: ({ stmt, classified: c }) => c.kind === "alter-column-type" ? [at(stmt, `Changing ${c.table}.${c.column} to ${c.newType} rewrites the table and may lose data.`)] : [],
  },
  {
    id: "D008",
    name: "rename",
    category: "destructive",
    severity: "medium",
    description: "Renaming a table or column breaks every client still using the old name.",
    help: "Add the new name alongside the old one and migrate clients before removing the old name.",
    statement: ({ stmt, classified: c }) => c.kind === "rename" ? [at(stmt, `Renaming ${c.objectType} ${c.from} to ${c.to} breaks clients that use the old name.`)] : [],
  },
  {
    id: "D009",
    name: "not-null-without-default",
    category: "destructive",
    severity: "medium",
    description: "Adding NOT NULL to an existing column, or adding a NOT NULL column without a default, fails if the table has rows.",
    help: "Backfill the column first, or add a DEFAULT.",
    statement: ({ stmt, classified: c, model }) => {
      if (c.kind === "set-not-null") return [at(stmt, `SET NOT NULL on ${c.table}.${c.column} fails if any existing row is null.`)];
      if (c.kind === "add-column" && c.column.notNull && !c.column.hasDefault) {
        const existed = model.tables.get(`${c.schema}.${c.table}`.toLowerCase());
        if (existed && !existed.dropped) return [at(stmt, `Adding NOT NULL column ${c.table}.${c.column.name} without a DEFAULT fails on a table with rows.`)];
      }
      return [];
    },
  },
  {
    id: "D010",
    name: "drop-constraint",
    category: "destructive",
    severity: "medium",
    description: "Dropping a constraint silently removes a data integrity guarantee.",
    statement: ({ stmt, classified: c }) => c.kind === "drop-constraint" ? [at(stmt, `Dropping constraint ${c.constraint} on ${c.table} removes an integrity guarantee.`)] : [],
  },

  // ------------------------------------------------------------------ security
  {
    id: "S001",
    name: "table-without-rls",
    category: "security",
    severity: "critical",
    description: "A table in an exposed schema without row level security is readable and writable by anyone holding the anon key.",
    help: "ALTER TABLE <table> ENABLE ROW LEVEL SECURITY; then add policies.",
    schema: ({ model, config }) => live(model).filter((t) => inScope(t.schema, config) && !t.rlsEnabled && !isPublicTable(t, config)).map((t) => at(t.createdBy, `Table ${t.schema}.${t.name} has no row level security.`)),
  },
  {
    id: "S002",
    name: "rls-without-policies",
    category: "security",
    severity: "low",
    description: "Row level security is enabled but no policy exists, so no client can read or write the table. Usually a forgotten policy.",
    schema: ({ model, config }) => live(model).filter((t) => inScope(t.schema, config) && t.rlsEnabled && t.policies.size === 0).map((t) => at(t.createdBy, `Table ${t.schema}.${t.name} has RLS enabled but no policies; all client access is denied.`)),
  },
  {
    id: "S003",
    name: "permissive-write-policy",
    category: "security",
    severity: "critical",
    description: "A write policy whose condition is `true` lets any client insert, update or delete any row.",
    help: "Restrict the policy, for example WITH CHECK (auth.uid() = user_id).",
    statement: ({ stmt, classified: c, config }) => {
      if (c.kind !== "create-policy" || !c.permissive || !inScope(c.schema, config)) return [];
      if (c.command === "SELECT") return [];
      const usingTrue = isTrue(c.using);
      const checkTrue = isTrue(c.check);
      // For INSERT only WITH CHECK applies. For UPDATE/DELETE/ALL, USING applies (and WITH CHECK defaults to USING).
      const open = c.command === "INSERT" ? checkTrue || (c.check === undefined && usingTrue) : usingTrue && (c.check === undefined || checkTrue) || (c.using === undefined && checkTrue);
      return open ? [at(stmt, `Policy "${c.policy}" lets anyone ${c.command === "ALL" ? "read and write" : c.command.toLowerCase()} every row of ${c.table}.`)] : [];
    },
  },
  {
    id: "S004",
    name: "permissive-read-policy",
    category: "security",
    severity: "medium",
    description: "A SELECT policy with USING (true) exposes every row of the table to anyone, including unauthenticated clients when the role list includes anon or public.",
    help: "Scope the policy, or list the table under `publicTables` in .migralint.yml if it is intentionally public.",
    statement: ({ stmt, classified: c, config }) => {
      if (c.kind !== "create-policy" || !inScope(c.schema, config) || c.command !== "SELECT" || !isTrue(c.using)) return [];
      if (config.publicTables.some((p) => p.toLowerCase() === c.table.toLowerCase() || p.toLowerCase() === `${c.schema}.${c.table}`.toLowerCase())) return [];
      const anonymous = c.roles.includes("public") || c.roles.includes("anon");
      return [at(stmt, `Policy "${c.policy}" exposes every row of ${c.table} to ${anonymous ? "unauthenticated clients" : c.roles.join(", ")}.`, { severity: anonymous ? "medium" : "low" })];
    },
  },
  {
    id: "S005",
    name: "user-metadata-in-policy",
    category: "security",
    severity: "critical",
    description: "user_metadata and raw_user_meta_data are editable by the end user, so a policy that trusts them can be bypassed.",
    help: "Use app_metadata (server-controlled) or a roles table joined on auth.uid().",
    statement: ({ stmt, classified: c }) => {
      if (c.kind !== "create-policy") return [];
      const body = `${c.using ?? ""} ${c.check ?? ""}`;
      return /user_metadata|raw_user_meta_data/i.test(body) ? [at(stmt, `Policy "${c.policy}" trusts user-editable metadata.`)] : [];
    },
  },
  {
    id: "S006",
    name: "security-definer-search-path",
    category: "security",
    severity: "high",
    description: "A SECURITY DEFINER function without a fixed search_path can be hijacked by objects created in a schema the caller controls.",
    help: "Add `SET search_path = ''` (or a fixed schema list) to the function definition.",
    statement: ({ stmt, classified: c }) => c.kind === "create-function" && c.securityDefiner && !c.setsSearchPath ? [at(stmt, `Function ${c.schema}.${c.name} is SECURITY DEFINER without SET search_path.`)] : [],
  },
  {
    id: "S007",
    name: "grant-write-to-anon",
    category: "security",
    severity: "high",
    description: "Granting write privileges to anon or PUBLIC lets unauthenticated clients modify data if RLS is missing or permissive.",
    statement: ({ stmt, classified: c }) => {
      if (c.kind !== "grant") return [];
      const risky = c.roles.some((r) => r === "anon" || r === "public");
      const write = c.privileges.some((p) => ["all", "all privileges", "insert", "update", "delete", "truncate"].includes(p));
      return risky && write ? [at(stmt, `GRANT ${c.privileges.join(", ").toUpperCase()} ON ${c.target} TO ${c.roles.join(", ")} gives unauthenticated clients write access.`)] : [];
    },
  },
  {
    id: "S008",
    name: "deprecated-auth-role",
    category: "security",
    severity: "low",
    description: "auth.role() is deprecated in Supabase; use (select auth.jwt() ->> 'role') or the TO <role> clause of the policy.",
    statement: ({ stmt, classified: c }) => c.kind === "create-policy" && /\bauth\.role\s*\(/i.test(`${c.using ?? ""} ${c.check ?? ""}`) ? [at(stmt, `Policy "${c.policy}" uses deprecated auth.role().`)] : [],
  },

  // --------------------------------------------------------------- performance
  {
    id: "P001",
    name: "foreign-key-without-index",
    category: "performance",
    severity: "medium",
    description: "Foreign key columns without an index make joins, cascading deletes and RLS lookups scan the whole table.",
    help: "CREATE INDEX ON <table> (<column>);",
    schema: ({ model, config }) => {
      const out: RuleFinding[] = [];
      for (const t of live(model)) {
        if (!inScope(t.schema, config)) continue;
        for (const fk of t.foreignKeys) {
          const cols = fk.columns.map((c) => c.toLowerCase());
          const covered = t.indexes.some((idx) => cols.every((c, i) => idx[i] === c));
          if (!covered) out.push(at(fk.statement, `Foreign key ${t.name}(${fk.columns.join(", ")}) → ${fk.refTable} has no covering index.`));
        }
      }
      return out;
    },
  },
  {
    id: "P002",
    name: "unwrapped-auth-call-in-policy",
    category: "performance",
    severity: "low",
    description: "Calling auth.uid() or auth.jwt() directly in a policy re-evaluates it per row; wrapping it in (select ...) lets Postgres cache it.",
    help: "Replace auth.uid() with (select auth.uid()).",
    statement: ({ stmt, classified: c }) => {
      if (c.kind !== "create-policy") return [];
      const body = `${c.using ?? ""} ${c.check ?? ""}`;
      const unwrapped = /(?<!select\s)(?<!select\s\s)\bauth\.(uid|jwt)\s*\(\s*\)/i.test(body.replace(/\(\s*select\s+auth\.(uid|jwt)\s*\(\s*\)\s*\)/gi, ""));
      return unwrapped ? [at(stmt, `Policy "${c.policy}" calls auth.uid()/auth.jwt() without (select ...).`)] : [];
    },
  },

  // ------------------------------------------------------------------- hygiene
  {
    id: "H001",
    name: "migration-filename",
    category: "hygiene",
    severity: "low",
    description: "Migration files should start with a 14-digit timestamp so tools apply them in order.",
    schema: ({ migrations }) => migrations.filter((m) => !/^\d{14}_/.test(m.file.split("/").pop() ?? "")).map((m) => ({ file: m.file, line: 1, excerpt: m.file.split("/").pop() ?? m.file, message: `Filename does not start with a 14-digit timestamp and an underscore.` })),
  },
  {
    id: "H002",
    name: "duplicate-version",
    category: "hygiene",
    severity: "medium",
    description: "Two migrations share the same version prefix; most tools apply only one of them.",
    schema: ({ migrations }) => {
      const seen = new Map<string, Migration>();
      const out: RuleFinding[] = [];
      for (const m of migrations) {
        if (!m.version) continue;
        const prev = seen.get(m.version);
        if (prev) out.push({ file: m.file, line: 1, excerpt: m.file.split("/").pop() ?? m.file, message: `Version ${m.version} is also used by ${prev.file.split("/").pop()}.` });
        else seen.set(m.version, m);
      }
      return out;
    },
  },
  {
    id: "H003",
    name: "non-idempotent-drop",
    category: "hygiene",
    severity: "low",
    description: "DROP without IF EXISTS fails when the migration is re-run or applied to an environment that never had the object.",
    statement: ({ stmt, classified: c }) => (c.kind === "drop-policy" || c.kind === "drop-object") && !c.ifExists ? [at(stmt, `Use IF EXISTS so the statement is safe to re-run.`)] : [],
  },
  {
    id: "H004",
    name: "duplicate-policy",
    category: "hygiene",
    severity: "medium",
    description: "Creating a policy whose name already exists on the table fails at apply time.",
    help: "DROP POLICY IF EXISTS first, or pick a new name.",
    statement: ({ stmt, classified: c, model }) => {
      if (c.kind !== "create-policy") return [];
      const t = model.tables.get(`${c.schema}.${c.table}`.toLowerCase());
      return t && t.policies.has(c.policy) ? [at(stmt, `Policy "${c.policy}" already exists on ${c.table}.`)] : [];
    },
  },
  {
    id: "H005",
    name: "unknown-table",
    category: "hygiene",
    severity: "low",
    description: "A policy, index or RLS change targets a table these migrations never create, so the linter cannot check its security. Reported once per table.",
    help: "Add the CREATE TABLE migration (e.g. `supabase db diff`) so the schema is fully described by migrations.",
    schema: ({ migrations, config }) => {
      const known = new Set<string>();
      const reported = new Set<string>();
      const out: RuleFinding[] = [];
      for (const m of migrations) {
        for (const stmt of m.statements) {
          const c = classify(stmt);
          if (c.kind === "create-table") known.add(`${c.schema}.${c.table}`.toLowerCase());
          if (!["create-policy", "enable-rls", "create-index", "add-column", "add-foreign-key"].includes(c.kind) || !("table" in c) || !("schema" in c)) continue;
          const key = `${c.schema}.${c.table}`.toLowerCase();
          if (!inScope(c.schema, config) || known.has(key) || reported.has(key)) continue;
          reported.add(key);
          out.push(at(stmt, `Table ${key} is not created by any linted migration; its RLS and policies cannot be verified.`));
        }
      }
      return out;
    },
  },
];

export const ruleById = new Map(rules.map((r) => [r.id, r]));
