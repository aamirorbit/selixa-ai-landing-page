import "server-only";
import { getDb } from "./db";

export const STATUSES = ["new", "contacted", "archived"] as const;
export type InquiryStatus = (typeof STATUSES)[number];

export type Inquiry = {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  company: string;
  building: string;
  problem: string;
  personalEmail: boolean;
  source: string;
  status: InquiryStatus;
  /** From /get-started: normalized domain ("acme.com") or "". */
  site: string;
  /** Tool slugs; "Something else" is "other:<name>" or "other". */
  tools: string[];
  /** Pain keys, 0–3. */
  pains: string[];
  /** Role key or "". */
  role: string;
};

export type NewInquiry = Omit<Inquiry, "id" | "createdAt" | "status">;

type InquiryRow = {
  id: string;
  created_at: string | Date;
  name: string;
  email: string;
  company: string;
  building: string;
  problem: string;
  personal_email: boolean;
  source: string;
  status: string;
  site: string | null;
  tools: string[] | null;
  pains: string[] | null;
  role: string | null;
};

const COLUMNS = "id, created_at, name, email, company, building, problem, personal_email, source, status, site, tools, pains, role";

const fromRow = (r: InquiryRow): Inquiry => ({
  id: r.id,
  createdAt: new Date(r.created_at),
  name: r.name,
  email: r.email,
  company: r.company,
  building: r.building,
  problem: r.problem,
  personalEmail: r.personal_email,
  source: r.source,
  status: (STATUSES as readonly string[]).includes(r.status) ? (r.status as InquiryStatus) : "new",
  site: r.site ?? "",
  tools: r.tools ?? [],
  pains: r.pains ?? [],
  role: r.role ?? "",
});

export function isStatus(value: unknown): value is InquiryStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

/** Stores an inquiry. Resolves to the new id, or null when no database is configured. */
export async function saveInquiry(input: NewInquiry): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db.query<{ id: string }>(
    `INSERT INTO inquiries (name, email, company, building, problem, personal_email, source, site, tools, pains, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
    [input.name, input.email, input.company, input.building, input.problem, input.personalEmail, input.source, input.site, input.tools, input.pains, input.role],
  );
  return row.id;
}

export async function listInquiries(status?: InquiryStatus): Promise<Inquiry[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = status
    ? await db.query<InquiryRow>(`SELECT ${COLUMNS} FROM inquiries WHERE status = $1 ORDER BY created_at DESC LIMIT 500`, [status])
    : await db.query<InquiryRow>(`SELECT ${COLUMNS} FROM inquiries ORDER BY created_at DESC LIMIT 500`);
  return rows.map(fromRow);
}

export async function countInquiries(): Promise<Record<InquiryStatus, number>> {
  const counts: Record<InquiryStatus, number> = { new: 0, contacted: 0, archived: 0 };
  const db = await getDb();
  if (!db) return counts;
  const rows = await db.query<{ status: string; count: string | number }>(
    `SELECT status, count(*)::int AS count FROM inquiries GROUP BY status`,
  );
  for (const r of rows) if (isStatus(r.status)) counts[r.status] = Number(r.count);
  return counts;
}

export async function setInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.query(`UPDATE inquiries SET status = $2 WHERE id = $1`, [id, status]);
}

export async function isDatabaseConfigured(): Promise<boolean> {
  return (await getDb()) !== null;
}
