"use client";

import { Palette, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ACTIVE_THEME, isThemeId, THEMES, type ThemeId } from "@/lib/theme";

const STORAGE_KEY = "selixa-theme";

function stored(): ThemeId {
  if (typeof window === "undefined") return ACTIVE_THEME;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isThemeId(saved) ? saved : ACTIVE_THEME;
}

/**
 * Development-only accent switcher: try the themes on the real page, then keep
 * the one you want with NEXT_PUBLIC_SITE_THEME. The choice lives in this
 * browser only — it never reaches the build, the repo, or anyone else.
 *
 * Nothing theme-dependent renders until the panel is opened, so reading
 * localStorage up front can't cause a hydration mismatch.
 */
export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeId>(stored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 print:hidden">
      {open && (
        <div className="panel flex flex-col gap-3 rounded-[14px] p-3 before:hidden">
          <div className="flex items-center gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                title={t.label}
                aria-label={t.label}
                aria-pressed={t.id === theme}
                className={`h-7 w-7 rounded-full border transition-transform duration-150 hover:scale-110 ${
                  t.id === theme ? "scale-110 border-white/70" : "border-white/15"
                }`}
                style={{ background: t.swatch }}
              />
            ))}
          </div>
          <p className="px-0.5 text-[0.6875rem] leading-[1.5] text-fg-3">
            {current.label} — <code className="text-fg-2">NEXT_PUBLIC_SITE_THEME={current.id}</code>
            {theme !== ACTIVE_THEME && (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={() => setTheme(ACTIVE_THEME)}
                  className="underline underline-offset-2 hover:text-fg"
                >
                  back to {ACTIVE_THEME}
                </button>
              </>
            )}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close theme picker" : "Open theme picker"}
        className="grid h-10 w-10 place-items-center rounded-full border border-line-strong bg-bg-2/90 text-fg-2 backdrop-blur transition-colors hover:text-fg"
      >
        {open ? (
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Palette className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
