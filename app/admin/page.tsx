import { LogOut } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { countInquiries, isDatabaseConfigured, isStatus, listInquiries, type Inquiry, type InquiryStatus } from "@/lib/inquiries";
import { BrandMark } from "@/components/landing/BrandMark";
import { painLabel, roleLabel, sourceTag, toolLogo } from "@/lib/onboarding";
import { logout, updateStatus } from "./actions";

const TABS: { key: InquiryStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "archived", label: "Archived" },
];

export default async function AdminInquiries(props: PageProps<"/admin">) {
  await requireAdmin();
  const params = await props.searchParams;
  const raw = Array.isArray(params.status) ? params.status[0] : params.status;
  const filter: InquiryStatus | undefined = isStatus(raw) ? raw : undefined;

  const [configured, counts, inquiries] = await Promise.all([
    isDatabaseConfigured(),
    countInquiries(),
    listInquiries(filter),
  ]);
  const total = counts.new + counts.contacted + counts.archived;

  return (
    <div className="flex flex-1 flex-col pb-16 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[2.5rem] font-light leading-none tracking-[-0.04em] text-fg sm:text-[3rem]">Inquiries</h1>
          <p className="mt-3 text-[1rem] text-fg-2">Everything sent through the form, newest first.</p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-ghost">
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>

      <nav aria-label="Filter by status" className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = (t.key === "all" && !filter) || t.key === filter;
          const n = t.key === "all" ? total : counts[t.key];
          return (
            <Link
              key={t.key}
              href={t.key === "all" ? "/admin" : `/admin?status=${t.key}`}
              aria-current={active ? "page" : undefined}
              className={`tab ${active ? "tab-active" : ""}`}
            >
              {t.label}
              <span className="tab-count">{n}</span>
            </Link>
          );
        })}
      </nav>

      {!configured && (
        <p className="mt-6 rounded-[12px] border border-amber-400/25 bg-amber-400/5 px-4 py-3 text-[0.9rem] leading-[1.55] text-amber-200/90">
          No database is configured, so nothing is being recorded. Add a Postgres database on Vercel (Neon, Supabase, or
          Prisma Postgres) so <code>DATABASE_URL</code> is set, then redeploy.
        </p>
      )}

      <div className="panel mt-6 overflow-hidden rounded-[16px] before:hidden">
        {inquiries.length === 0 ? (
          <p className="px-6 py-14 text-center text-[0.9375rem] text-fg-3">
            {filter ? `Nothing marked “${filter}” yet.` : "No inquiries yet. They’ll appear here as they come in."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[72rem] border-collapse text-left text-[0.9rem]">
              <thead>
                <tr className="text-[0.75rem] tracking-[0.06em] text-fg-3 uppercase">
                  <th className="th">Received</th>
                  <th className="th">Contact</th>
                  <th className="th">Product</th>
                  <th className="th w-[18%]">Context</th>
                  <th className="th w-[24%]">Building</th>
                  <th className="th w-[18%]">Problem</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((i) => (
                  <Row key={i.id} inquiry={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ inquiry: i }: { inquiry: Inquiry }) {
  return (
    <tr className="row">
      <td className="td whitespace-nowrap align-top">
        <time dateTime={i.createdAt.toISOString()} title={i.createdAt.toLocaleString("en-GB")} className="text-fg">
          {timeAgo(i.createdAt)}
        </time>
        <div className="mt-0.5 text-[0.75rem] text-fg-3">{i.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
        {sourceTag(i.source) && <div className="mt-1 text-[0.6875rem] text-fg-3">{sourceTag(i.source)}</div>}
      </td>
      <td className="td align-top">
        <div className="font-medium text-fg">{i.name}</div>
        <a href={`mailto:${i.email}`} className="text-fg-2 underline-offset-2 hover:underline">
          {i.email}
        </a>
        {i.role && <div className="mt-0.5 text-[0.75rem] text-fg-3">{roleLabel(i.role)}</div>}
        {i.personalEmail && <div className="mt-0.5 text-[0.75rem] text-warn">Personal email</div>}
      </td>
      <td className="td align-top text-fg-2">
        {i.site ? (
          <a href={`https://${i.site}`} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {i.site}
          </a>
        ) : (
          i.company || <span className="text-fg-3">—</span>
        )}
      </td>
      <td className="td align-top">
        <Context tools={i.tools} pains={i.pains} />
      </td>
      <td className="td align-top">{i.building ? <Expandable text={i.building} /> : <span className="text-fg-3">—</span>}</td>
      <td className="td align-top">{i.problem ? <Expandable text={i.problem} /> : <span className="text-fg-3">—</span>}</td>
      <td className="td align-top">
        <span className={`status status-${i.status}`}>{i.status}</span>
      </td>
      <td className="td align-top">
        <div className="flex justify-end gap-2">
          {i.status !== "contacted" && <StatusButton id={i.id} status="contacted" label="Mark contacted" />}
          {i.status !== "archived" && <StatusButton id={i.id} status="archived" label="Archive" />}
          {i.status !== "new" && <StatusButton id={i.id} status="new" label="Back to new" />}
        </div>
      </td>
    </tr>
  );
}

/** Tool marks (unlit) and pain tags from /get-started. */
function Context({ tools, pains }: { tools: string[]; pains: string[] }) {
  if (!tools.length && !pains.length) return <span className="text-fg-3">—</span>;
  return (
    <div className="flex flex-col gap-2">
      {tools.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tools.map((t) => {
            const logo = toolLogo(t);
            if (logo)
              return (
                <span key={t} title={logo.name}>
                  <BrandMark logo={logo} lit={false} className="h-3.5 w-3.5" />
                </span>
              );
            const other = t.startsWith("other:") ? t.slice(6) : "+";
            return (
              <span key={t} className="tag px-1.5 py-0 text-[0.6875rem]">
                {other}
              </span>
            );
          })}
        </div>
      )}
      {pains.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pains.map((p) => (
            <span key={p} className="tag px-1.5 py-0 text-[0.6875rem]">
              {painLabel(p)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusButton({ id, status, label }: { id: string; status: InquiryStatus; label: string }) {
  return (
    <form action={updateStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="btn-ghost btn-ghost-sm">
        {label}
      </button>
    </form>
  );
}

function Expandable({ text }: { text: string }) {
  if (text.length <= 140) return <p className="leading-[1.5] text-fg-2">{text}</p>;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none leading-[1.5] text-fg-2 marker:content-none">
        <span className="group-open:hidden">{text.slice(0, 140).trimEnd()}… </span>
        <span className="text-brand-300 group-open:hidden">more</span>
        <span className="hidden group-open:inline">{text} </span>
        <span className="hidden text-brand-300 group-open:inline">less</span>
      </summary>
    </details>
  );
}

function timeAgo(date: Date): string {
  const s = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
