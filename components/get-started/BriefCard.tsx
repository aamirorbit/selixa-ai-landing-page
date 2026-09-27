import { Globe, Lock, Plus } from "lucide-react";
import type { CSSProperties } from "react";
import { BrandMark } from "@/components/landing/BrandMark";
import { PAIN_OPTIONS, ROLE_OPTIONS, toolLogo } from "@/lib/onboarding";
import { GS } from "./copy";

const B = GS.brief;

export type BriefData = {
  domain: string;
  tools: string[];
  pains: string[];
  name: string;
  role: string;
  /** Steps skipped with nothing picked show "None picked". */
  toolsSkipped: boolean;
  painsSkipped: boolean;
  sealed: boolean;
};

/** A value arriving on the card: a short fade + rise (opacity/transform, not scroll-linked). */
const enter: CSSProperties = { animation: "brief-in 220ms var(--ease-out-expo) both" };

function StateTag({ sealed }: { sealed: boolean }) {
  return (
    <span className="grid justify-items-end [&>*]:col-start-1 [&>*]:row-start-1">
      <span className={`tag transition-opacity duration-200 ${sealed ? "opacity-0" : "opacity-100"}`}>{B.draft}</span>
      <span className={`tag border-brand-400/30 bg-brand-500/10 text-brand-200 transition-opacity duration-200 ${sealed ? "opacity-100" : "opacity-0"}`}>
        <Lock className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
        {B.isolated}
      </span>
    </span>
  );
}

/**
 * The product brief that builds beside the questions: the site becomes its title, tools their
 * marks, pains tags; on done it seals with the Isolated lock. Only ever what the visitor typed or
 * tapped. Fixed height (every row always present); a mirror of the form, so aria-hidden.
 */
export function BriefCard({ data, compact }: { data: BriefData; compact?: boolean }) {
  const role = ROLE_OPTIONS.find((r) => r.key === data.role)?.label;
  const pains = data.pains.map((k) => PAIN_OPTIONS.find((p) => p.key === k)?.label ?? k);

  if (compact) {
    return (
      <div aria-hidden="true" className="card flex h-14 items-center gap-3 rounded-[14px]! px-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-ink/[0.06] text-[0.75rem] uppercase text-fg-2">
          {data.domain ? data.domain[0] : <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />}
        </span>
        <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-fg">{data.domain || <span className="inline-block h-2 w-24 rounded-full bg-ink/[0.07] align-middle" />}</span>
        <span className="flex items-center gap-1.5">
          {data.tools.slice(0, 3).map((t) => (
            <span key={t} className="grid h-4 w-4 place-items-center [&_svg]:h-4 [&_svg]:w-4" style={enter}>
              {toolLogo(t) ? <BrandMark logo={toolLogo(t)!} lit className="h-4 w-4" /> : <Plus className="h-3 w-3 text-fg-3" strokeWidth={2} />}
            </span>
          ))}
          {data.tools.length > 3 && <span className="text-[0.75rem] text-fg-3">+{data.tools.length - 3}</span>}
        </span>
        {data.sealed ? (
          <span className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
            <Lock className="h-3 w-3" strokeWidth={2} />
          </span>
        ) : (
          <span className="tag tabular-nums">{data.pains.length}/3</span>
        )}
      </div>
    );
  }

  const slots = 7;
  const shown = data.tools.length > slots ? data.tools.slice(0, slots - 1) : data.tools;

  return (
    <div aria-hidden="true">
      <div className="window relative overflow-visible! rounded-[20px]! p-6">
        <span className={`card-lit pointer-events-none absolute inset-0 rounded-[20px] border transition-opacity duration-[400ms] ${data.sealed ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: data.sealed ? "120ms" : "0ms" }} />
        <span className="seal-ring [--seal-r:20px]" data-on={data.sealed} style={{ transitionDelay: data.sealed ? "200ms" : "0ms" }} />

        {/* Website */}
        <div className="relative flex h-11 items-center gap-3">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-ink/[0.06] text-[0.8125rem] uppercase text-fg-2">
            {data.domain ? data.domain[0] : <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />}
          </span>
          <span className="min-w-0 flex-1">
            {data.domain ? (
              <span key={data.domain} style={enter} className="block truncate text-[1.0625rem] text-fg">
                {data.domain}
              </span>
            ) : data.sealed ? (
              <span className="block text-[0.9375rem] text-fg-3">{B.noSite}</span>
            ) : (
              <span className="block h-2 w-[55%] rounded-full bg-ink/[0.07]" />
            )}
          </span>
          <StateTag sealed={data.sealed} />
        </div>
        <p className="relative mt-0.5 pl-10 text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{B.website}</p>

        {/* Tools */}
        <div className="relative mt-4 border-t border-line pt-4">
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{B.tools}</p>
          <div className="mt-2.5 flex h-10 items-center gap-2">
            {data.toolsSkipped && !data.tools.length ? (
              <span className="text-[0.8125rem] text-fg-3">{B.none}</span>
            ) : (
              <>
                {shown.map((t) => (
                  <span key={t} className="grid h-6 w-6 place-items-center [&_svg]:h-6 [&_svg]:w-6" style={enter}>
                    {toolLogo(t) ? (
                      <BrandMark logo={toolLogo(t)!} lit className="h-6 w-6" duration={200} />
                    ) : (
                      <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-ink/[0.06] text-fg-3">
                        <Plus className="h-3 w-3" strokeWidth={2} />
                      </span>
                    )}
                  </span>
                ))}
                {data.tools.length > slots && <span className="grid h-6 w-6 place-items-center text-[0.75rem] text-fg-3">+{data.tools.length - (slots - 1)}</span>}
                {Array.from({ length: Math.max(0, slots - Math.min(slots, data.tools.length)) }, (_, k) => (
                  <span key={`e${k}`} className="h-6 w-6 rounded-[6px] border border-dashed border-line" />
                ))}
              </>
            )}
          </div>
        </div>

        {/* On fire */}
        <div className="relative mt-4 border-t border-line pt-4">
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{B.onFire}</p>
          <div className="mt-2.5 flex h-[72px] flex-wrap content-start gap-1.5 overflow-clip">
            {data.painsSkipped && !pains.length ? (
              <span className="text-[0.8125rem] text-fg-3">{B.none}</span>
            ) : (
              <>
                {pains.map((p) => (
                  <span key={p} style={enter} className="tag border-brand-400/30 bg-brand-500/10 text-brand-200">
                    {p}
                  </span>
                ))}
                {Array.from({ length: Math.max(0, 3 - pains.length) }, (_, k) => (
                  <span key={`e${k}`} className="h-[26px] w-[88px] rounded-full bg-ink/[0.05]" />
                ))}
              </>
            )}
          </div>
        </div>

        {/* You */}
        <div className="relative mt-2 border-t border-line pt-4">
          <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-fg-3">{B.you}</p>
          <div className="mt-2 flex h-10 items-center">
            {data.name.trim() ? (
              <span className="truncate text-[0.9375rem] text-fg-2">
                {data.name.trim()}
                {role && ` · ${role}`}
              </span>
            ) : (
              <span className="h-2 w-[40%] rounded-full bg-ink/[0.07]" />
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.8125rem] text-fg-3">{data.sealed ? B.doneCaption(data.domain) : B.caption}</p>
    </div>
  );
}
