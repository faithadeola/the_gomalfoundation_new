"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";

interface LetterRippleOptions {
  /** Elements that move — one per letter. */
  readonly selector: string;
  /**
   * Optional closest-ancestor selector used for position measurement.
   * Use when the letter itself is animated by something else (e.g. an
   * entrance cascade) and only a static wrapper knows its true resting spot.
   */
  readonly measureClosest?: string;
  /** Ripple reach in px around the pointer. */
  readonly radius?: number;
  /** Max upward lift in px at the ripple's centre. */
  readonly lift?: number;
  /** Max tilt in degrees, letters lean away from the pointer. */
  readonly rotate?: number;
}

/**
 * The "insect on still water" effect: letters near the pointer rise and
 * lean away with a smoothstep falloff, then settle — a ripple that follows
 * the mouse across any run of characters.
 */
export function useLetterRipple(
  scope: RefObject<HTMLElement | null>,
  { selector, measureClosest, radius = 140, lift = 16, rotate = 7 }: LetterRippleOptions
) {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const root = scope.current;
    if (!root) return;

    const letters = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (letters.length === 0) return;

    let centers: { x: number; y: number }[] = [];
    const measure = () => {
      centers = letters.map((el) => {
        const target = (measureClosest ? el.closest<HTMLElement>(measureClosest) : el) ?? el;
        const rect = target.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
        };
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const toY = letters.map((el) => gsap.quickTo(el, "y", { duration: 0.55, ease: "power2.out" }));
    const toR = letters.map((el) =>
      gsap.quickTo(el, "rotation", { duration: 0.65, ease: "power2.out" })
    );

    let frame = 0;
    let mouseX = -99999;
    let mouseY = -99999;

    const update = () => {
      frame = 0;
      for (let i = 0; i < letters.length; i++) {
        const dx = centers[i].x - mouseX;
        const dy = centers[i].y - mouseY;
        const distance = Math.hypot(dx, dy);
        const raw = Math.max(0, 1 - distance / radius);
        const falloff = raw * raw * (3 - 2 * raw);
        toY[i](-lift * falloff);
        toR[i]((dx < 0 ? 1 : -1) * rotate * falloff);
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX + window.scrollX;
      mouseY = e.clientY + window.scrollY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
      gsap.killTweensOf(letters);
    };
  }, [scope, selector, measureClosest, radius, lift, rotate, reduce]);
}
