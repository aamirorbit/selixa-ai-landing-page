"use client";

import { ChartLine, Compass, ListChecks, Map as MapIcon, Radar, Rocket, Sparkles, Telescope } from "lucide-react";
import { StepTrack, type TrackStep } from "@/components/site/StepTrack";
import { SIGNAL_COPY } from "./copy";

const C = SIGNAL_COPY.decision;

// One opportunity carried the whole way. Where Selixa has a page for the step, it links there.
const STEPS: TrackStep[] = [
  { label: "Market signals", artifact: "4 sources rising", icon: Radar, group: 0 },
  { label: "Opportunity", artifact: "Long-distance play", icon: Sparkles, group: 0 },
  { label: "Research", artifact: "9 interviews, 3 competitors", icon: Telescope, href: "/product/research", group: 1 },
  { label: "Priority", artifact: "#1 this quarter", icon: Compass, href: "/product/priorities", group: 1 },
  { label: "Roadmap", artifact: "Moved to Now", icon: MapIcon, href: "/product/roadmap", group: 1 },
  { label: "Tasks", artifact: "14 tasks in Linear", icon: ListChecks, href: "/product/tasks", group: 1 },
  { label: "Ship", artifact: "Released Nov 18", icon: Rocket, group: 1 },
  { label: "Measure", artifact: "Activation +11%", icon: ChartLine, href: "/product/analytics", group: 1 },
];

export function SignalToShip() {
  return <StepTrack id="decision" num="05" label={C.label} title={C.headline} lead={C.line} steps={STEPS} groups={["Signal", "Selixa"]} />;
}
