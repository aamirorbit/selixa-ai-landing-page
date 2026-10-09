import "server-only";

type Row = Record<string, unknown>;

/** Minimal query interface shared by the Postgres driver and the local PGlite fallback. */
export type Db = {
  query<T = Row>(text: string, params?: unknown[]): Promise<T[]>;
};

/** One statement per entry: parameterized queries can't carry multiple commands. */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    email text NOT NULL,
    company text NOT NULL DEFAULT '',
    building text NOT NULL,
    problem text NOT NULL DEFAULT '',
    personal_email boolean NOT NULL DEFAULT false,
    source text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'new'
  )`,
  `CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC)`,
  // /get-started answers (idempotent; older rows read as empty).
  `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS site text NOT NULL DEFAULT ''`,
  `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS tools text[] NOT NULL DEFAULT '{}'`,
  `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS pains text[] NOT NULL DEFAULT '{}'`,
  `ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT ''`,
  // First-party analytics (lib/analytics.ts). No IPs, no user agents, no cookies: `visitor` is a
  // hash under a salt that is deleted daily, so it can't be linked across days or reversed.
  `CREATE TABLE IF NOT EXISTS events (
    id bigserial PRIMARY KEY,
    ts timestamptz NOT NULL DEFAULT now(),
    visitor text NOT NULL,
    type text NOT NULL,
    path text NOT NULL DEFAULT '',
    ref text NOT NULL DEFAULT '',
    utm_source text NOT NULL DEFAULT '',
    utm_medium text NOT NULL DEFAULT '',
    utm_campaign text NOT NULL DEFAULT '',
    country text NOT NULL DEFAULT '',
    region text NOT NULL DEFAULT '',
    city text NOT NULL DEFAULT '',
    device text NOT NULL DEFAULT '',
    browser text NOT NULL DEFAULT '',
    os text NOT NULL DEFAULT '',
    label text NOT NULL DEFAULT '',
    href text NOT NULL DEFAULT '',
    x real,
    y real,
    vw integer,
    num integer,
    ms integer
  )`,
  `CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts)`,
  `CREATE INDEX IF NOT EXISTS events_visitor_ts_idx ON events (visitor, ts)`,
  `CREATE TABLE IF NOT EXISTS analytics_salts (
    day date PRIMARY KEY,
    salt text NOT NULL
  )`,
];

let connection: Promise<Db | null> | undefined;

/**
 * Returns the database, creating the schema on first use.
 * - `DATABASE_URL` (or `POSTGRES_URL`) set: any Postgres — Neon, Supabase, Prisma Postgres, Railway, Docker...
 * - Not set, in development: an embedded PGlite database stored in `.data/pglite`.
 * - Not set, in production: `null`, and inquiries fall back to the console / webhook.
 */
export function getDb(): Promise<Db | null> {
  connection ??= connect().catch((err) => {
    connection = undefined;
    throw err;
  });
  return connection;
}

async function connect(): Promise<Db | null> {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  let db: Db;

  if (url) {
    const postgres = (await import("postgres")).default;
    // prepare:false keeps things happy behind PgBouncer-style poolers (Neon, Supabase).
    const sql = postgres(url, { prepare: false, max: 5, idle_timeout: 20, connect_timeout: 10 });
    db = {
      query: async <T,>(text: string, params: unknown[] = []) =>
        (await sql.unsafe(text, params as Parameters<typeof sql.unsafe>[1])) as unknown as T[],
    };
  } else if (process.env.NODE_ENV !== "production") {
    const { PGlite } = await import("@electric-sql/pglite");
    const { mkdir } = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), ".data", "pglite");
    await mkdir(dir, { recursive: true });
    const lite = await PGlite.create(dir);
    db = { query: async <T,>(text: string, params: unknown[] = []) => (await lite.query<T>(text, params)).rows };
    console.warn("[db] DATABASE_URL is not set. Using a local PGlite database at .data/pglite");
  } else {
    return null;
  }

  for (const statement of SCHEMA) await db.query(statement);
  return db;
}
