import type { Migration, Statement } from "../types.js";

const IGNORE_RE = /migralint:\s*ignore(?:-next)?\s+([A-Za-z0-9_,\s-]+)/gi;
const IGNORE_FILE_RE = /migralint:\s*ignore-file/i;

/**
 * Split a SQL file into statements. Handles line and block comments, single-quoted
 * strings (with '' escapes), double-quoted identifiers and dollar-quoted bodies ($$ / $tag$).
 */
export function splitStatements(sql: string, file: string): Migration {
  const statements: Statement[] = [];
  const ignoreFile = IGNORE_FILE_RE.test(sql);
  let i = 0;
  let start = 0;
  let line = 1;
  let startLine = 1;
  let clean = ""; // current statement with comments removed
  let pendingIgnores = new Set<string>();
  let seenCode = false; // have we seen non-comment code in the current statement?

  const pushIgnores = (comment: string) => {
    for (const m of comment.matchAll(IGNORE_RE)) {
      for (const id of m[1]!.split(/[,\s]+/)) if (id) pendingIgnores.add(id.toUpperCase());
    }
  };

  const flush = (end: number) => {
    const raw = sql.slice(start, end);
    const text = clean.replace(/\s+/g, " ").trim();
    if (text.length > 0 && text !== ";") {
      statements.push({ text: text.replace(/;$/, "").trim(), raw: raw.trim(), file, line: startLine, ignored: pendingIgnores });
    }
    pendingIgnores = new Set();
    clean = "";
    seenCode = false;
  };

  const n = sql.length;
  while (i < n) {
    const ch = sql[i]!;
    const next = sql[i + 1];

    if (!seenCode && !/\s/.test(ch) && !(ch === "-" && next === "-") && !(ch === "/" && next === "*")) {
      seenCode = true;
      startLine = line;
      start = i;
    }

    if (ch === "-" && next === "-") {
      const end = sql.indexOf("\n", i);
      const stop = end === -1 ? n : end;
      pushIgnores(sql.slice(i, stop));
      i = stop;
      continue;
    }
    if (ch === "/" && next === "*") {
      const end = sql.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      const comment = sql.slice(i, stop);
      pushIgnores(comment);
      line += (comment.match(/\n/g) ?? []).length;
      i = stop;
      continue;
    }
    if (ch === "'") {
      let j = i + 1;
      while (j < n) {
        if (sql[j] === "'" && sql[j + 1] === "'") j += 2;
        else if (sql[j] === "'") break;
        else j++;
      }
      const lit = sql.slice(i, j + 1);
      clean += lit;
      line += (lit.match(/\n/g) ?? []).length;
      i = j + 1;
      continue;
    }
    if (ch === '"') {
      const j = sql.indexOf('"', i + 1);
      const stop = j === -1 ? n : j + 1;
      clean += sql.slice(i, stop);
      i = stop;
      continue;
    }
    if (ch === "$") {
      const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(sql.slice(i, i + 64));
      if (m) {
        const tag = m[0];
        const j = sql.indexOf(tag, i + tag.length);
        const stop = j === -1 ? n : j + tag.length;
        const body = sql.slice(i, stop);
        clean += body;
        line += (body.match(/\n/g) ?? []).length;
        i = stop;
        continue;
      }
    }
    if (ch === ";") {
      clean += ";";
      flush(i + 1);
      i++;
      // A trailing `-- migralint:ignore X` on the same line applies to the statement just closed.
      const eol = sql.indexOf("\n", i);
      const rest = sql.slice(i, eol === -1 ? n : eol);
      const trailing = /^\s*--(.*)$/.exec(rest);
      if (trailing && IGNORE_RE.test(trailing[1]!)) {
        IGNORE_RE.lastIndex = 0;
        const last = statements[statements.length - 1];
        if (last) for (const m of trailing[1]!.matchAll(IGNORE_RE)) for (const id of m[1]!.split(/[,\s]+/)) if (id) last.ignored.add(id.toUpperCase());
        i += rest.length;
      }
      continue;
    }
    if (ch === "\n") line++;
    clean += ch;
    i++;
  }
  if (seenCode) flush(n);

  const version = /^(\d{10,14})/.exec(file.split("/").pop() ?? "")?.[1] ?? null;
  return { file, version, statements, ignoreFile };
}
