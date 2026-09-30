"use client";

import {
  AudioLines,
  Crosshair,
  Lightbulb,
  MessagesSquare,
  Mic,
  Phone,
  Radar,
  Search,
  TrendingUp,
  UsersRound,
  Video,
} from "lucide-react";
import { TwoSidesMerge } from "@/components/site/TwoSidesMerge";
import { CAPTURE_COPY } from "./copy";

const C = CAPTURE_COPY;

/** Human signals meeting market signals in one answer. */
export function WithSignal() {
  return (
    <TwoSidesMerge
      id="with-signal"
      num="04"
      label={C.connect.label}
      title={C.connect.headline}
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
        ],
      }}
      right={{
        tag: "Capture",
        mark: <AudioLines className="h-4 w-4 text-brand-300" strokeWidth={1.75} aria-hidden="true" />,
        question: "What are people telling you?",
        items: [
          { label: "Conversations", icon: MessagesSquare },
          { label: "Calls", icon: Phone },
          { label: "Interviews", icon: Video },
          { label: "Voice notes", icon: Mic },
          { label: "Ideas", icon: Lightbulb },
        ],
      }}
      center={{
        eyebrow: "Product intelligence",
        question: "Is this worth building?",
        verdict: "High-confidence opportunity",
        answer: "AI-assisted product prioritization.",
        evidence: [
          { source: "Market", text: "Search demand ↑", lit: true },
          { source: "People", text: "8 conversations, same problem" },
          { source: "Customers", text: "3 asked for it" },
          { source: "Competitors", text: "2 launched something close", lit: true },
        ],
      }}
    />
  );
}

