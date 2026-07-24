# The GOMAL Foundation — v2

Ground-up rebuild of the foundation website. Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · motion (Framer Motion) · GSAP · pnpm 11.

## Run

```bash
pnpm install
pnpm dev     # http://localhost:3003
pnpm build 
pnpm start   # http://localhost:3003
```

The port is pinned to **3003** via `-p 3003` in the `dev`/`start` scripts (Next.js does not read ports from `next.config.ts`).

## Structure (feature-sliced)

```
src/
├── app/          # thin route files only — each page delegates to a feature screen
├── contents/     # ALL copy/data for the app (see standard below)
├── features/     # one folder per feature: <feature>/screen/<feature>-screen.tsx + parts/
├── shared/       # config, constants, helpers, hooks, services, types
└── ui/           # primitives, components, icons (barrel at @icons)
```

Path aliases: `@/*`, `@features/*`, `@shared/*`, `@ui/*`, `@contents`, `@icons`.

## Contents standard

Every piece of copy, every array, every data object in the app lives in `src/contents/` — components never hardcode text.

1. One file per domain: `hero.ts`, `site.ts`, `programmes.ts`, `tributes.ts`, …
2. Each file exports one object named `<domain>Contents` whose **single top-level key is the domain name**:

   ```ts
   // src/contents/hero.ts
   export const heroContents = {
     hero: {
       eyebrow: "…",
       title: "…",
       lines: ["…", "…"],
     },
   } as const;
   ```

3. `src/contents/index.ts` spreads every domain into the single `contents` object (one key per file → no collisions):

   ```ts
   export const contents = {
     ...siteContents,
     ...heroContents,
   } as const;
   ```

4. Consumers import only from the barrel:

   ```ts
   import { contents } from "@contents";
   contents.hero.title;
   ```

5. Always `as const`. Plain serialisable data only — no JSX, no components, no functions.
