const WORD = "Selixa";

/**
 * The footer's giant wordmark. Each letter eases into a lit gradient while the cursor
 * is on it and eases back out after. Decorative; hidden from assistive tech.
 */
export function FooterWordmark() {
  return (
    // Sized to the container: at -0.02em tracking, "Selixa" in Inter 500 inks 2.627em wide, starting
    // 0.051em in from the pen. 100cqw / 2.627 ≈ 38.06cqw, and the negative margin pulls the S flush left,
    // so the letters meet both edges of the footer columns.
    <p className="glyph-word relative ml-[-0.051em] whitespace-nowrap pb-[0.06em] pt-4 text-[38.06cqw] font-medium leading-[0.8] tracking-[-0.02em]">
      {WORD.split("").map((ch, i) => (
        <span key={i} className="glyph" data-ch={ch}>
          {ch}
        </span>
      ))}
    </p>
  );
}
