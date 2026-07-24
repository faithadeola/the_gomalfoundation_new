"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";
import { useTheatreMode } from "@shared/hooks/use-theatre-mode";

gsap.registerPlugin(ScrollTrigger);

const jig = (n: number, m: number) => ((n * 7919) % (2 * m + 1)) - m;

/** Each featured tribute arrives from its own side of the screen. */
const SIDES = [
  { from: { x: "-70vw", y: "0vh" }, to: { x: "70vw", y: "0vh" } }, // left → exits right
  { from: { x: "70vw", y: "0vh" }, to: { x: "-70vw", y: "0vh" } }, // right → exits left
  { from: { x: "0vw", y: "-70vh" }, to: { x: "0vw", y: "70vh" } }, // top → exits bottom
  { from: { x: "0vw", y: "70vh" }, to: { x: "0vw", y: "-70vh" } }, // bottom → exits top
] as const;

/** Parametric heart, scaled to viewport units — slots for the flock. */
function heartSlot(index: number, total: number): { x: number; y: number } {
  const t = (index / total) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { x: x * 1.35, y: -y * 1.35 };
}

/**
 * Section 5 — the tributes.
 * Opens on WHITE (continuity from the counter): eyebrow, count line,
 * TRIBUTES enormous — then it all folds away upward and the green
 * curtain sweeps in from the left, bringing the stage. Tribute cards
 * pour in from all four sides — timed unevenly, so exactly one card
 * holds the centre at a time, growing as it arrives, typing itself out
 * fast — then departs through the opposite side as the next arrives.
 * The flock and the wax seal close.
 */
export function TributesCorridor() {
  const scope = useRef<HTMLElement>(null);
  const theatre = useTheatreMode();
  const { multiplicationWall, tributes } = contents;

  const featured = multiplicationWall.featuredTributes;
  const floaters = tributes.all.slice(4, 12);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=480%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labelsDirectional",
              duration: { min: 0.25, max: 0.9 },
              delay: 0.15,
              ease: "power2.inOut",
            },
          },
        });

        // ── the white title plate (0 → 2.4)
        tl.fromTo(".tv-intro", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 0.2);
        tl.addLabel("tv-title", 2.2);

        // ── it folds away upward (2.6 → 4)
        tl.to(".tv-line", { y: "-115%", stagger: 0.16, duration: 1.1, ease: "power2.in" }, 2.6);
        tl.to(".tv-intro", { autoAlpha: 0, duration: 0.4 }, 3.7);

        // ── the green curtain sweeps in from the left (3.6 → 5.6)
        tl.fromTo(".tw-curtain", { xPercent: -101 }, { xPercent: 0, duration: 2, ease: "power2.inOut" }, 3.6);
        tl.addLabel("tw-stage", 5.8);

        // background tributes travel in convoys along their axis —
        // horizontal arrivals queue side by side, vertical arrivals stack
        // above/below, always spaced, never piling on the centre. They
        // start visible and grow bigger and more opaque as they approach.
        gsap.utils.toArray<HTMLElement>(".tw-float").forEach((card, i) => {
          const side = i % 4;
          const lane = Math.floor(i / 4); // position in the queue
          const laneJitter = jig(i, 4);
          const from =
            side === 0
              ? { x: "-72vw", y: `${laneJitter}vh` }
              : side === 1
                ? { x: "72vw", y: `${laneJitter}vh` }
                : side === 2
                  ? { x: `${laneJitter * 2.5}vw`, y: "-66vh" }
                  : { x: `${laneJitter * 2.5}vw`, y: "66vh" };
          const to =
            side === 0
              ? { x: `${-(20 + lane * 17)}vw`, y: `${laneJitter}vh` }
              : side === 1
                ? { x: `${20 + lane * 17}vw`, y: `${laneJitter}vh` }
                : side === 2
                  ? { x: `${laneJitter * 2.5}vw`, y: `${-(18 + lane * 15)}vh` }
                  : { x: `${laneJitter * 2.5}vw`, y: `${18 + lane * 15}vh` };
          tl.fromTo(
            card,
            { ...from, autoAlpha: 0.3, scale: 0.55, rotation: jig(i, 12) },
            {
              ...to,
              autoAlpha: 0.85,
              scale: 0.85,
              rotation: jig(i * 3 + 1, 5),
              duration: 16,
              ease: "power1.out",
            },
            6 + (i % 4) * 0.7
          );
        });

        // ── the four readings — one side at a time (6 → 26)
        featured.forEach((_, f) => {
          const at = 6 + f * 5;
          const side = SIDES[f % SIDES.length];
          const sel = `[data-tw-card="${f}"]`;
          // arrives from its side, growing toward the centre
          tl.fromTo(
            sel,
            { ...side.from, scale: 0.4, autoAlpha: 0, rotation: jig(f * 7 + 2, 10) },
            { x: "0vw", y: "0vh", scale: 1, autoAlpha: 1, rotation: 0, duration: 1.2, ease: "power2.out" },
            at
          );
          // fast typewriter — text and author
          tl.fromTo(`${sel} .tv-caret`, { autoAlpha: 1 }, { autoAlpha: 1, duration: 0.01 }, at + 1);
          tl.fromTo(
            `${sel} .tv-char`,
            { autoAlpha: 0 },
            { autoAlpha: 1, stagger: 0.006, duration: 0.01 },
            at + 1.1
          );
          tl.to(`${sel} .tv-caret`, { autoAlpha: 0, duration: 0.15 }, at + 2.9);
          tl.fromTo(
            `${sel} .tv-author`,
            { autoAlpha: 0 },
            { autoAlpha: 1, stagger: 0.01, duration: 0.01 },
            at + 2.95
          );
          tl.addLabel(`tw-read-${f + 1}`, at + 3.5);
          // departs through the opposite side
          tl.to(sel, { ...side.to, scale: 0.5, autoAlpha: 0, duration: 1, ease: "power2.in" }, at + 3.9);
        });

        // ── the flock composes the heart (26.5 → 29.5)
        tl.to(".tw-float", { autoAlpha: 0, duration: 1 }, 26.3);
        tl.fromTo(
          ".tc-heart-card",
          { x: 0, y: 0, scale: 0, rotation: 0, autoAlpha: 0 },
          {
            x: (i: number) => `${heartSlot(i, 18).x}vw`,
            y: (i: number) => `${heartSlot(i, 18).y}vh`,
            rotation: (i: number) => jig(i, 16),
            scale: 1,
            autoAlpha: 1,
            duration: 2.4,
            ease: "power2.inOut",
            stagger: 0.07,
          },
          26.8
        );
        tl.addLabel("tc-heart", 29.6);

        // ── the seal stamps the invitation
        tl.fromTo(
          ".tc-seal",
          { scale: 2.1, rotation: -22, autoAlpha: 0 },
          { scale: 1, rotation: -8, autoAlpha: 1, duration: 1.1, ease: "power3.in" },
          29.7
        );
        tl.fromTo(".tc-seal-ring", { scale: 0.6, autoAlpha: 0.7 }, { scale: 1.7, autoAlpha: 0, duration: 0.8 }, 30.7);
        tl.fromTo(".tc-readall", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 30.9);
        tl.addLabel("tc-done", 31.9);
        tl.to({}, { duration: 1.3 });
      });
    },
    { scope }
  );

  return (
    <section
      id="wall"
      ref={scope}
      className="texture-grain relative overflow-hidden bg-parchment text-ink md:motion-safe:h-svh"
    >
      {/* ───────── theatre ───────── */}
      <div className="hidden md:motion-safe:block absolute inset-0">
        {/* the white title plate */}
        <div className="tv-intro absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-8 opacity-0">
          <span className="block overflow-hidden">
            <span className="tv-line block text-[12px] font-semibold tracking-[0.22em] uppercase text-coral">
              {tributes.page.eyebrow}
            </span>
          </span>
          <span className="block overflow-hidden mt-4">
            <span
              className="tv-line block font-display font-black uppercase text-ink text-[clamp(1.5rem,2.6vw,2.25rem)]"
              style={{ fontVariationSettings: "'wdth' 84" }}
            >
              {tributes.page.headingCount} {tributes.page.headingSuffix}
            </span>
          </span>
          <span className="block overflow-hidden mt-2">
            <span
              className="tv-line block font-display font-black uppercase text-evergreen-deep text-[clamp(4rem,13vw,11.5rem)] leading-[0.95]"
              style={{ fontVariationSettings: "'wdth' 84" }}
            >
              {tributes.page.bigTitle}
            </span>
          </span>
        </div>

        {/* the green stage, swept in from the left */}
        <div className="tw-curtain absolute inset-0 z-10 bg-evergreen-deep text-parchment">
          <svg aria-hidden className="absolute inset-0 w-full h-full opacity-[0.045]">
            <rect width="100%" height="100%" fill="url(#hero-arches)" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 40 800"
            preserveAspectRatio="none"
            className="absolute -right-[18px] top-0 h-full w-[36px]"
          >
            <path
              d="M20 0 c 22 40 -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 80"
              fill="none"
              stroke="var(--color-marigold)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>

          {/* background tributes drifting in from every side */}
          {floaters.map((tribute) => (
            <div
              key={tribute.id}
              className="tw-float absolute left-1/2 top-1/2 -ml-[150px] -mt-[60px] w-[300px] rounded-xl bg-parchment/90 text-ink px-5 py-4 opacity-0 pointer-events-none"
            >
              <p className="serif-soft font-serif italic text-[0.8rem] leading-[1.45] line-clamp-3">
                &ldquo;{tribute.text}&rdquo;
              </p>
              <footer className="mt-2 text-[0.65rem] font-semibold text-ink/55">
                {tribute.name} · {tribute.relation}
              </footer>
            </div>
          ))}

          {/* the four readings */}
          {featured.map((tribute, f) => (
            <div
              key={tribute.id}
              data-tw-card={f}
              className="absolute inset-0 flex items-center justify-center px-10 opacity-0 will-change-transform"
            >
              <div className="max-w-[760px] rounded-[1.5rem] bg-parchment text-ink px-10 py-9 shadow-[0_36px_90px_rgba(0,0,0,0.5)]">
                <p className="serif-soft font-serif italic text-[clamp(1.125rem,1.9vw,1.5rem)] leading-[1.6]">
                  &ldquo;
                  {Array.from(tribute.text).map((char, c) => (
                    <span key={c} className="tv-char">
                      {char}
                    </span>
                  ))}
                  &rdquo;
                  <span className="tv-caret inline-block w-[2px] h-[1em] bg-coral align-middle ml-0.5 animate-pulse opacity-0" />
                </p>
                <p className="mt-5 text-[0.8125rem] font-semibold tracking-wide text-ink/60">
                  {Array.from(`${tribute.name} · ${tribute.relation}`).map((char, c) => (
                    <span key={c} className="tv-author opacity-0">
                      {char}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}

          {/* the heart flock + seal */}
          <div className="absolute left-1/2 top-[46%]">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="tc-heart-card absolute -ml-[34px] -mt-[22px] w-[68px] h-[44px] rounded-md bg-parchment/95 shadow-[0_8px_20px_rgba(0,0,0,0.45)] opacity-0"
              />
            ))}
            <div className="absolute left-1/2 top-[2vh] -translate-x-1/2 pointer-events-auto">
              <span className="tc-seal-ring absolute inset-0 rounded-full border-2 border-coral opacity-0" aria-hidden />
              <Link
                href={ROUTES.TRIBUTES}
                className="tc-seal relative flex flex-col items-center justify-center w-[150px] aspect-square rounded-full bg-coral text-ink text-center px-4 opacity-0 shadow-[0_18px_44px_rgba(0,0,0,0.5)] hover:bg-marigold transition-colors duration-300"
              >
                <span className="serif-soft font-serif italic text-[1rem] leading-tight">
                  {multiplicationWall.ctas.addTribute}
                </span>
              </Link>
            </div>
          </div>

          <div className="tc-readall absolute inset-x-0 bottom-[7%] text-center opacity-0">
            <Link
              href={ROUTES.TRIBUTES}
              className="pointer-events-auto text-[0.875rem] font-semibold text-blush underline underline-offset-4 hover:text-marigold transition-colors"
            >
              {multiplicationWall.ctas.readAll}
            </Link>
          </div>
        </div>
      </div>

      {/* ───────── flowing fallback ───────── */}
      <div className="md:motion-safe:hidden relative z-10 max-w-[760px] mx-auto px-6 py-20">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-coral mb-3 text-center">
          {tributes.page.eyebrow}
        </p>
        <p
          className="text-center font-display font-black uppercase text-ink text-[clamp(1.75rem,7vw,2.5rem)] mb-10"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {tributes.page.headingCount} {tributes.page.headingSuffix}
        </p>
        <div className="space-y-5">
          {featured.slice(0, 3).map((tribute, i) => (
            <motion.blockquote
              key={tribute.id}
              initial={theatre ? false : { y: 30, opacity: 0 }}
              whileInView={theatre ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl bg-parchment-deep/60 border border-ink/10 px-6 py-5"
            >
              <p className="serif-soft font-serif italic text-[0.9375rem] leading-[1.55]">
                &ldquo;{tribute.text}&rdquo;
              </p>
              <footer className="mt-3 text-[0.75rem] font-semibold text-ink/60">
                {tribute.name} · {tribute.relation}
              </footer>
            </motion.blockquote>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href={ROUTES.TRIBUTES}
            className="inline-flex items-center rounded-full bg-coral text-ink text-[0.875rem] font-semibold px-6 py-3"
          >
            {multiplicationWall.ctas.addTribute}
          </Link>
          <Link href={ROUTES.TRIBUTES} className="text-[0.8125rem] font-semibold text-coral underline underline-offset-4">
            {multiplicationWall.ctas.readAll}
          </Link>
        </div>
      </div>
    </section>
  );
}
