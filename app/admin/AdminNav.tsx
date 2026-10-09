"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Inquiries" },
  { href: "/admin/analytics", label: "Analytics" },
];

/** Switches between the admin areas; hidden on the sign-in page. */
export function AdminNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/login")) return null;
  return (
    <nav aria-label="Admin" className="flex gap-1.5">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={`tab py-1.5 ${active ? "tab-active" : ""}`}>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
