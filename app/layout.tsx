import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { ThemePicker } from "@/components/ThemePicker";
import { ACTIVE_THEME } from "@/lib/theme";
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
  metadataBase: new URL("https://selixa.ai"),
  title: "Selixa — Forward Deployed Intelligence",
  description:
    "Selixa works with a select group of teams to solve high-impact problems with AI. Private deployments, by invitation only. We don't just build. We own the outcome.",
  openGraph: {
    title: "Selixa — Forward Deployed Intelligence",
    description:
      "AI systems that own the outcome. Selixa works with a select group of teams to solve high-impact problems with AI.",
    siteName: "Selixa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selixa — Forward Deployed Intelligence",
    description: "AI systems that own the outcome.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={ACTIVE_THEME}
      className={`${inter.variable} ${satoshi.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        {/* Accent switcher for picking a theme; never rendered in production. */}
        {process.env.NODE_ENV !== "production" && <ThemePicker />}
      </body>
    </html>
  );
}
