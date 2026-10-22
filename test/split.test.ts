import { describe, it, expect } from "vitest";
import { splitStatements } from "../src/index.js";

describe("splitStatements", () => {
  it("splits on semicolons and records line numbers", () => {
    const m = splitStatements("create table a (id int);\n\n-- comment\nalter table a enable row level security;\n", "20250101000000_x.sql");
    expect(m.version).toBe("20250101000000");
    expect(m.statements.map((s) => s.line)).toEqual([1, 4]);
    expect(m.statements[1]!.text).toBe("alter table a enable row level security");
  });

  it("does not split inside strings, dollar bodies or comments", () => {
    const sql = `insert into t values ('a;b');
create function f() returns void language plpgsql as $$
begin
  perform 1; -- ; inside body
end;
$$;
/* block ; comment */ select 1;`;
    const m = splitStatements(sql, "x.sql");
    expect(m.statements).toHaveLength(3);
    expect(m.statements[1]!.text).toContain("perform 1;");
    expect(m.statements[1]!.text).toContain("$$"); // function bodies are kept verbatim
    expect(m.statements[2]!.line).toBe(7);
  });

  it("handles tagged dollar quotes and escaped quotes", () => {
    const m = splitStatements("select $fn$ a;b $fn$; select 'it''s;';", "x.sql");
    expect(m.statements).toHaveLength(2);
  });

  it("collects inline ignores and file ignores", () => {
    const m = splitStatements("-- migralint:ignore D001, S001\ndrop table a;\ndrop table b; -- migralint:ignore d001\n", "x.sql");
    expect([...m.statements[0]!.ignored]).toEqual(["D001", "S001"]);
    expect(m.statements[1]!.ignored.has("D001")).toBe(true);
    expect(splitStatements("-- migralint:ignore-file\ndrop table a;", "x.sql").ignoreFile).toBe(true);
  });
});
