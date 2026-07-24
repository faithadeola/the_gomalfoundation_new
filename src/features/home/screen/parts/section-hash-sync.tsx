"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Sections tracked in the URL hash, in page order. "top" clears the hash. */
const SECTION_IDS = [
  "top",
  "story",
  "foundation",
  "legacy",
  "wall",
  "gallery",
  "give",
  "conference",
  "partner",
] as const;

/**
 * Hash-router for the scroll film.
 *
 * - As sections cross the viewport centre, the URL hash is updated via
 *   history.replaceState — no history entries, so Back leaves the site
 *   instead of replaying every section.
 * - Arriving (or refreshing) with a hash jumps straight to that section
 *   after the pinned scenes have laid out — skipping everything before
 *   it; the section itself still plays from its own start.
 */
export function SectionHashSync() {
  useEffect(() => {
    // ── resume: jump to the hashed section once pin-spacers exist
    const hash = window.location.hash.slice(1);
    let resumeTimer = 0;
    if (hash && (SECTION_IDS as readonly string[]).includes(hash) && hash !== "top") {
      resumeTimer = window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (!el) return;
        ScrollTrigger.refresh();
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + 2, behavior: "auto" });
      }, 450);
    }

    // ── active-section tracking: the section overlapping the viewport
    //    centre band owns the hash; ties go to the deepest (latest) one
    const visible = new Map<string, number>();
    const applyActive = () => {
      let active: string | null = null;
      for (const id of SECTION_IDS) {
        if ((visible.get(id) ?? 0) > 0) active = id; // last wins = deepest
      }
      if (!active) return;
      const next =
        active === "top"
          ? window.location.pathname + window.location.search
          : `${window.location.pathname}${window.location.search}#${active}`;
      if (window.location.href !== new URL(next, window.location.origin).href) {
        window.history.replaceState(null, "", next);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio || 1 : 0);
        });
        applyActive();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.clearTimeout(resumeTimer);
      observer.disconnect();
    };
  }, []);

  return null;
}
