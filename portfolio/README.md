# Marco Korcak — Personal Portfolio

A cinematic, single-page portfolio balancing full-stack engineering and applied AI, with professional contributions from 2025 and 2026.

## Development

Requires Node.js 22.13 or newer. Install with `npm ci`, then run `npm run dev`. The portable preview is served at http://127.0.0.1:5173/.

`npm run build` creates the static deployment in `dist/client`. This project uses React, TypeScript, Vinext, Tailwind CSS, Motion, Lucide, and accessible Radix/Shadcn dialog and sheet primitives. The Manrope font is self-hosted with its license.

## Editing

- `app/page.tsx`: layout and interaction components.
- `app/globals.css`: visual theme, responsive layouts, and reduced-motion styles.
- `lib/portfolio-content.ts`: experience, professional contributions, approach, and technology groups.
- `components/brand-mark.tsx`: eight vector logo directions. Compare them at `/brand-study`; preview an option with `/?mark=architectural` (or another option ID).
- `public/images`: three original artworks generated with the built-in image generation tool, optimized as JPEGs. Exact prompts are retained in `docs/artwork-prompts.json`.

Contact destinations are the provided résumé's email and LinkedIn profile. No location, time, contact form, personal-project gallery, tracking service, or fabricated performance metrics are included.

## Verification

Type check: `npx tsc --noEmit`.

With the local server running and Google Chrome installed on macOS, `node scripts/check-portfolio.mjs` checks responsive widths, contribution dialogs, mobile navigation, reduced motion, enlarged text, absence of résumé downloads, logo previews, and clipboard behavior. Screenshots and results are stored in ignored `.sites-runtime/qa`.

## Content status

All 2026 work is treated as merged and in production per Marco's clarification. Professional stories summarize the supplied résumé and accomplishment sheets, with internal implementation names and unverified numerical impact claims omitted. The current role is Software Engineer; the previous 2024–2025 role retains its historical Associate Software Engineer title. Education includes an MBA with a Data Analytics concentration at Louisiana State University Shreveport (July 2026–present), as supplied by Marco. Résumé files and download controls are removed from the website. Review final public copy before changing the private Site's audience.

## Hosting

Sites identity and static deployment configuration are recorded in `.openai/hosting.json`. Use the Sites hosting workflow to publish updates and preserve the private audience until public sharing is requested.
