import { Briefcase, ChartLine, Code, Eye, FlaskConical, Headphones, Layers, PenTool, Rocket, User, Users, Workflow, type LucideIcon } from "lucide-react";

/** One icon per use case (by slug), shared by the header menu, /use-cases and each use-case page. */
export const USE_CASE_ICONS: Record<string, LucideIcon> = {
  "solo-founders": User,
  "lean-startups": Rocket,
  "product-managers": Users,
  "multi-product-founders": Layers,
  "heads-of-product": Eye,
  "engineering-leads": Code,
  "design-teams": PenTool,
  "product-led-saas": ChartLine,
  "customer-success": Headphones,
  "product-ops": Workflow,
  "agencies-and-studios": Briefcase,
  "venture-studios": FlaskConical,
};

export const iconForUseCase = (slug: string): LucideIcon => USE_CASE_ICONS[slug] ?? User;
