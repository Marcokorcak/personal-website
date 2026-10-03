# Marco Korcak — Personal Portfolio

A cinematic, single-page portfolio balancing full-stack engineering and applied AI, with professional contributions from 2025 and 2026.

## Development

Requires Node.js 22.13 or newer. Install with `npm ci`, then run `npm run dev`. The portable preview is served at http://127.0.0.1:5173/.

`npm run build` creates the static deployment in `dist/client`. This project uses React, TypeScript, Vinext, Tailwind CSS, Motion, Lucide, native contribution disclosures, and accessible Radix/Shadcn navigation sheets. The Manrope font is self-hosted with its license.

## Editing

- `app/page.tsx`: server-rendered work, experience, approach, and toolkit sections.
- `components/portfolio-interactions.tsx`: header navigation, hero motion, illustrative workflow connectors, contribution index, and contact feedback.
- `app/globals.css`: visual theme, responsive layouts, and reduced-motion styles.
- `lib/portfolio-content.ts`: experience, professional contributions, approach, and technology groups.
- `components/brand-mark.tsx`: eight vector logo directions. Compare them at `/brand-study`; preview an option with `/?mark=architectural` (or another option ID).
- `public/images`: generated glass-workflow and connection artwork. Responsive 960px and 1672px JPEGs keep image delivery suitable for static hosting. Current asset prompts are in `docs/implementation-artwork.json`.
- `scripts/generate-brand-assets.mjs`: renders the existing artwork, local font, and editorial MK mark into the committed social preview and PNG icons. Run with `node scripts/generate-brand-assets.mjs` when changing the brand.

Contact destinations are the provided résumé's email and LinkedIn profile. No location, time, contact form, personal-project gallery, tracking service, or fabricated performance metrics are included.

## Verification

Type check: `npx tsc --noEmit`.

With the local server running and Google Chrome installed on macOS, `node scripts/check-portfolio.mjs` checks responsive widths, keyboard-operated inline disclosures, mobile navigation, reduced motion, 200% text, absence of résumé downloads, logo previews, and clipboard success/failure behavior. Screenshots and results are stored in ignored `.sites-runtime/qa`. Set `PORTFOLIO_PREVIEW_URL` to test another local preview address.

## Content status

All 2026 work is treated as merged and in production per Marco's clarification. Professional stories use broad contribution summaries, omitting employer-specific operational steps, internal implementation and recovery mechanisms, security-remediation details, and unverified numerical impact claims. The current role is Software Engineer; the previous 2024–2025 role retains its historical Associate Software Engineer title. Education includes an MBA with a Data Analytics concentration at Louisiana State University Shreveport (July 2026–present), as supplied by Marco. Résumé files and download controls are absent. Public contact information is limited to the requested email and LinkedIn profile.

Keep private documents, credentials, and review artifacts outside `public`: every file in that directory is copied into the static deployment. Environment files, private keys, TypeScript caches, and local critique artifacts are ignored by Git. The source and export can be checked with `npm run check:public`; this checks for credential patterns, private deployment artifacts, and image metadata, not employer-specific confidentiality policies. Current artwork has identifying and text metadata removed without changing compressed pixel data.

## GitHub Pages

The repository-root workflow `.github/workflows/deploy-pages.yml` builds this `portfolio` subfolder and publishes the generated `portfolio/out` directory. In GitHub, open **Settings → Pages** and set **Source → GitHub Actions**. Push the workflow and source changes to `main`, then check the **Deploy portfolio to GitHub Pages** run under **Actions**. The site is served at https://marcokorcak.github.io/personal-website/.

The workflow uses the standard Next.js static exporter (`npm run build:pages`), because the current Vinext exporter does not generate the entry pages correctly when `basePath` is set. The existing Vinext local development and Sites build commands remain available. The Pages workflow gets the deployment base path from GitHub's Pages configuration; artwork, fonts, favicon, and gallery links support that prefix.

To reproduce and verify the project Pages deployment locally:

```sh
NEXT_PUBLIC_BASE_PATH=/personal-website npm run build:pages
npm run check:pages
```

The check serves the actual exported files under `/personal-website/` and tests them in a browser, including assets, contribution ownership/outcomes, desktop selection and mobile reading-position navigation, responsive layouts, inline disclosures, logo gallery navigation, and the share image/metadata/icons. It requires Google Chrome on macOS or Playwright Chromium on other platforms.

## Design direction

The page follows Hero → Work → Experience & Education → Approach → Toolkit → Contact. Enterprise AI workflows and the 2025 engagement analytics improvements receive equal featured space, with conversational commerce and developer tooling retained below. The analytics story covers React event deduplication, tracking consolidation, and interface refactoring, with qualitative outcomes grounded in the supplied accomplishments. Diagrams are illustrative explanations, not screenshots of Lowe’s products. Contribution details expand independently in the page for comparison.

The toolkit includes the public technologies in the résumé and accomplishment sheets, organized into Frontend & Mobile, Backend & Languages, Data & Messaging, Applied AI, Identity & Integrations, Cloud & Deployment, Testing & Quality, and Developer Tools. Each group owns its description and stable identifier in `lib/portfolio-content.ts`; the page maps icons by identifier. Employer-specific platform names remain omitted.

Motion is limited to a short hero entrance, restrained artwork parallax, explanatory connectors, and responsive controls. Keyboard navigation and reduced-motion preferences keep interactions immediate. The design review, six concept images, and unused original artwork are retained locally in ignored `.sites-runtime/archive`; critique snapshots are ignored in `.impeccable`. Neither directory is published or committed.

For ordinary local development, use `npm run dev` without setting `NEXT_PUBLIC_BASE_PATH`. The separate Sites identity remains recorded in `.openai/hosting.json`.
