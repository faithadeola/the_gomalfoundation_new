"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section — the Couples' Conference. Two wedding bands slide in from
 * opposite edges, spinning, and interlock at centre — the overlap
 * glowing where the two lives cross. The announcement writes itself
 * inside the union.
 */
export function ConferenceSection() {
  const scope = useRef<HTMLElement>(null);
  const { conference } = contents;

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
            end: "+=300%",
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

        // ── the bands approach, spinning (0 → 6)
        tl.fromTo(
          ".cf-ring-a",
          { x: "-58vw", rotation: -260, autoAlpha: 0.9 },
          { x: "-5vw", rotation: 0, autoAlpha: 1, duration: 6, ease: "power1.out" },
          0.4
        );
        tl.fromTo(
          ".cf-ring-b",
          { x: "58vw", rotation: 260, autoAlpha: 0.9 },
          { x: "5vw", rotation: 0, autoAlpha: 1, duration: 6, ease: "power1.out" },
          0.4
        );
        // the union glows the moment they interlock
        tl.fromTo(".cf-union", { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.55, duration: 1.4, ease: "power2.out" }, 6);
        tl.addLabel("cf-locked", 7.4);

        // ── the interlocked bands step aside — drifting to the upper
        //    corner, fading to a watermark so the text owns the stage
        tl.to(".cf-rings", { x: "27vw", y: "-24vh", scale: 0.55, autoAlpha: 0.22, duration: 2.4, ease: "power1.inOut" }, 7.6);

        // ── the announcement (7.5 → 12)
        tl.fromTo(
          ".cf-date",
          { scale: 0, rotate: -12, autoAlpha: 0 },
          { scale: 1, rotate: -3, autoAlpha: 1, duration: 1.2, ease: "back.out(1.6)" },
          7.6
        );
        tl.fromTo(
          ".cf-word",
          { y: "110%", autoAlpha: 0 },
          { y: "0%", autoAlpha: 1, stagger: 0.12, duration: 1.2 },
          8.4
        );
        tl.fromTo(".cf-body", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 10.2);
        tl.fromTo(
          ".cf-cta",
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "back.out(1.8)" },
          11.2
        );
        tl.addLabel("cf-done", 12.6);
        tl.to({}, { duration: 1.4 });
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="texture-grain relative overflow-hidden bg-evergreen-deep text-parchment md:motion-safe:h-svh"
    >
      {/* the two bands (theatre) — smaller, and they step aside for the text */}
      <div aria-hidden className="hidden md:motion-safe:block absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="cf-rings relative">
            <div className="cf-union absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[11vw] aspect-square rounded-full bg-marigold blur-3xl opacity-0" />
            <span className="cf-ring-a absolute left-1/2 top-1/2 -ml-[10vw] -mt-[10vw] block w-[20vw] aspect-square rounded-full border-[0.9vw] border-marigold opacity-0" />
            <span className="cf-ring-b absolute left-1/2 top-1/2 -ml-[10vw] -mt-[10vw] block w-[20vw] aspect-square rounded-full border-[0.9vw] border-lilac opacity-0" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[880px] mx-auto px-6 py-20 md:py-0 md:h-full flex flex-col items-center justify-center text-center">
        <p className="cf-date serif-soft inline-block font-serif italic text-[clamp(0.9375rem,1.5vw,1.125rem)] text-ink bg-blush px-5 py-2 shadow-[4px_5px_0_rgba(0,0,0,0.35)] -rotate-3 md:motion-safe:opacity-0">
          {conference.section.dateLocation}
        </p>
        <h2
          className="mt-7 font-display font-black uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(2rem,5.2vw,4.25rem)]"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {conference.section.heading.split(" ").map((word, w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
              <span className="cf-word inline-block md:motion-safe:opacity-0">{word}</span>
            </span>
          ))}
        </h2>
        <p className="cf-body serif-soft mt-5 font-serif italic text-sage text-[clamp(1rem,1.7vw,1.375rem)] max-w-[46ch] md:motion-safe:opacity-0">
          {conference.section.body}
        </p>
        <Link
          href={ROUTES.CONFERENCE}
          className="cf-cta mt-9 inline-flex items-center gap-2 rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3.5 hover:bg-marigold hover:rotate-1 transition-all duration-300 md:motion-safe:opacity-0"
        >
          {conference.section.cta}
        </Link>
      </div>
    </section>
  );
}
