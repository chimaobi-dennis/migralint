import type { ColumnDef, Statement } from "../types.js";

export type Classified =
  | { kind: "create-table"; schema: string; table: string; columns: ColumnDef[]; tableFks: { columns: string[]; refTable: string }[]; ifNotExists: boolean }
  | { kind: "drop-table"; schema: string; table: string; ifExists: boolean; cascade: boolean }
  | { kind: "drop-column"; schema: string; table: string; column: string; ifExists: boolean }
  | { kind: "drop-object"; objectType: string; name: string; ifExists: boolean; cascade: boolean }
  | { kind: "drop-policy"; schema: string; table: string; policy: string; ifExists: boolean }
  | { kind: "truncate"; tables: string[] }
  | { kind: "delete"; table: string; hasWhere: boolean }
  | { kind: "update"; table: string; hasWhere: boolean }
  | { kind: "insert"; table: string }
  | { kind: "enable-rls"; schema: string; table: string; force: boolean }
  | { kind: "disable-rls"; schema: string; table: string }
  | { kind: "add-column"; schema: string; table: string; column: ColumnDef }
  | { kind: "alter-column-type"; schema: string; table: string; column: string; newType: string }
  | { kind: "set-not-null"; schema: string; table: string; column: string }
  | { kind: "rename"; objectType: "table" | "column"; schema: string; table: string; from: string; to: string }
  | { kind: "add-foreign-key"; schema: string; table: string; columns: string[]; refTable: string }
  | { kind: "drop-constraint"; schema: string; table: string; constraint: string; ifExists: boolean }
  | { kind: "alter-table-other"; schema: string; table: string }
  | { kind: "create-policy"; schema: string; table: string; policy: string; command: "ALL" | "SELECT" | "INSERT" | "UPDATE" | "DELETE"; roles: string[]; using?: string; check?: string; permissive: boolean }
  | { kind: "create-index"; schema: string; table: string; columns: string[]; unique: boolean; concurrently: boolean; ifNotExists: boolean }
  | { kind: "create-function"; schema: string; name: string; securityDefiner: boolean; setsSearchPath: boolean }
  | { kind: "grant"; privileges: string[]; target: string; roles: string[] }
  | { kind: "other" };

const ID = String.raw`(?:"[^"]+"|[A-Za-z_][A-Za-z0-9_$]*)`;
const QNAME = String.raw`((?:${ID}\s*\.\s*)?${ID})`;

export function unquote(id: string): string {
  const t = id.trim();
  return t.startsWith('"') ? t.slice(1, -1) : t.toLowerCase();
}

export function splitQualified(name: string, defaultSchema = "public"): { schema: string; name: string } {
  const parts = name.split(/\s*\.\s*/);
  if (parts.length >= 2) return { schema: unquote(parts[0]!), name: unquote(parts[1]!) };
  return { schema: defaultSchema, name: unquote(parts[0]!) };
}

/** Split a comma separated list at top level (ignores commas inside parentheses). */
export function splitTopLevel(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  let inStr = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;
    if (ch === "'" ) inStr = !inStr;
    if (!inStr) {
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
      else if (ch === "," && depth === 0) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Return the text inside the first balanced parenthesis pair starting at `from`. */
function balanced(text: string, from: number): { inner: string; end: number } | null {
  const open = text.indexOf("(", from);
  if (open === -1) return null;
  let depth = 0;
  let inStr = false;
  for (let i = open; i < text.length; i++) {
    const ch = text[i]!;
    if (ch === "'") inStr = !inStr;
    if (inStr) continue;
    if (ch === "(") depth++;
    else if (ch === ")") {
      depth--;
      if (depth === 0) return { inner: text.slice(open + 1, i), end: i + 1 };
    }
  }
  return null;
}

const CONSTRAINT_START = /^(?:constraint\s|primary\s+key|unique\b|foreign\s+key|check\b|exclude\b|like\b)/i;

function parseColumnDef(def: string): ColumnDef | null {
  if (CONSTRAINT_START.test(def)) return null;
  const m = new RegExp(String.raw`^(${ID})\s+(.+)$`, "s").exec(def);
  if (!m) return null;
  const name = unquote(m[1]!);
  const rest = m[2]!;
  const typeMatch = /^((?:[A-Za-z_][A-Za-z0-9_]*(?:\s*\.\s*[A-Za-z_][A-Za-z0-9_]*)?)(?:\s*\([^)]*\))?(?:\s*\[\])*(?:\s+(?:with|without)\s+time\s+zone)?(?:\s+varying)?(?:\s*\([^)]*\))?)/i.exec(rest);
  const type = (typeMatch?.[1] ?? rest.split(/\s+/)[0] ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  const refs = new RegExp(String.raw`\breferences\s+${QNAME}(?:\s*\(\s*(${ID})\s*\))?`, "i").exec(rest);
  return {
    name,
    type,
    notNull: /\bnot\s+null\b/i.test(rest) || /\bprimary\s+key\b/i.test(rest),
    hasDefault: /\bdefault\b/i.test(rest) || /\bgenerated\b.*\bidentity\b/i.test(rest) || /\bserial\b/i.test(type),
    primaryKey: /\bprimary\s+key\b/i.test(rest),
    unique: /\bunique\b/i.test(rest),
    references: refs ? { table: refs[1]!.replace(/\s+/g, ""), column: refs[2] ? unquote(refs[2]) : undefined } : undefined,
  };
}

function parseTableFk(def: string): { columns: string[]; refTable: string } | null {
  const m = new RegExp(String.raw`foreign\s+key\s*\(([^)]*)\)\s*references\s+${QNAME}`, "i").exec(def);
  if (!m) return null;
  return { columns: m[1]!.split(",").map(unquote), refTable: m[2]!.replace(/\s+/g, "") };
}

export function classify(stmt: Statement): Classified {
  const t = stmt.text;
  let m: RegExpExecArray | null;

  if ((m = new RegExp(String.raw`^create\s+(?:(?:global|local|temp|temporary|unlogged)\s+)*table\s+(if\s+not\s+exists\s+)?${QNAME}`, "i").exec(t))) {
    const { schema, name } = splitQualified(m[2]!);
    const body = balanced(t, m[0].length);
    const columns: ColumnDef[] = [];
    const tableFks: { columns: string[]; refTable: string }[] = [];
    if (body) {
      for (const def of splitTopLevel(body.inner)) {
        const col = parseColumnDef(def);
        if (col) columns.push(col);
        const fk = parseTableFk(def);
        if (fk) tableFks.push(fk);
      }
    }
    return { kind: "create-table", schema, table: name, columns, tableFks, ifNotExists: !!m[1] };
  }
  if ((m = new RegExp(String.raw`^drop\s+table\s+(if\s+exists\s+)?${QNAME}(.*)$`, "i").exec(t))) {
    const { schema, name } = splitQualified(m[2]!);
    return { kind: "drop-table", schema, table: name, ifExists: !!m[1], cascade: /\bcascade\b/i.test(m[3] ?? "") };
  }
  if ((m = new RegExp(String.raw`^drop\s+policy\s+(if\s+exists\s+)?(${ID})\s+on\s+${QNAME}`, "i").exec(t))) {
    const { schema, name } = splitQualified(m[3]!);
    return { kind: "drop-policy", schema, table: name, policy: unquote(m[2]!), ifExists: !!m[1] };
  }
  if ((m = /^drop\s+(schema|type|function|procedure|view|materialized\s+view|sequence|index|trigger|extension|domain|role)\s+(if\s+exists\s+)?(.+?)(\s+cascade|\s+restrict)?$/i.exec(t))) {
    return { kind: "drop-object", objectType: m[1]!.toLowerCase().replace(/\s+/g, " "), name: m[3]!.trim(), ifExists: !!m[2], cascade: /cascade/i.test(m[4] ?? "") };
  }
  if ((m = /^truncate\s+(?:table\s+)?(?:only\s+)?(.+?)(?:\s+(?:restart|continue)\s+identity)?(?:\s+cascade|\s+restrict)?$/i.exec(t))) {
    return { kind: "truncate", tables: m[1]!.split(",").map((s) => s.trim()) };
  }
  if ((m = new RegExp(String.raw`^delete\s+from\s+(?:only\s+)?${QNAME}`, "i").exec(t))) {
    return { kind: "delete", table: m[1]!, hasWhere: /\bwhere\b/i.test(t) };
  }
  if ((m = new RegExp(String.raw`^update\s+(?:only\s+)?${QNAME}`, "i").exec(t))) {
    return { kind: "update", table: m[1]!, hasWhere: /\bwhere\b/i.test(t) };
  }
  if ((m = new RegExp(String.raw`^insert\s+into\s+${QNAME}`, "i").exec(t))) {
    return { kind: "insert", table: m[1]! };
  }
  if ((m = new RegExp(String.raw`^alter\s+table\s+(?:if\s+exists\s+)?(?:only\s+)?${QNAME}\s+(.*)$`, "is").exec(t))) {
    const { schema, name } = splitQualified(m[1]!);
    const action = m[2]!;
    let a: RegExpExecArray | null;
    if (/^(?:enable|force)\s+row\s+level\s+security/i.test(action) || /\benable\s+row\s+level\s+security\b/i.test(action)) {
      return { kind: "enable-rls", schema, table: name, force: /\bforce\s+row\s+level\s+security\b/i.test(action) };
    }
    if (/^(?:disable|no\s+force)\s+row\s+level\s+security/i.test(action)) return { kind: "disable-rls", schema, table: name };
    if ((a = new RegExp(String.raw`^drop\s+constraint\s+(if\s+exists\s+)?(${ID})`, "i").exec(action))) {
      return { kind: "drop-constraint", schema, table: name, constraint: unquote(a[2]!), ifExists: !!a[1] };
    }
    if ((a = new RegExp(String.raw`^drop\s+(?:column\s+)?(if\s+exists\s+)?(${ID})`, "i").exec(action))) {
      return { kind: "drop-column", schema, table: name, column: unquote(a[2]!), ifExists: !!a[1] };
    }
    if ((a = /^add\s+(?:column\s+)?(?:if\s+not\s+exists\s+)?(.+)$/is.exec(action)) && !/^add\s+(?:constraint|primary|unique|foreign|check|exclude)\b/i.test(action)) {
      const col = parseColumnDef(a[1]!);
      if (col) return { kind: "add-column", schema, table: name, column: col };
    }
    if ((a = new RegExp(String.raw`^alter\s+(?:column\s+)?(${ID})\s+(?:set\s+data\s+)?type\s+(.+?)(?:\s+using\b.*)?$`, "is").exec(action))) {
      return { kind: "alter-column-type", schema, table: name, column: unquote(a[1]!), newType: a[2]!.trim().toLowerCase() };
    }
    if ((a = new RegExp(String.raw`^alter\s+(?:column\s+)?(${ID})\s+set\s+not\s+null`, "i").exec(action))) {
      return { kind: "set-not-null", schema, table: name, column: unquote(a[1]!) };
    }
    if ((a = new RegExp(String.raw`^rename\s+(?:column\s+)?(${ID})\s+to\s+(${ID})`, "i").exec(action))) {
      return { kind: "rename", objectType: "column", schema, table: name, from: unquote(a[1]!), to: unquote(a[2]!) };
    }
    if ((a = new RegExp(String.raw`^rename\s+to\s+(${ID})`, "i").exec(action))) {
      return { kind: "rename", objectType: "table", schema, table: name, from: name, to: unquote(a[1]!) };
    }
    const fk = parseTableFk(action);
    if (fk) return { kind: "add-foreign-key", schema, table: name, columns: fk.columns, refTable: fk.refTable };
    return { kind: "alter-table-other", schema, table: name };
  }
  if ((m = new RegExp(String.raw`^create\s+policy\s+(${ID})\s+on\s+${QNAME}(.*)$`, "is").exec(t))) {
    const { schema, name } = splitQualified(m[2]!);
    const rest = m[3]!;
    const cmd = /\bfor\s+(all|select|insert|update|delete)\b/i.exec(rest)?.[1]?.toUpperCase() as "ALL" | "SELECT" | "INSERT" | "UPDATE" | "DELETE" | undefined;
    const rolesM = /\bto\s+([^()]+?)(?=\s+(?:using|with\s+check)\b|$)/i.exec(rest);
    const roles = rolesM ? rolesM[1]!.split(",").map((r) => r.trim().toLowerCase()) : ["public"];
    const usingIdx = rest.search(/\busing\s*\(/i);
    const checkIdx = rest.search(/\bwith\s+check\s*\(/i);
    const using = usingIdx !== -1 ? balanced(rest, usingIdx)?.inner.trim() : undefined;
    const check = checkIdx !== -1 ? balanced(rest, checkIdx)?.inner.trim() : undefined;
    return { kind: "create-policy", schema, table: name, policy: unquote(m[1]!), command: cmd ?? "ALL", roles, using, check, permissive: !/\bas\s+restrictive\b/i.test(rest) };
  }
  if ((m = new RegExp(String.raw`^create\s+(unique\s+)?index\s+(concurrently\s+)?(if\s+not\s+exists\s+)?(?:${ID}\s+)?on\s+(?:only\s+)?${QNAME}(?:\s+using\s+\w+)?\s*\(`, "i").exec(t))) {
    const { schema, name } = splitQualified(m[4]!);
    const body = balanced(t, m[0].length - 1);
    const columns = body ? splitTopLevel(body.inner).map((c) => unquote(c.split(/\s+/)[0]!.replace(/\(.*$/, ""))) : [];
    return { kind: "create-index", schema, table: name, columns, unique: !!m[1], concurrently: !!m[2], ifNotExists: !!m[3] };
  }
  if ((m = new RegExp(String.raw`^create\s+(?:or\s+replace\s+)?(?:function|procedure)\s+${QNAME}`, "i").exec(t))) {
    const { schema, name } = splitQualified(m[1]!);
    // Only look at the function header (outside the dollar-quoted body) for attributes.
    const header = t.replace(/\$([A-Za-z_]*)\$[\s\S]*?\$\1\$/g, "");
    return { kind: "create-function", schema, name, securityDefiner: /\bsecurity\s+definer\b/i.test(header), setsSearchPath: /\bset\s+search_path\b/i.test(header) };
  }
  if ((m = /^grant\s+(.+?)\s+on\s+(.+?)\s+to\s+(.+)$/i.exec(t))) {
    return { kind: "grant", privileges: m[1]!.split(",").map((p) => p.trim().toLowerCase()), target: m[2]!.trim(), roles: m[3]!.split(",").map((r) => r.trim().toLowerCase().replace(/\s+with\s+grant\s+option$/, "")) };
  }
  return { kind: "other" };
}
