"use client";

import { motion } from "motion/react";
import { contents } from "@contents";
import { useEntrancePhase } from "@features/splash/splash-context";

/**
 * Rotating circular badge — the page's invitation to keep going.
 * Bottom-centre on mobile (where the disc sits on desktop),
 * bottom-right on desktop.
 */
export function HeroScrollBadge() {
  const { hero } = contents;
  const phase = useEntrancePhase();

  return (
    <div
      aria-label={hero.scrollBadgeLabel}
      role="img"
      className="hero-badge absolute z-30 bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 md:left-auto md:translate-x-0 md:right-10 w-[clamp(96px,10vw,140px)] aspect-square"
    >
      <motion.div
        initial={false}
        animate={
          phase === "ssr"
            ? undefined
            : phase === "play"
              ? { scale: [0, 1], rotate: [-60, 0], opacity: [0, 1] }
              : { scale: 0, opacity: 0 }
        }
        transition={
          phase === "play"
            ? { type: "spring", stiffness: 200, damping: 20, delay: 1.9 }
            : { duration: 0 }
        }
        className="relative w-full h-full"
      >
        <svg viewBox="0 0 120 120" className="animate-spin-slow w-full h-full">
          <defs>
            <path id="badge-circle" d="M60 12 a48 48 0 1 1 0 96 a48 48 0 1 1 0 -96" />
          </defs>
          <text className="fill-blush uppercase text-[9.5px] tracking-[0.22em] font-semibold">
            <textPath href="#badge-circle" textLength="300" lengthAdjust="spacing">
              {hero.scrollBadge}
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-marigold" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m0 0-6-6m6 6 6-6" />
          </svg>
        </span>
      </motion.div>
    </div>
  );
}
