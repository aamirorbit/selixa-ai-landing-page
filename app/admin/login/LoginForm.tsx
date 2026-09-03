"use client";

import { ArrowUpRight, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {} as LoginState);
  const invalid = state.error ? true : undefined;
  return (
    <form action={action} className="mt-6 flex flex-col gap-3">
      <label className="sr-only" htmlFor="admin-username">
        Username
      </label>
      <input
        id="admin-username"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Username"
        defaultValue={state.username}
        required
        autoFocus
        aria-invalid={invalid}
        className="field !pr-4"
      />
      <label className="sr-only" htmlFor="admin-password">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Password"
        required
        aria-invalid={invalid}
        className="field !pr-4"
      />
      {state.error && (
        <p role="alert" className="text-[0.875rem] text-red-300/90">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary mt-1">
        {pending ? (
          <>
            Signing in
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            Sign in
            <ArrowUpRight className="arrow h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
