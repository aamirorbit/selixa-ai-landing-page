"use client";

import { Search, SearchX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ConversationCTA, type ConversationCTAHandle } from "@/components/ConversationCTA";
import { CATEGORIES, INTEGRATIONS, type Integration, type IntegrationCategory } from "@/lib/content/integrations";
import { Kbd } from "../Kbd";
import { IntegrationTile } from "./IntegrationTile";
import { logoOf } from "./look";

/**
 * The integrations directory's search: a field, category chips and the grid of tiles, sharing
 * state. Typing filters keystroke by keystroke (every word must match), the top result comes
 * first and is lit, Enter opens it. ⌘K / Ctrl+K / "/" focus the field (this page only), ↓ walks
 * into the grid, arrows move in 2-D, typing on a tile keeps searching.
 *
 * The field looks ready (an idle blinking caret) but never takes focus by itself.
 */

export type SearchCopy = {
  placeholder: string;
  label: string;
  hint: string;
  /** "{n} integrations" / "1 integration" */
  countMany: string;
  countOne: string;
  all: string;
  /** Before and after the quoted query: No match for "{query}". */
  emptyBefore: string;
  emptyAfter: string;
  emptyLink: string;
  requestPrefix: string;
  request: { href: string; title: string; body: string };
};

type Props = {
  copy: SearchCopy;
  /** 404: field + the top four results, small tiles, no chips, no URL sync. */
  compact?: boolean;
  /** Attach the page-wide ⌘K / "/" shortcuts (one search per page). Default true. */
  shortcuts?: boolean;
};

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
const HAY = new Map(INTEGRATIONS.map((i) => [i.slug, fold([i.name, i.category, i.job, ...(i.keywords ?? []), ...i.reads, ...i.writes].join(" "))]));

function rank(i: Integration, q: string) {
  const name = fold(i.name);
  if (name.startsWith(q)) return 1;
  if (name.split(/\s+/).some((w) => w.startsWith(q))) return 2;
  // Keywords ("pr" → GitHub, "ticket" → Jira/Linear) rank with names.
  if ((i.keywords ?? []).some((k) => fold(k).split(/\s+/).some((w) => w.startsWith(q)))) return 2;
  if (fold(i.category).startsWith(q)) return 3;
  return 4;
}

function results(query: string, category: IntegrationCategory | null) {
  const q = fold(query.trim());
  const tokens = q.split(/\s+/).filter(Boolean);
  return INTEGRATIONS.map((i, order) => ({ i, order }))
    .filter(({ i }) => (!category || i.category === category) && tokens.every((t) => HAY.get(i.slug)!.includes(t)))
    .sort((a, b) => (q ? rank(a.i, q) - rank(b.i, q) : 0) || a.order - b.order)
    .map(({ i }) => i);
}

/** ⌘K on Apple platforms, Ctrl K elsewhere (server renders ⌘K). */
const isMac = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
const noop = () => () => {};

export function IntegrationSearch({ copy, compact = false, shortcuts = true }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<IntegrationCategory | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const [minH, setMinH] = useState<number | undefined>(undefined);
  const mac = useSyncExternalStore(noop, isMac, () => true);

  const field = useRef<HTMLInputElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const cols = useRef(4);
  const tiles = useRef(new Map<string, HTMLAnchorElement>());
  const request = useRef<ConversationCTAHandle>(null);
  const hintId = useId();

  const shown = useMemo(() => {
    const r = results(query, category);
    return compact ? r.slice(0, 5) : r;
  }, [query, category, compact]);
  const filtering = query.trim() !== "" || category !== null;
  const top = query.trim() ? shown[0]?.slug : undefined;
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map((c) => [c, INTEGRATIONS.filter((i) => i.category === c).length])), []);

  // Read ?q= and ?category= once (e.g. arriving from the 404 page).
  useEffect(() => {
    if (compact) return;
    const t = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      const c = params.get("category");
      if (q) setQuery(q);
      const match = CATEGORIES.find((x) => x.toLowerCase() === c?.toLowerCase());
      if (match) setCategory(match);
    });
    return () => window.clearTimeout(t);
  }, [compact]);

  // Mirror the state in the URL (no history entries), and announce the count, 300ms after the last change.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setAnnounce(shown.length === 1 ? copy.countOne : copy.countMany.replace("{n}", String(shown.length)));
      if (compact) return;
      const url = new URL(window.location.href);
      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");
      if (category) url.searchParams.set("category", category.toLowerCase());
      else url.searchParams.delete("category");
      window.history.replaceState(window.history.state, "", url);
    }, 300);
    return () => window.clearTimeout(t);
  }, [query, category, shown.length, compact, copy]);

  // The grid keeps its unfiltered height, so the sections below never move while typing;
  // columns are cached for arrow-key moves.
  const filteringRef = useRef(filtering);
  useEffect(() => {
    filteringRef.current = filtering;
  }, [filtering]);
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      cols.current = getComputedStyle(el).gridTemplateColumns.split(" ").length;
      if (!filteringRef.current && !compact) setMinH(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  // Page-wide shortcuts: ⌘K / Ctrl+K, and "/" (unless typing somewhere else).
  useEffect(() => {
    if (!shortcuts) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const cmdK = k === "k" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey;
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName));
      const slash = e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey;
      if (!cmdK && !slash) return;
      e.preventDefault();
      const el = field.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 88 || r.bottom > window.innerHeight) window.scrollTo({ top: window.scrollY + r.top - 96, behavior: "smooth" });
      el.focus({ preventScroll: true });
      el.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);

  const focusTile = (i: number) => tiles.current.get(shown[Math.max(0, Math.min(shown.length - 1, i))]?.slug)?.focus();

  const onFieldKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && shown.length) {
      e.preventDefault();
      focusTile(0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (shown[0] && (query.trim() || category)) router.push(`/integrations/${shown[0].slug}`);
      else if (query.trim() && !shown.length) request.current?.open({ problem: `${copy.requestPrefix}${query.trim()}` });
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else field.current?.blur();
    }
  };

  const onTileKey = (idx: number) => (e: KeyboardEvent<HTMLAnchorElement>) => {
    const c = cols.current;
    const move: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: c, ArrowUp: -c };
    if (e.key in move) {
      e.preventDefault();
      const next = idx + move[e.key];
      // Up from the first row goes back to the field; no wrapping at row ends.
      if (next < 0 && e.key === "ArrowUp") return field.current?.focus();
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && Math.floor(next / c) !== Math.floor(idx / c)) return;
      if (next >= 0 && next < shown.length) focusTile(next);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      focusTile(e.key === "Home" ? 0 : shown.length - 1);
    } else if (e.key === "Escape") {
      field.current?.focus();
    } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== " " && e.key !== "/") {
      // Typing on a tile keeps searching.
      e.preventDefault();
      setQuery((q) => q + e.key);
      field.current?.focus();
    }
  };

  const hasText = query.length > 0;

  return (
    <div className={`flex flex-col items-center ${compact ? "relative mx-auto w-full max-w-[26rem]" : ""}`}>
      {/* The field */}
      <div className={`search-field relative w-full max-w-[40rem] ${compact ? "h-12" : "h-14 sm:h-16"}`}>
        <Search className="ml-5 h-5 w-5 shrink-0 text-fg-3 transition-colors duration-200 [.search-field:focus-within_&]:text-fg-2" strokeWidth={1.75} aria-hidden="true" />
        <span className="relative flex h-full min-w-0 flex-1 items-center">
          <span aria-hidden="true" className="search-caret pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <span className="caret" />
          </span>
          <input
            ref={field}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onFieldKey}
            placeholder={copy.placeholder}
            aria-label={copy.label}
            aria-controls="integrations-grid"
            aria-describedby={hintId}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-full w-full min-w-0 bg-transparent px-3 text-[1.0625rem] text-fg outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:appearance-none"
          />
        </span>
        <span className="mr-4 grid w-[4.5rem] shrink-0 justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
          <span className={`transition-opacity duration-150 [@media(pointer:coarse)]:hidden ${hasText ? "opacity-0" : "opacity-100"}`} aria-hidden="true">
            {/* Only where the shortcut works */}
            {shortcuts && <Kbd>{mac ? copy.hint : copy.hint.replace("⌘", "Ctrl ")}</Kbd>}
          </span>
          <span className={`flex items-center gap-2 transition-opacity duration-150 ${hasText ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            {shown.length > 0 && (
              <span className="hidden opacity-0 transition-opacity duration-150 [@media(pointer:fine)]:inline [.search-field:focus-within_&]:opacity-100" aria-hidden="true">
                <Kbd>↵</Kbd>
              </span>
            )}
            <button
              type="button"
              aria-label="Clear search"
              tabIndex={hasText ? 0 : -1}
              onClick={() => {
                setQuery("");
                field.current?.focus();
              }}
              className="grid h-7 w-7 place-items-center rounded-full text-fg-3 transition-colors hover:bg-ink/[0.06] hover:text-fg"
            >
              <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </span>
        </span>
      </div>
      <p id={hintId} className="sr-only">
        Type to filter. Press down arrow to move into the results.
      </p>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {/* Category chips */}
      {!compact && (
        <div
          role="group"
          aria-label="Filter by category"
          className="chip-row -mx-5 mt-5 flex w-[calc(100%+2.5rem)] snap-x scroll-px-5 gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:[mask-image:none] sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {[null, ...CATEGORIES].map((c) => {
            const on = category === c;
            const n = c ? counts[c] : INTEGRATIONS.length;
            return (
              <button
                key={c ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setCategory(on || c === null ? null : c)}
                className={`flex h-9 shrink-0 snap-start items-center rounded-full border px-3.5 text-[0.875rem] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400/60 ${
                  on ? "border-brand-400/40 bg-brand-500/10 text-fg" : "border-line bg-ink/[0.02] text-fg-2 hover:border-line-strong hover:text-fg"
                }`}
              >
                {c ?? copy.all}
                <span className={`ml-1.5 tabular-nums ${on ? "text-brand-300" : "text-fg-3"}`}>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Results: the grid (directory), or a dropdown over the page (compact: the 404) */}
      {compact ? (
        query.trim() && (
          <div className="window absolute inset-x-0 top-full z-30 mt-2 rounded-[14px]! p-2 text-left">
            {shown.length ? (
              <ul ref={grid} id="integrations-grid" className="grid grid-cols-1 gap-1.5">
                {shown.map((i, idx) => (
                  <li key={i.slug}>
                    <IntegrationTile
                      integration={i}
                      logo={logoOf(i)}
                      size="sm"
                      lit={active ? active === i.slug : top === i.slug}
                      onActive={(on) => setActive((a) => (on ? i.slug : a === i.slug ? null : a))}
                      onKeyDown={onTileKey(idx)}
                      ref={(el) => {
                        if (el) tiles.current.set(i.slug, el);
                        else tiles.current.delete(i.slug);
                      }}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-3 text-[0.9375rem] text-fg-2">
                {copy.emptyBefore}
                <span className="text-fg">{query.trim()}</span>
                {copy.emptyAfter}
              </p>
            )}
          </div>
        )
      ) : (
        <div id="all" className="relative mt-10 w-full max-w-[64rem]" style={{ minHeight: filtering ? minH : undefined }}>
          <ul ref={grid} id="integrations-grid" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {shown.map((i, idx) => (
              <li key={i.slug} className="appear" style={{ animationDuration: "160ms" }}>
                <IntegrationTile
                  integration={i}
                  logo={logoOf(i)}
                  lit={active ? active === i.slug : top === i.slug}
                  onActive={(on) => setActive((a) => (on ? i.slug : a === i.slug ? null : a))}
                  onKeyDown={onTileKey(idx)}
                  ref={(el) => {
                    if (el) tiles.current.set(i.slug, el);
                    else tiles.current.delete(i.slug);
                  }}
                />
              </li>
            ))}
            {!filtering && (
              <li>
                <IntegrationTile variant="request" {...copy.request} />
              </li>
            )}
          </ul>

          {shown.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <SearchX className="h-5 w-5 text-fg-3" strokeWidth={1.75} aria-hidden="true" />
              <p className="text-[1rem] text-fg-2">
                {copy.emptyBefore}
                <span className="text-fg">{query.trim()}</span>
                {copy.emptyAfter}
              </p>
              <ConversationCTA
                ref={request}
                variant="link"
                defaults={{ problem: `${copy.requestPrefix}${query.trim()}` }}
                focus="problem"
                label={copy.emptyLink}
                className="link-arrow cursor-pointer text-[0.9375rem]"
              >
                {copy.emptyLink} →
              </ConversationCTA>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
