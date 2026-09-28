import Link from "next/link";

const wordmark = "text-[1.3125rem] font-medium leading-none tracking-[0.01em]";

/**
 * The Selixa wordmark. Links home by default; pass `asText` when it sits
 * inside another link (e.g. next to the mark in the header).
 */
export function Logo({ className = "", asText = false }: { className?: string; asText?: boolean }) {
  if (asText) return <span className={`inline-flex items-center text-fg ${wordmark} ${className}`}>Selixa</span>;
  return (
    <Link href="/" className={`inline-flex items-center text-fg ${className}`} aria-label="Selixa home">
      <span className={wordmark}>Selixa</span>
    </Link>
  );
}
