"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "motion/react";
import { contents } from "@contents";
import { useSplash } from "@features/splash/splash-context";
import { useMounted } from "@shared/hooks/use-mounted";

const RING_COLORS_OUTER = [
  "var(--color-marigold)",
  "var(--color-coral)",
  "var(--color-lilac)",
  "var(--color-blush)",
  "var(--color-marigold)",
];

const RING_COLORS_INNER = [
  "var(--color-lilac)",
  "var(--color-blush)",
  "var(--color-marigold)",
  "var(--color-coral)",
  "var(--color-lilac)",
];

/**
 * The two of them, together in one circle — Baba dominant on the left,
 * Mama dominant on the right, merged where they meet. Two dashed rings
 * orbit in opposite directions, trading colors as they go.
 * On load the whole disc rolls in from above the fold.
 */
interface HeroMedallionProps {
  /** Positioning wrapper classes — mobile flow vs desktop absolute. */
  readonly className: string;
}

export function HeroMedallion({ className }: HeroMedallionProps) {
  const scope = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const { hero } = contents;
  const { splashEnabled, heroReady } = useSplash();
  // when the splash runs, its rolling disc IS this medallion's entrance —
  // hold still and invisible in the resting spot (so the splash can
  // measure it), then crossfade in the moment the disc lands
  const splashHandoff = splashEnabled && !reduce;

  useGSAP(
    () => {
      if (reduce) return;
      gsap.to(".ring-outer", {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 42,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".ring-inner", {
        rotation: -360,
        transformOrigin: "50% 50%",
        duration: 32,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".ring-outer", {
        keyframes: RING_COLORS_OUTER.map((stroke) => ({ stroke })),
        duration: 22,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".ring-inner", {
        keyframes: RING_COLORS_INNER.map((stroke) => ({ stroke })),
        duration: 17,
        ease: "none",
        repeat: -1,
      });
    },
    { scope, dependencies: [reduce] }
  );

  return (
    <div
      ref={scope}
      data-hero-medallion
      className={`${className} aspect-square pointer-events-none`}
    >
      {/* dedicated layer for the scroll handoff (story section scrubs its
          transform) — keeps GSAP off the positioned wrapper and out of
          the inner motion.div's transforms */}
      <div data-medallion-roller className="w-full h-full">
        <motion.div
        initial={false}
        animate={
          !mounted
            ? undefined
            : reduce
              ? { x: "0vw", rotate: 0 }
              : splashHandoff
                ? heroReady
                  ? { opacity: 1, x: "0vw", rotate: 0 }
                  : { opacity: 0, x: "0vw", rotate: 0 }
                : { x: ["-90vw", "0vw", "1.5vw", "0vw"], rotate: [-720, 0, 12, 0] }
        }
        transition={
          reduce
            ? { duration: 0 }
            : splashHandoff
              ? heroReady
                ? { duration: 0.45, ease: "easeOut" }
                : { duration: 0 }
              : {
                  delay: 0.45,
                  duration: 2.3,
                  times: [0, 0.72, 0.87, 1],
                  ease: ["easeOut", "easeInOut", "easeInOut"],
                }
        }
        role="img"
        aria-label={hero.alt.together}
        className="relative w-full h-full"
      >
        {/* orbiting rings */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden>
          <circle
            className="ring-outer"
            cx="100"
            cy="100"
            r="95.5"
            fill="none"
            stroke="var(--color-marigold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="26 13"
          />
          <circle
            className="ring-inner"
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="var(--color-lilac)"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeDasharray="6 11"
          />
        </svg>

        {/* the portraits, left-dominant / right-dominant, merged centre */}
        <div className="absolute inset-[5%] rounded-full overflow-hidden bg-evergreen-deep">
          <div
            className="absolute inset-0"
            style={{
              maskImage: "linear-gradient(to right, black 0%, black 44%, transparent 66%)",
              WebkitMaskImage: "linear-gradient(to right, black 0%, black 44%, transparent 66%)",
            }}
          >
            <Image
              src={hero.images.baba}
              alt={hero.alt.baba}
              fill
              sizes="(max-width: 768px) 60vw, 540px"
              className="object-cover scale-110 -translate-x-[9%]"
              priority
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
              alt={hero.alt.mama}
              fill
              sizes="(max-width: 768px) 60vw, 540px"
              className="object-cover scale-110 translate-x-[20%]"
              priority
            />
          </div>
          {/* warm veil where they merge */}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(to right, transparent 30%, color-mix(in srgb, var(--color-burnt) 30%, transparent) 50%, transparent 70%)",
            }}
          />
        </div>
        </motion.div>
      </div>
    </div>
  );
}
