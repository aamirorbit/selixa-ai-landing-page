"use client";

import { BookOpen, ChartLine, Crosshair, GitBranch, Map as MapIcon, MessageSquare, Radar, Search, Telescope, TrendingUp, UsersRound, Video } from "lucide-react";
import { Mark } from "@/components/landing/ui";
import { TwoSidesMerge } from "@/components/site/TwoSidesMerge";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.connect;

export function OutsideInside() {
  return (
    <TwoSidesMerge
      id="connect"
      num="03"
      label={C.label}
      title={C.headline}
      left={{
        tag: "Signal",
        mark: <Radar className="h-4 w-4 text-brand-300" strokeWidth={1.75} aria-hidden="true" />,
        question: "What is happening outside?",
        items: [
          { label: "Search", icon: Search },
          { label: "Trends", icon: TrendingUp },
          { label: "Competitors", icon: Crosshair },
          { label: "Communities", icon: UsersRound },
          { label: "Market demand", icon: Radar },
          { label: "Audience behavior", icon: Telescope },
        ],
      }}
      right={{
        tag: "Selixa",
        mark: <Mark className="h-4 w-4 text-fg" />,
        question: "What is happening inside?",
        items: [
          { label: "Customer feedback", icon: MessageSquare },
          { label: "Product analytics", icon: ChartLine },
          { label: "Team conversations", icon: Video },
          { label: "Research", icon: BookOpen },
          { label: "Roadmap", icon: MapIcon },
          { label: "Engineering", icon: GitBranch },
        ],
      }}
      center={{
        eyebrow: "Product intelligence",
        question: "What should we do next?",
        answer: "Build shared play for long-distance couples next.",
        evidence: [
          { source: "Outside", text: "Searches +84%", lit: true },
          { source: "Outside", text: "3× Reddit threads", lit: true },
          { source: "Inside", text: "12 feedback notes" },
          { source: "Inside", text: "Retention dips when partners are apart" },
        ],
      }}
    />
  );
}
