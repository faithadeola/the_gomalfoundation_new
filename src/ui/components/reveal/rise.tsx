"use client";

import { motion, useReducedMotion } from "motion/react";

interface RiseProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly y?: number;
  readonly x?: number;
  readonly rotate?: number;
  readonly scaleFrom?: number;
}

/**
 * Lightweight in-view entrance for flowing (non-theatre) layouts —
 * rises/slides once when scrolled into view; fully still under
 * prefers-reduced-motion.
 */
export function Rise({
  children,
  className,
  delay = 0,
  y = 26,
  x = 0,
  rotate = 0,
  scaleFrom = 1,
}: RiseProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { y, x, rotate, scale: scaleFrom, opacity: 0 }}
      whileInView={reduce ? undefined : { y: 0, x: 0, rotate: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
