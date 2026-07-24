"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contents } from "@contents";

/**
 * Floating jump-to-top — appears once the hero has scrolled away.
 * Icon only on mobile; icon + label on desktop.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const label = contents.nav.backToTopLabel;

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          aria-label={label}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ y: 24, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed bottom-5 right-5 z-[55] inline-flex items-center gap-1.5 rounded-full bg-coral text-ink shadow-[0_10px_28px_rgba(4,26,21,0.45)] px-2.5 py-2.5 md:px-4 md:py-2 hover:bg-marigold transition-colors duration-300"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V4m0 0-6 6m6-6 6 6" />
          </svg>
          <span className="hidden md:inline text-[0.75rem] font-semibold tracking-wide">{label}</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
