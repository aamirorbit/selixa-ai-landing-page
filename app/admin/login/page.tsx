import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { LoginForm } from "./LoginForm";

export default async function AdminLogin() {
  if (await isAdminAuthenticated()) redirect("/admin");
  const configured = isAdminConfigured();

  return (
    <div className="flex flex-1 items-center justify-center py-16">
      <section aria-labelledby="login-title" className="panel reveal w-full max-w-[24rem] rounded-[18px] p-7 before:hidden">
        <h1 id="login-title" className="text-[1.5rem] font-medium tracking-[-0.02em]">
          Sign in
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-[1.55] text-fg-2">Inquiries sent through the site, for the Selixa team.</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-[10px] border border-line bg-black/40 p-4 text-[0.9rem] leading-[1.55] text-fg-2">
            Set <code className="text-brand-300">ADMIN_PASSWORD</code> (and optionally{" "}
            <code className="text-brand-300">ADMIN_USERNAME</code>, which defaults to <code className="text-brand-300">admin</code>) in your
            environment — Vercel project settings, or <code className="text-brand-300">.env.local</code> locally — to enable sign-in.
          </p>
        )}
      </section>
    </div>
  );
}
