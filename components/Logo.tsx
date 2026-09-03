import Link from "next/link";

/**
 * Wordmark only for now. When the official logo lands, drop it in /public
 * and replace the <span> with:
 *   <Image src="/logo.svg" alt="Selixa" width={160} height={38} priority />
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center text-fg ${className}`} aria-label="Selixa home">
      <span className="text-[1.3125rem] font-medium uppercase leading-none tracking-[0.26em] translate-x-[0.12em]">
        Selixa
      </span>
    </Link>
  );
}
