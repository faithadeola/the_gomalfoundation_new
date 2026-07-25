"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";
import { useTheatreMode } from "@shared/hooks/use-theatre-mode";

gsap.registerPlugin(ScrollTrigger);

const wordVariants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 280, damping: 26 },
  },
};

const wordCascade = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

/**
 * Section — the Couples' Conference. Two wedding bands slide in from
 * opposite edges, spinning, and interlock at centre — the overlap
 * glowing where the two lives cross. The announcement writes itself
 * inside the union.
 */
export function ConferenceSection() {
  const scope = useRef<HTMLElement>(null);
  const theatre = useTheatreMode();
  const { conference } = contents;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // mobile: the bands, miniaturised — slide in from the edges,
      // interlock above the heading, glow, then settle back
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const tl = gsap.timeline({
          paused: true,
          scrollTrigger: {
            trigger: stage,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });
        tl.fromTo(
          ".mcf-ring-a",
          { x: "-60vw", rotation: -240, autoAlpha: 0 },
          { x: -14, rotation: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
          0
        );
        tl.fromTo(
          ".mcf-ring-b",
          { x: "60vw", rotation: 240, autoAlpha: 0 },
          { x: 14, rotation: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
          0
        );
        tl.fromTo(".mcf-union", { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.55, duration: 0.5 }, 0.9);
        tl.to(".mcf-union", { autoAlpha: 0.25, duration: 0.6 }, 1.5);
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=220%",
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
        tl.fromTo(".cf-body", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 9.6);
        tl.fromTo(
          ".cf-cta",
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "back.out(1.8)" },
          10.4
        );
        tl.addLabel("cf-done", 11.4);
        tl.to({}, { duration: 1.2 });
      });
    },
    { scope }
  );

  return (
    <section
      id="conference"
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
        {/* mobile: the bands, miniaturised, interlocking above the heading */}
        <div aria-hidden className="md:motion-safe:hidden relative h-24 w-full mb-6 motion-reduce:hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="mcf-union absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 aspect-square rounded-full bg-marigold blur-2xl opacity-0" />
            <span className="mcf-ring-a absolute left-1/2 top-1/2 -ml-10 -mt-10 block w-20 aspect-square rounded-full border-[7px] border-marigold opacity-0" />
            <span className="mcf-ring-b absolute left-1/2 top-1/2 -ml-10 -mt-10 block w-20 aspect-square rounded-full border-[7px] border-lilac opacity-0" />
          </div>
        </div>

        <motion.p
          initial={theatre ? false : { scale: 0, rotate: -12, opacity: 0 }}
          whileInView={theatre ? undefined : { scale: 1, rotate: -3, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 }}
          className="cf-date serif-soft inline-block font-serif italic text-[clamp(0.9375rem,1.5vw,1.125rem)] text-ink bg-blush px-5 py-2 shadow-[4px_5px_0_rgba(0,0,0,0.35)] -rotate-3 md:motion-safe:opacity-0"
        >
          {conference.section.dateLocation}
        </motion.p>
        <motion.h2
          variants={theatre ? undefined : wordCascade}
          initial={theatre ? false : "hidden"}
          whileInView={theatre ? undefined : "visible"}
          viewport={{ once: true, amount: 0.6 }}
          className="mt-7 font-display font-black uppercase leading-[1.02] tracking-[-0.02em] text-[clamp(2rem,5.2vw,4.25rem)]"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {conference.section.heading.split(" ").map((word, w) => (
            <span key={w} className="inline-block overflow-hidden align-bottom mr-[0.22em] last:mr-0">
              <motion.span
                variants={theatre ? undefined : wordVariants}
                className="cf-word inline-block md:motion-safe:opacity-0"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>
        <motion.p
          initial={theatre ? false : { y: 18, opacity: 0 }}
          whileInView={theatre ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="cf-body serif-soft mt-5 font-serif italic text-sage text-[clamp(1rem,1.7vw,1.375rem)] max-w-[46ch] md:motion-safe:opacity-0"
        >
          {conference.section.body}
        </motion.p>
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
