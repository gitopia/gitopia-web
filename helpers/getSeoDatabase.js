import path from "path";
import knex from "knex";

const dbPath = path.join(process.cwd(), "seo/db.sqlite3");
const db = knex({
  client: "better-sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  migrations: {
    tableName: "knex_migrations",
  },
});

export default db;