"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";

gsap.registerPlugin(ScrollTrigger);

const jig = (n: number, m: number) => ((n * 7919) % (2 * m + 1)) - m;

/**
 * Section — Partnership. Screen-height marquee rows shear past each
 * other under your scroll, then compress to a headline as the seven
 * ways-to-partner chips rain in like stamped tickets, and the
 * application card slides up.
 */
export function PartnershipMarquee() {
  const scope = useRef<HTMLElement>(null);
  const { partnership } = contents;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=350%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labelsDirectional",
              duration: { min: 0.25, max: 0.8 },
              delay: 0.15,
              ease: "power2.inOut",
            },
          },
        });

        // ── the shear (0 → 8): two giant rows drag past each other
        tl.fromTo(".pm-row-a", { xPercent: 4 }, { xPercent: -34, duration: 8 }, 0);
        tl.fromTo(".pm-row-b", { xPercent: -34 }, { xPercent: 4, duration: 8 }, 0);
        // ── compress: the marquee shrinks into the section header (6 → 9)
        tl.to(".pm-marquee", { scale: 0.32, y: "-30vh", autoAlpha: 0, duration: 3, ease: "power1.inOut" }, 6);
        tl.fromTo(".pm-head", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1.6 }, 8);
        tl.addLabel("pm-head", 9.4);

        // ── the seven tickets rain in (9.5 → 14)
        tl.fromTo(
          ".pm-chip",
          {
            y: "-70vh",
            rotation: (i: number) => jig(i * 3 + 1, 30),
            autoAlpha: 1,
          },
          {
            y: "0vh",
            rotation: (i: number) => jig(i, 4),
            duration: 1.4,
            ease: "power2.in",
            stagger: 0.45,
          },
          9.5
        );
        tl.addLabel("pm-chips", 14);

        // ── the application card slides up (14 → 16)
        tl.fromTo(".pm-card", { y: "60vh", autoAlpha: 0 }, { y: "0vh", autoAlpha: 1, duration: 2, ease: "power2.out" }, 14.2);
        tl.addLabel("pm-done", 16.4);
        tl.to({}, { duration: 1.4 });
      });
    },
    { scope }
  );

  const marqueeText = `${partnership.section.eyebrow} · `;

  return (
    <section
      id="partner"
      ref={scope}
      className="texture-grain relative overflow-hidden bg-evergreen text-parchment md:motion-safe:h-svh"
    >
      <svg aria-hidden className="absolute inset-0 z-0 w-full h-full opacity-[0.04]">
        <rect width="100%" height="100%" fill="url(#hero-arches)" />
      </svg>

      {/* the marquee (theatre) */}
      <div aria-hidden className="pm-marquee hidden md:motion-safe:flex absolute inset-0 flex-col items-start justify-center gap-[1vh] pointer-events-none">
        <div className="pm-row-a whitespace-nowrap font-display font-black uppercase text-parchment text-[16vh] leading-[0.95]" style={{ fontVariationSettings: "'wdth' 84" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>{marqueeText.toUpperCase()}</span>
          ))}
        </div>
        <div className="pm-row-b whitespace-nowrap font-display font-black uppercase text-blush text-[16vh] leading-[0.95]" style={{ fontVariationSettings: "'wdth' 84" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>{marqueeText.toUpperCase()}</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1140px] mx-auto px-6 md:px-10 py-16 md:py-[2vw] md:h-full md:flex md:flex-col md:justify-center">
        <div className="pm-head text-center md:motion-safe:opacity-0">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blush mb-3">
            {partnership.section.eyebrow}
          </p>
          <h2
            className="font-display font-black uppercase text-[clamp(1.875rem,4vw,3.25rem)] leading-[1.05]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {partnership.section.heading}
          </h2>
          <p className="serif-soft mt-3 font-serif italic text-sage text-[clamp(0.9375rem,1.5vw,1.25rem)] max-w-[52ch] mx-auto">
            {partnership.section.body}
          </p>
        </div>

        {/* the seven tickets */}
        <div className="mt-10 md:mt-8 flex flex-wrap justify-center gap-3">
          {partnership.focusPairs.map((pair) => (
            <span
              key={pair.type}
              className="pm-chip inline-flex flex-col rounded-xl bg-parchment text-ink px-5 py-3 shadow-[0_12px_28px_rgba(4,26,21,0.35)] max-w-[240px]"
            >
              <span className="text-[0.8125rem] font-bold">{partnership.typeLabels[pair.type]}</span>
              <span className="text-[0.6875rem] text-ink/60 leading-snug mt-0.5">{pair.desc}</span>
            </span>
          ))}
        </div>

        {/* the application card */}
        <div className="pm-card mt-10 md:mt-12 mx-auto w-full max-w-[560px] rounded-[1.5rem] bg-parchment text-ink px-8 py-7 text-center shadow-[0_24px_60px_rgba(4,26,21,0.4)] md:motion-safe:opacity-0">
          <h3 className="font-display font-bold text-[1.25rem] mb-1.5" style={{ fontVariationSettings: "'wdth' 88" }}>
            {partnership.section.card.heading}
          </h3>
          <p className="text-[0.875rem] text-ink/65 mb-5">{partnership.section.card.body}</p>
          <Link
            href={ROUTES.PARTNERSHIP}
            className="inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300"
          >
            {partnership.section.card.cta}
          </Link>
          <p className="mt-3 text-[0.75rem] text-ink/50">{partnership.section.card.footnote}</p>
        </div>
      </div>
    </section>
  );
}
