"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

/**
 * Small illustrated accents that breathe (GSAP) and lean with the
 * pointer (motion springs).
 */
export function HeroShapes() {
  const scope = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 42, damping: 16 });
  const sy = useSpring(my, { stiffness: 42, damping: 16 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my, reduce]);

  useGSAP(
    () => {
      if (reduce) return;
      gsap.fromTo(
        ".shape-spark",
        { scale: 0.6, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.3,
        }
      );
    },
    { scope, dependencies: [reduce] }
  );

  return (
    <div ref={scope} aria-hidden className="hero-sparks absolute inset-0 z-10 pointer-events-none">
      {/* blush sparks — multiplication */}
      <Drift sx={sx} sy={sy} depth={-30} className="absolute left-[52%] top-[24%] hidden md:block w-[clamp(40px,4.5vw,68px)]">
        <svg viewBox="0 0 70 70" className="w-full h-auto">
          <g stroke="var(--color-blush)" strokeWidth="9" strokeLinecap="round" fill="none">
            <path className="shape-spark" d="M12 58 L24 40" />
            <path className="shape-spark" d="M34 52 L36 30" />
            <path className="shape-spark" d="M52 50 L60 34" />
          </g>
        </svg>
      </Drift>
    </div>
  );
}

interface DriftProps {
  readonly sx: MotionValue<number>;
  readonly sy: MotionValue<number>;
  readonly depth: number;
  readonly className?: string;
  readonly children: React.ReactNode;
}

/** Wraps a shape and lets it lean with the pointer, scaled by depth. */
function Drift({ sx, sy, depth, className, children }: DriftProps) {
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth * 0.7);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
