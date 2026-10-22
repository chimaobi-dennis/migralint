import { classify, splitQualified, type Classified } from "./sql/classify.js";
import type { Migration, SchemaModel, Statement, TableModel } from "./types.js";

export function emptyModel(): SchemaModel {
  return { tables: new Map(), functions: new Map() };
}

export function tableKey(schema: string, name: string): string {
  return `${schema}.${name}`.toLowerCase();
}

export function getTable(model: SchemaModel, qualified: string, defaultSchema = "public"): TableModel | undefined {
  const { schema, name } = splitQualified(qualified, defaultSchema);
  return model.tables.get(tableKey(schema, name));
}

/** Apply one classified statement to the model. Returns the classification for rule use. */
export function applyStatement(model: SchemaModel, stmt: Statement): Classified {
  const c = classify(stmt);
  switch (c.kind) {
    case "create-table": {
      const key = tableKey(c.schema, c.table);
      const existing = model.tables.get(key);
      if (existing && !existing.dropped && c.ifNotExists) break;
      const table: TableModel = {
        schema: c.schema,
        name: c.table,
        columns: new Map(c.columns.map((col) => [col.name, col])),
        rlsEnabled: false,
        rlsForced: false,
        policies: new Map(),
        foreignKeys: [],
        indexes: [],
        createdBy: stmt,
        dropped: false,
      };
      for (const col of c.columns) {
        if (col.references) table.foreignKeys.push({ columns: [col.name], refTable: col.references.table, statement: stmt });
      }
      for (const fk of c.tableFks) table.foreignKeys.push({ ...fk, statement: stmt });
      // A primary key or unique constraint is an index.
      for (const col of c.columns) if (col.primaryKey || col.unique) table.indexes.push([col.name]);
      const pk = /primary\s+key\s*\(([^)]*)\)/i.exec(stmt.text);
      if (pk) table.indexes.push(pk[1]!.split(",").map((s) => s.trim().replace(/"/g, "").toLowerCase()));
      for (const u of stmt.text.matchAll(/unique\s*\(([^)]*)\)/gi)) table.indexes.push(u[1]!.split(",").map((s) => s.trim().replace(/"/g, "").toLowerCase()));
      model.tables.set(key, table);
      break;
    }
    case "drop-table": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (t) t.dropped = true;
      break;
    }
    case "drop-column": {
      model.tables.get(tableKey(c.schema, c.table))?.columns.delete(c.column);
      break;
    }
    case "add-column": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (t) {
        t.columns.set(c.column.name, c.column);
        if (c.column.references) t.foreignKeys.push({ columns: [c.column.name], refTable: c.column.references.table, statement: stmt });
      }
      break;
    }
    case "add-foreign-key": {
      model.tables.get(tableKey(c.schema, c.table))?.foreignKeys.push({ columns: c.columns, refTable: c.refTable, statement: stmt });
      break;
    }
    case "enable-rls": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (t) {
        t.rlsEnabled = true;
        if (c.force) t.rlsForced = true;
      }
      break;
    }
    case "disable-rls": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (t) t.rlsEnabled = false;
      break;
    }
    case "rename": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (!t) break;
      if (c.objectType === "table") {
        model.tables.delete(tableKey(c.schema, c.table));
        t.name = c.to;
        model.tables.set(tableKey(c.schema, c.to), t);
      } else {
        const col = t.columns.get(c.from);
        if (col) {
          t.columns.delete(c.from);
          t.columns.set(c.to, { ...col, name: c.to });
        }
      }
      break;
    }
    case "create-policy": {
      const t = model.tables.get(tableKey(c.schema, c.table));
      if (t) t.policies.set(c.policy, { name: c.policy, command: c.command, roles: c.roles, using: c.using, check: c.check, permissive: c.permissive, statement: stmt });
      break;
    }
    case "drop-policy": {
      model.tables.get(tableKey(c.schema, c.table))?.policies.delete(c.policy);
      break;
    }
    case "create-index": {
      model.tables.get(tableKey(c.schema, c.table))?.indexes.push(c.columns.map((x) => x.toLowerCase()));
      break;
    }
    case "create-function": {
      model.functions.set(`${c.schema}.${c.name}`, { schema: c.schema, name: c.name, securityDefiner: c.securityDefiner, setsSearchPath: c.setsSearchPath, statement: stmt });
      break;
    }
    default:
      break;
  }
  return c;
}

/** Build the final schema model from migrations applied in order. */
export function buildModel(migrations: Migration[]): SchemaModel {
  const model = emptyModel();
  for (const m of migrations) for (const s of m.statements) applyStatement(model, s);
  return model;
}
