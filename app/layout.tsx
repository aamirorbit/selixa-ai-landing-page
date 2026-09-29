import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { JsonLd } from "@/components/JsonLd";
import { SchemeScript } from "@/components/SchemeScript";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemePicker } from "@/components/ThemePicker";
import { SCHEME_KEY } from "@/lib/scheme";
import { siteJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { ACTIVE_THEME } from "@/lib/theme";
import "lenis/dist/lenis.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

/** Satoshi Light — hero headline only. Self-hosted from Fontshare (license in app/fonts). */
const satoshi = localFont({
  src: "./fonts/Satoshi-Light.woff2",
  weight: "300",
  style: "normal",
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Selixa — Product intelligence",
  description:
    "Stop guessing what to build next. Selixa connects your customer feedback, product data, team conversations, and engineering work so you know what matters and what to do next.",
  openGraph: {
    title: "Selixa — Product intelligence",
    description:
      "Selixa connects your customer feedback, product data, team conversations, and engineering work so you know what matters and what to do next.",
    siteName: "Selixa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selixa — Product intelligence",
    description: "Stop guessing what to build next.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
  ],
  colorScheme: "dark light",
};

/**
 * Runs before first paint: applies a light/dark choice saved by the footer
 * switch, so a returning visitor never sees the other scheme flash first.
 * With no saved choice, CSS follows the system setting on its own.
 *
 * It also marks <html data-motion="on"> unless the visitor prefers reduced motion, so
 * scroll scenes (components/site/StickyScene.tsx) take their tall, pinned layout before
 * paint, with no jump at hydration, and never without JavaScript.
 */
const applySavedScheme = `try{var s=localStorage.getItem("${SCHEME_KEY}");if(s==="light"||s==="dark")document.documentElement.dataset.scheme=s}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The scheme script above sets data-scheme before React hydrates.
      suppressHydrationWarning
      data-theme={ACTIVE_THEME}
      className={`${inter.variable} ${satoshi.variable} h-full antialiased`}
    >
      <head>
        <SchemeScript code={applySavedScheme} />
        <JsonLd data={siteJsonLd} />
      </head>
      {/* Extensions (e.g. ColorZilla) add attributes to <body> before React loads. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {children}
        <SmoothScroll />
        {/* Accent switcher for picking a theme; never rendered in production. */}
        {process.env.NODE_ENV !== "production" && <ThemePicker />}
      </body>
    </html>
  );
}
