import Image from "next/image";

/**
 * Full-bleed background image slot. Pass `src` (e.g. "/background.jpg" from /public)
 * once the artwork is ready; renders nothing until then.
 */
export function Background({ src, overlay = true }: { src?: string | null; overlay?: boolean }) {
  if (!src) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
      {overlay && (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_5/0.35),rgb(5_5_5/0.55))]" />
      )}
    </div>
  );
}
