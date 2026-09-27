"use client";

import { Moon, Sun, type LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";
import { SCHEME_KEY } from "@/lib/scheme";

type Choice = "light" | "dark";

const OPTIONS: { id: Choice; label: string; icon: LucideIcon }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
];

const EVENT = "selixa-scheme-change";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

/** The scheme on screen: the visitor's saved pick, or else whatever their system uses. */
function read(): Choice {
  const saved = document.documentElement.dataset.scheme;
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(LIGHT_QUERY);
  window.addEventListener(EVENT, onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

function choose(scheme: Choice) {
  document.documentElement.dataset.scheme = scheme;
  try {
    localStorage.setItem(SCHEME_KEY, scheme);
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Light / Dark. Until someone picks, it shows (and follows) their system's setting. */
export function SchemeSwitch() {
  // The server can't know the visitor's system, so it renders dark; the browser corrects it right away.
  const current = useSyncExternalStore(subscribe, read, () => "dark" as Choice);

  return (
    <div role="radiogroup" aria-label="Colour scheme" className="inline-flex items-center gap-0.5 rounded-full border border-line bg-ink/[0.02] p-1">
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const active = current === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => choose(id)}
            className={`grid h-8 w-8 place-items-center rounded-full transition-colors duration-200 ${
              active ? "bg-ink/[0.09] text-fg" : "text-fg-3 hover:text-fg"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
