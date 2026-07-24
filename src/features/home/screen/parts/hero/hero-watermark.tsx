"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "motion/react";
import { contents } from "@contents";
import { useLetterRipple } from "@shared/hooks/use-letter-ripple";

/**
 * The GOMAL letters as architecture — a wall of type behind the hero,
 * drifting like something remembered, rippling under the pointer.
 */
export function HeroWatermark() {
  const scope = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      if (reduce) return;
      gsap.to(scope.current, {
        xPercent: 3,
        duration: 26,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope, dependencies: [reduce] }
  );

  useLetterRipple(scope, {
    selector: ".wm-letter",
    radius: 400,
    lift: 52,
    rotate: 4,
  });

  return (
    <div
      ref={scope}
      aria-hidden
      className="absolute inset-0 z-0 flex items-center justify-center overflow-visible select-none"
    >
      <span className="font-display font-black text-evergreen-deep/70 text-[32vw] leading-none tracking-[-0.04em] whitespace-nowrap">
        {Array.from(contents.hero.watermark).map((letter, i) => (
          <span key={i} className="wm-letter inline-block">
            {letter}
          </span>
        ))}
      </span>
    </div>
  );
}
