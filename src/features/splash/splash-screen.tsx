"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { useSplash } from "./splash-context";

/**
 * Phase map — every value is a FRACTION of contents.splash.durationMs,
 * so changing that one number stretches or compresses the whole
 * choreography.
 *
 *   0.03 – 0.23   THE GOMAL (L→R) / FOUNDATION (R→L) cross-reveal
 *   0.26 – 0.33   the title steps aside — gone before the panels move
 *   0.34 – 0.48   odd panels (1,3,5,7) swing near-fully open + close
 *   0.48 – 0.62   even panels (2,4,6,8) swing near-fully open + close
 *   0.62 – 0.80   all panels open one by one from the right / bottom
 *   0.80 – 0.90   the portraits contract into the disc
 *   0.83 – 0.95   curtain halves drag apart to the left and right
 *   0.90 – 1.00   the disc rolls (desktop) / drops (mobile) into the
 *                 medallion's spot, then the hero takes over
 */
const PHASE = {
  textInAt: 0.03,
  textInDur: 0.2,
  textOutAt: 0.26,
  textOutDur: 0.07,
  oddPeekAt: 0.34,
  evenPeekAt: 0.48,
  peekDur: 0.07,
  peekStagger: 0.015,
  openAt: 0.62,
  openEach: 0.1,
  openSpread: 0.08,
  discAt: 0.8,
  contractDur: 0.1,
  curtainAt: 0.83,
  curtainDur: 0.12,
  travelAt: 0.9,
  travelDur: 0.07,
} as const;

/**
 * How far a panel slides during a peek, as % of its own size —
 * panels open almost fully, keeping only a ~10% sliver of green.
 */
const PEEK_PERCENT = 90;

export function SplashScreen() {
  if (!contents.splash.enabled) return null;
  return <SplashPerformance />;
}

function SplashPerformance() {
  const { finishSplash } = useSplash();
  const scope = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const [hidden, setHidden] = useState(false);

  const { splash } = contents;
  const D = splash.durationMs / 1000;

  // no scrolling underneath while the performance runs
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useGSAP(
    () => {
      const finish = (fade: number) => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        // the component stays mounted (renders null) after finishing, so
        // the unmount cleanup never runs — restore scrolling here
        document.body.style.overflow = "";
        finishSplash();
        gsap.to(scope.current, {
          autoAlpha: 0,
          duration: fade,
          ease: "power1.out",
          onComplete: () => setHidden(true),
        });
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767.98px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (finishedRef.current) return;
          const { desktop, reduce } = ctx.conditions as {
            desktop: boolean;
            reduce: boolean;
          };

          if (reduce) {
            finish(0);
            return;
          }

          const disc = discRef.current;
          const panels = gsap.utils.toArray<HTMLElement>(".sp-panel");
          if (!disc || panels.length === 0) {
            finish(0);
            return;
          }

          // The medallion's resting rect, measured right before the disc
          // phase so the landing is pixel-accurate on every viewport.
          const target = { left: 0, top: 0, width: 0, height: 0 };
          const measure = () => {
            // the medallion renders twice (desktop absolute / mobile
            // in-flow) — measure whichever instance is displayed
            const rect = Array.from(
              document.querySelectorAll("[data-hero-medallion]")
            )
              .map((el) => el.getBoundingClientRect())
              .find((r) => r.width > 0);
            if (rect) {
              target.left = rect.left;
              target.top = rect.top;
              target.width = rect.width;
              target.height = rect.height;
            } else {
              // fallback mirrors the desktop medallion's layout classes
              const w = Math.min(window.innerWidth * 0.32, 330);
              target.width = w;
              target.height = w;
              target.left = (window.innerWidth - w) / 2;
              target.top = window.innerHeight - w * 0.6;
            }
          };

          const t = (fraction: number) => fraction * D;
          // columns slide vertically on desktop, rows horizontally on mobile
          const axis = desktop ? "yPercent" : "xPercent";

          const tl = gsap.timeline();

          // ── title cross-reveal: line one L→R, line two R→L, together
          tl.fromTo(
            ".sp-line-one",
            { xPercent: -112 },
            { xPercent: 0, duration: t(PHASE.textInDur), ease: "expo.out" },
            t(PHASE.textInAt)
          );
          tl.fromTo(
            ".sp-line-two",
            { xPercent: 112 },
            { xPercent: 0, duration: t(PHASE.textInDur), ease: "expo.out" },
            t(PHASE.textInAt)
          );

          // ── the title leaves completely before the panels ever move
          tl.to(
            ".sp-title",
            { autoAlpha: 0, y: -36, duration: t(PHASE.textOutDur), ease: "power2.in" },
            t(PHASE.textOutAt)
          );

          // slow settle on the portraits while the panels tease them
          tl.fromTo(
            ".sp-image",
            { scale: 1.12 },
            { scale: 1, duration: t(PHASE.discAt - PHASE.oddPeekAt), ease: "none" },
            t(PHASE.oddPeekAt)
          );

          // ── peek cycles: swing almost fully open, then close
          const peek = (els: HTMLElement[], at: number) => {
            tl.to(
              els,
              {
                [axis]: (i: number) => (i % 2 === 0 ? -PEEK_PERCENT : PEEK_PERCENT),
                duration: t(PHASE.peekDur),
                ease: "power2.inOut",
                stagger: t(PHASE.peekStagger),
              },
              t(at)
            );
            tl.to(
              els,
              {
                [axis]: 0,
                duration: t(PHASE.peekDur),
                ease: "power2.inOut",
                stagger: t(PHASE.peekStagger),
              },
              t(at + PHASE.peekDur)
            );
          };
          peek(panels.filter((_, i) => i % 2 === 0), PHASE.oddPeekAt);
          peek(panels.filter((_, i) => i % 2 === 1), PHASE.evenPeekAt);

          // ── panels open one by one from the right (desktop) / bottom
          //    (mobile), alternating direction
          tl.to(
            panels,
            {
              [axis]: (i: number) => (i % 2 === 0 ? -103 : 103),
              duration: t(PHASE.openEach),
              ease: "expo.inOut",
              stagger: { each: t(PHASE.openSpread) / (panels.length - 1), from: "end" },
            },
            t(PHASE.openAt)
          );

          // ── the portraits contract into the disc while the curtain
          //    halves drag apart to the left and to the right
          tl.call(measure, [], t(PHASE.discAt));
          tl.set(
            disc,
            {
              left: () => target.left,
              top: () => target.top,
              width: () => target.width,
              height: () => target.height,
              autoAlpha: 1,
            },
            t(PHASE.discAt)
          );
          tl.set(".sp-image-layer", { autoAlpha: 0 }, t(PHASE.discAt));
          tl.fromTo(
            disc,
            {
              // starts as a circle big enough to cover the viewport,
              // centred on screen — visually continuous with the bleed
              scale: () =>
                Math.hypot(window.innerWidth, window.innerHeight) /
                Math.max(target.width, 1),
              x: () => window.innerWidth / 2 - (target.left + target.width / 2),
              y: () => window.innerHeight / 2 - (target.top + target.height / 2),
              rotation: 0,
            },
            {
              scale: 1,
              // desktop: sweep to the left of the spot, ready to roll in.
              // mobile: rise above the spot, ready to drop.
              x: desktop ? () => -window.innerWidth * 0.36 : 0,
              y: desktop ? 0 : () => -window.innerHeight * 0.5,
              duration: t(PHASE.contractDur),
              ease: "power3.inOut",
              immediateRender: false,
            },
            t(PHASE.discAt)
          );

          tl.to(
            ".sp-curtain-l",
            { xPercent: -101, duration: t(PHASE.curtainDur), ease: "expo.inOut" },
            t(PHASE.curtainAt)
          );
          tl.to(
            ".sp-curtain-r",
            { xPercent: 101, duration: t(PHASE.curtainDur), ease: "expo.inOut" },
            t(PHASE.curtainAt)
          );

          // ── the landing — a different personality per device
          if (desktop) {
            // rolls in from the left, two full turns, overshoot, settle —
            // echoing the medallion's own roll-in
            tl.to(
              disc,
              { x: 0, rotation: 720, duration: t(PHASE.travelDur), ease: "power2.inOut" },
              t(PHASE.travelAt)
            );
            tl.to(disc, {
              x: () => target.width * 0.05,
              rotation: 731,
              duration: t(0.017),
              ease: "power1.out",
            });
            tl.to(disc, { x: 0, rotation: 720, duration: t(0.017), ease: "power1.inOut" });
          } else {
            // drops from above with one spin, squashes on impact, hops
            tl.to(
              disc,
              { y: 0, rotation: 360, duration: t(PHASE.travelDur), ease: "power2.in" },
              t(PHASE.travelAt)
            );
            tl.to(disc, {
              scaleX: 1.06,
              scaleY: 0.93,
              transformOrigin: "50% 100%",
              duration: t(0.015),
              ease: "power1.out",
            });
            tl.to(disc, {
              scaleX: 1,
              scaleY: 1,
              y: () => -target.height * 0.05,
              duration: t(0.02),
              ease: "power1.out",
            });
            tl.to(disc, { y: 0, duration: t(0.015), ease: "power1.in" });
          }

          // disc has landed — hero medallion crossfades in underneath
          // while the whole splash fades away
          tl.call(() => finish(0.5));
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  if (hidden) return null;

  return (
    <div
      ref={scope}
      aria-hidden
      className="texture-grain fixed inset-0 z-[100] overflow-hidden bg-evergreen"
    >
      {/* shared defs — the hero's arch pattern, referenced by every panel */}
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <pattern id="splash-arches" width="180" height="180" patternUnits="userSpaceOnUse">
            <path d="M20 160 v-60 a35 35 0 0 1 70 0 v60 Z" fill="var(--color-parchment)" />
            <path d="M125 40 l30 30 -30 30 -30 -30 Z" fill="var(--color-parchment)" />
          </pattern>
        </defs>
      </svg>

      {/* curtain halves — hidden beneath the portraits until they become
          the disc, then dragged apart to reveal the hero */}
      <div className="sp-curtain-l absolute inset-y-0 left-0 z-10 w-1/2 bg-evergreen-deep" />
      <div className="sp-curtain-r absolute inset-y-0 right-0 z-10 w-1/2 bg-evergreen-deep" />

      {/* the portraits, full-bleed beneath the panels */}
      <div className="sp-image-layer absolute inset-0 z-20 overflow-hidden">
        <div className="sp-image absolute inset-0">
          <SplashPortraitsBleed />
        </div>
      </div>

      {/* the disc the portraits collapse into, then roll home */}
      <div
        ref={discRef}
        className="sp-disc absolute z-[25] overflow-hidden rounded-full bg-evergreen-deep opacity-0 will-change-transform pointer-events-none"
      >
        <SplashPortraitsDisc />
      </div>

      {/* the eight green panels — columns on desktop, rows on mobile —
          each carrying its slice of the hero's arch pattern so the
          surface reads as one continuous hero background */}
      <div className="absolute inset-0 z-30 flex flex-col md:flex-row">
        {Array.from({ length: splash.panelCount }).map((_, i) => (
          <div key={i} className="sp-panel relative flex-1 overflow-hidden bg-evergreen">
            <svg
              aria-hidden
              className="hidden md:block absolute top-0 h-full opacity-[0.045]"
              style={{ width: `${splash.panelCount * 100}%`, left: `${-i * 100}%` }}
            >
              <rect width="100%" height="100%" fill="url(#splash-arches)" />
            </svg>
            <svg
              aria-hidden
              className="md:hidden absolute left-0 w-full opacity-[0.045]"
              style={{ height: `${splash.panelCount * 100}%`, top: `${-i * 100}%` }}
            >
              <rect width="100%" height="100%" fill="url(#splash-arches)" />
            </svg>
          </div>
        ))}
      </div>

      {/* the title cross-reveal */}
      <div className="sp-title absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center">
        <div className="overflow-hidden">
          <span
            className="sp-line-one block font-display font-black uppercase leading-[0.95] tracking-[-0.02em] text-parchment text-[clamp(3rem,11vw,10rem)]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {splash.lineOne}
          </span>
        </div>
        <div className="overflow-hidden">
          <span
            className="sp-line-two block font-display font-black uppercase leading-[0.95] tracking-[-0.02em] text-blush text-[clamp(3rem,11vw,10rem)]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {splash.lineTwo}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-bleed portrait composition revealed behind the panels — two
 * clean halves, no merging. Desktop: Baba left, Mama right.
 * Mobile: Baba top, Mama bottom.
 */
function SplashPortraitsBleed() {
  const { hero } = contents;
  return (
    <>
      {/* desktop — side by side */}
      <div className="hidden md:flex absolute inset-0 bg-evergreen-deep">
        <div className="relative h-full w-1/2">
          <Image src={hero.images.baba} alt="" fill priority sizes="50vw" className="object-cover" />
        </div>
        <div className="relative h-full w-1/2">
          <Image src={hero.images.mama} alt="" fill priority sizes="50vw" className="object-cover" />
        </div>
      </div>

      {/* mobile — stacked, Baba above, Mama below */}
      <div className="md:hidden absolute inset-0 flex flex-col bg-evergreen-deep">
        <div className="relative w-full h-1/2">
          <Image src={hero.images.baba} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="relative w-full h-1/2">
          <Image src={hero.images.mama} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
    </>
  );
}

/**
 * Disc-sized portrait composition. Desktop replicates the hero
 * medallion's inner treatment exactly (same masks, scale, and offsets)
 * so the landing crossfade is seamless. Mobile stacks the portraits.
 */
function SplashPortraitsDisc() {
  const { hero } = contents;
  return (
    <>
      {/* desktop — the medallion's merge, as is */}
      <div className="hidden md:block absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to right, black 0%, black 44%, transparent 66%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, black 44%, transparent 66%)",
          }}
        >
          <Image
            src={hero.images.baba}
            alt=""
            fill
            priority
            sizes="330px"
            className="object-cover scale-110 -translate-x-[9%]"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to left, black 0%, black 44%, transparent 66%)",
            WebkitMaskImage: "linear-gradient(to left, black 0%, black 44%, transparent 66%)",
          }}
        >
          <Image
            src={hero.images.mama}
            alt=""
            fill
            priority
            sizes="330px"
            className="object-cover scale-110 translate-x-[20%]"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(to right, transparent 30%, color-mix(in srgb, var(--color-burnt) 30%, transparent) 50%, transparent 70%)",
          }}
        />
      </div>

      {/* mobile — stacked halves, Baba top, Mama bottom */}
      <div className="md:hidden absolute inset-0 flex flex-col">
        <div className="relative w-full h-1/2">
          <Image src={hero.images.baba} alt="" fill priority sizes="330px" className="object-cover" />
        </div>
        <div className="relative w-full h-1/2">
          <Image src={hero.images.mama} alt="" fill priority sizes="330px" className="object-cover" />
        </div>
      </div>
    </>
  );
}
