# Selixa — landing page

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, TypeScript.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build && pnpm start
```

## Structure

- `app/page.tsx` — the landing page: three-line Satoshi headline, a premium call to action that opens the inquiry modal, the deployment diagram, and the "How an engagement runs" strip.
- `components/ConversationCTA.tsx` — the button + `<dialog>` modal. `components/InquiryForm.tsx` is the form inside it.
- `components/DeploymentDiagram.tsx` — the rings/sweep SVG.

## Typography

- **Satoshi Light (300)** for the hero headline only, self-hosted from `app/fonts/Satoshi-Light.woff2` via `next/font/local` (Fontshare license alongside it).
- **Inter** (Google Fonts, optical-size axis) for everything else.

## Colour theme

Nine accent themes ship with the site. They share the same near-black shell and only move the accent — headline gradient, CTA and premium button, the ring diagram, focus rings, field glow, modal wash, and the admin tabs and status pills.

| `NEXT_PUBLIC_SITE_THEME` | Name | Accent | CTA text | Character |
| --- | --- | --- | --- | --- |
| `violet` _(default)_ | Violet | `#8b5cf6` | white | The current look. What you get when the variable is unset. |
| `dracula` | Dracula red | `#ff5555` | white | The Dracula palette's red, deepened through the CTA gradient. |
| `blue` | Blue | `#3b82f6` | white | Cool azure. The most conventional of the set. |
| `cyan` | Cyan | `#22d3ee` | dark | Bright ice. The diagram glows hardest here. |
| `lime` | Lime | `#a3e635` | dark | High-voltage green, the loudest option. |
| `amber` | Amber | `#f59e0b` | dark | Warm gold. Takes the chill off the near-black shell. |
| `rose` | Rose | `#f43f5e` | white | Pink-red — warmer and less alarming than dracula. |
| `emerald` | Emerald | `#10b981` | dark | Deep green, reads calm and financial. |
| `mono` | Mono | `#9a9aa4` | dark | No hue at all: silver headline, white CTA with a black label, white haze where the others glow. |

"Accent" is the base of each ramp (`--brand-500`); each theme also carries lighter and deeper stops. "CTA text" is what sits on the solid accent — the five light accents flip it to near-black, because white on lime is unreadable. Under `mono` the two semantic colours stay put: the green "contacted" pill in the admin table and red validation errors, both of which are meant to be read as status rather than styling.

- Run `pnpm dev` and use the picker in the bottom-right corner to try them on the real page. The choice is remembered in that browser only, and the picker never renders in production.
- Keep the one you like with `NEXT_PUBLIC_SITE_THEME=lime` in `.env.local` (and in the Vercel project settings), then restart. An unknown name falls back to violet.
- Palettes are the `[data-theme="…"]` blocks at the top of `app/globals.css` — 13 variables each (plus an optional override for the round CTA chip), documented there. Adding a theme means copying one block and adding an entry to `lib/theme.ts`.

## Background image

Drop the artwork into `/public` and set `BACKGROUND_IMAGE` in `app/page.tsx` (e.g. `"/background.jpg"`). It renders full-bleed behind the content with a soft dark overlay.

## Inquiry form

The form (inside the modal) posts through a Server Action in `app/actions.ts`. On a validation error the typed values are kept and the first problem field gets focus.

- Set `INQUIRY_WEBHOOK_URL` (see `.env.example`) to forward each inquiry as JSON to Slack, Zapier, n8n, or your own endpoint.
- With no webhook configured, inquiries are logged to the server console.

## Logo

`components/Logo.tsx` renders the wordmark only for now. Drop the official logo into `/public` and swap the `<span>` for a `next/image` as noted in the file. Add a favicon as `app/icon.svg` or `app/icon.png`.
