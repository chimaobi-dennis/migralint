export type Severity = "critical" | "high" | "medium" | "low";
export type Category = "destructive" | "security" | "performance" | "hygiene";

/** One SQL statement with its source location. */
export interface Statement {
  /** Statement text with comments stripped and whitespace collapsed (for matching). */
  text: string;
  /** Original text, including comments, as written. */
  raw: string;
  file: string;
  line: number;
  /** Rule ids suppressed for this statement via `-- migralint:ignore <id>` comments. */
  ignored: Set<string>;
}

export interface Migration {
  file: string;
  /** Leading digits of the filename, e.g. 20251007103730. */
  version: string | null;
  statements: Statement[];
  /** Whole file is suppressed via `-- migralint:ignore-file`. */
  ignoreFile: boolean;
}

export interface ColumnDef {
  name: string;
  type: string;
  notNull: boolean;
  hasDefault: boolean;
  primaryKey: boolean;
  unique: boolean;
  references?: { table: string; column?: string };
}

export interface PolicyDef {
  name: string;
  command: "ALL" | "SELECT" | "INSERT" | "UPDATE" | "DELETE";
  roles: string[];
  using?: string;
  check?: string;
  permissive: boolean;
  statement: Statement;
}

export interface ForeignKey {
  columns: string[];
  refTable: string;
  statement: Statement;
}

export interface TableModel {
  schema: string;
  name: string;
  columns: Map<string, ColumnDef>;
  rlsEnabled: boolean;
  rlsForced: boolean;
  policies: Map<string, PolicyDef>;
  foreignKeys: ForeignKey[];
  /** Column lists of every index, lower-cased, first column first. */
  indexes: string[][];
  createdBy: Statement;
  dropped: boolean;
}

export interface FunctionModel {
  schema: string;
  name: string;
  securityDefiner: boolean;
  setsSearchPath: boolean;
  statement: Statement;
}

export interface SchemaModel {
  tables: Map<string, TableModel>; // key: schema.name (lower-case)
  functions: Map<string, FunctionModel>;
}

export interface Finding {
  ruleId: string;
  ruleName: string;
  category: Category;
  severity: Severity;
  message: string;
  file: string;
  line: number;
  /** A short excerpt of the offending statement. */
  excerpt: string;
  /** How to fix it. */
  help?: string;
}

export interface LintResult {
  startedAt: string;
  durationMs: number;
  files: string[];
  statements: number;
  findings: Finding[];
}

export interface MigralintConfig {
  disabledRules: string[];
  /** Override the severity of a rule. */
  severity: Record<string, Severity>;
  /** Tables (schema.name or name) that rules may skip, e.g. lookup tables intentionally public. */
  publicTables: string[];
  /** Schemas to analyse. Default: ["public"]. */
  schemas: string[];
}
