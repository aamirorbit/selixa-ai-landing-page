import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: "Inquiries — Selixa admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-[1536px] flex-1 flex-col px-6 sm:px-10 lg:px-12 xl:px-[57px]">
        <header className="flex items-center justify-between pt-5 sm:pt-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
            <span className="text-[0.8125rem] tracking-[0.08em] text-fg-3 uppercase">Admin</span>
          </div>
          <AdminNav />
        </header>
        {children}
      </div>
    </main>
  );
}
