/**
 * CONTENTS — single source of truth for ALL copy, data, and arrays in the app.
 *
 * THE STANDARD
 * ------------
 * 1. One file per domain/section: `hero.ts`, `site.ts`, `programmes.ts`,
 *    `tributes.ts`, `footer.ts`, etc.
 * 2. Each file exports ONE object named `<domain>Contents`, whose single
 *    top-level key is the domain name:
 *
 *      // src/contents/hero.ts
 *      export const heroContents = {
 *        hero: {
 *          eyebrow: "…",
 *          title: "…",
 *          lines: ["…", "…"],
 *        },
 *      } as const;
 *
 * 3. This index spreads every domain into the single `contents` object.
 *    Because each file owns exactly one top-level key, spreads can never
 *    collide:
 *
 *      export const contents = {
 *        ...siteContents,
 *        ...heroContents,
 *      } as const;
 *
 * 4. Consumers import ONLY from this barrel (alias `@contents`), never from
 *    the domain files directly:
 *
 *      import { contents } from "@contents";
 *      contents.hero.title;
 *
 * 5. Always end declarations with `as const` so every string/array is a
 *    precise literal type. No components, no JSX, no functions in these
 *    files — plain serialisable data only (strings, numbers, arrays,
 *    nested objects).
 */
import { siteContents } from "./site";
import { heroContents } from "./hero";
import { logoContents } from "./logo";
import { navContents } from "./nav";
import { footerContents } from "./footer";
import { whoTheyWereContents } from "./who-they-were";
import { foundationContents } from "./foundation";
import { programmesContents } from "./programmes";
import { multiplicationWallContents } from "./multiplication-wall";
import { giveContents } from "./give";
import { partnershipContents } from "./partnership";
import { tributesContents } from "./tributes";
import { conferenceContents } from "./conference";
import { galleryContents } from "./gallery";
import { notFoundContents } from "./not-found";
import { splashContents } from "./splash";

export const contents = {
  ...siteContents,
  ...heroContents,
  ...logoContents,
  ...navContents,
  ...footerContents,
  ...whoTheyWereContents,
  ...foundationContents,
  ...programmesContents,
  ...multiplicationWallContents,
  ...giveContents,
  ...partnershipContents,
  ...tributesContents,
  ...conferenceContents,
  ...galleryContents,
  ...notFoundContents,
  ...splashContents,
} as const;

export type Contents = typeof contents;
