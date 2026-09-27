const WORD = "Selixa";

/**
 * The footer's giant wordmark. Each letter eases into a lit gradient while the cursor
 * is on it and eases back out after. Decorative; hidden from assistive tech.
 */
export function FooterWordmark() {
  return (
    // Letter-spacing also trails the last letter; pad the start by the same amount so the word is truly centred.
    <p className="relative pb-[0.06em] pl-[0.06em] pt-4 text-center text-[clamp(4.5rem,21vw,19rem)] font-medium uppercase leading-[0.8] tracking-[0.06em]">
      {WORD.split("").map((ch, i) => (
        <span key={i} className="glyph" data-ch={ch}>
          {ch}
        </span>
      ))}
    </p>
  );
}
