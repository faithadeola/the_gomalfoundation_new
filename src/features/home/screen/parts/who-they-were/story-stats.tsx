"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";

gsap.registerPlugin(ScrollTrigger);

/** Odometer count-ups; non-numeric stats (∞) spin in instead. */
export function StoryStats() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // mobile flow only — the desktop theatre's master timeline drives
      // the counters so they stay scrub-reversible
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
          const raw = el.dataset.value ?? "";
          const numeric = Number(raw.replace(/[^0-9]/g, ""));
          const hasCommas = raw.includes(",");

          if (raw && !Number.isNaN(numeric) && /[0-9]/.test(raw)) {
            const counter = { v: 0 };
            gsap.to(counter, {
              v: numeric,
              duration: 1.8,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
              onUpdate: () => {
                const value = Math.round(counter.v);
                el.textContent = hasCommas ? value.toLocaleString("en-US") : String(value);
              },
            });
          } else {
            // the ∞ — spins in with an overshoot wobble
            gsap.fromTo(
              el,
              { rotation: -200, scale: 0.4, autoAlpha: 0 },
              {
                rotation: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 1.1,
                ease: "back.out(2.2)",
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }
            );
          }
        });
      });
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="story-stats mt-14 md:mt-0 grid grid-cols-1 sm:grid-cols-3 md:flex md:gap-10 gap-8 text-center md:text-right shrink-0"
    >
      {contents.whoTheyWere.stats.map((stat) => (
        <div key={stat.label}>
          <p
            className="stat-number font-display font-black text-ink text-[clamp(2.5rem,3.4vw,3.25rem)] leading-none inline-block"
            data-value={stat.num}
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {stat.num}
          </p>
          <p className="serif-soft font-serif italic text-[0.875rem] text-ink/60 mt-1.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
