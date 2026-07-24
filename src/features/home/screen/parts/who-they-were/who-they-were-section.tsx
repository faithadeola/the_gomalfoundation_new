"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, type Variants } from "motion/react";
import { contents } from "@contents";
import { useLetterRipple } from "@shared/hooks/use-letter-ripple";
import { useTheatreMode } from "@shared/hooks/use-theatre-mode";
import { RoomDoors } from "./room-doors";
import { StoryStats } from "./story-stats";

gsap.registerPlugin(ScrollTrigger);

const letterVariants: Variants = {
  hidden: { y: "115%", rotate: 7, opacity: 0 },
  visible: {
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035 } },
};

/**
 * Section 2 — Who They Were, as the theatre's story card.
 *
 * Desktop (theatre mode): this card is a full-viewport layer inside
 * StoryStage; every entrance here is DRIVEN BY THE MASTER TIMELINE via
 * the .story-* classes — motion props are disabled so GSAP owns them.
 *
 * Mobile / reduced motion: a normal flowing section with its own
 * in-view entrances, typewriter quote, and the door grid.
 */
export function WhoTheyWereSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const theatre = useTheatreMode();
  const { whoTheyWere } = contents;

  useLetterRipple(sectionRef, {
    selector: ".story-letter",
    measureClosest: ".story-slot",
    radius: 150,
    lift: 20,
    rotate: 9,
  });

  // the register quote types itself — mobile flow only (the master
  // timeline owns the desktop version)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".quote-char",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.01,
            stagger: 0.016,
            ease: "none",
            scrollTrigger: { trigger: ".quote-block", start: "top 78%", once: true },
          }
        );
        gsap.fromTo(
          ".quote-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.9,
            scrollTrigger: { trigger: ".quote-block", start: "top 78%", once: true },
          }
        );
        gsap.fromTo(
          ".quote-citation",
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            delay: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: ".quote-block", start: "top 78%", once: true },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="story" ref={sectionRef} className="relative md:h-full md:p-[2.2vw]">
      {/* the slide — floating on the green with margins all around (desktop) */}
      <div className="story-card texture-grain relative overflow-hidden bg-parchment text-ink rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_-24px_64px_rgba(9,59,49,0.4)] md:shadow-[0_30px_90px_rgba(4,26,21,0.55)] md:h-full">
        {/* the same arch architecture, in ink */}
        <svg aria-hidden className="absolute inset-0 z-0 w-full h-full opacity-[0.035]">
          <defs>
            <pattern id="story-arches" width="180" height="180" patternUnits="userSpaceOnUse">
              <path d="M20 160 v-60 a35 35 0 0 1 70 0 v60 Z" fill="var(--color-ink)" />
              <path d="M125 40 l30 30 -30 30 -30 -30 Z" fill="var(--color-ink)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#story-arches)" />
        </svg>

        {/* the disc's seat — upper right of the slide (desktop) */}
        <div
          data-story-dock
          aria-hidden
          className="hidden md:block absolute right-[6%] top-[10%] z-10 w-[min(22vw,300px)] aspect-square"
        >
          <div className="story-dock-ring w-full h-full rounded-full border-2 border-dashed border-ink/25" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-10 pt-14 md:pt-[2.5vw] pb-16 md:pb-[2vw] md:h-full md:flex md:flex-col">
          {/* left column — the card's right half belongs to the disc */}
          <div className="md:max-w-[58%]">
            <motion.p
              initial={theatre ? false : { scale: 0, rotate: -12, opacity: 0 }}
              whileInView={theatre ? undefined : { scale: 1, rotate: -3, opacity: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="story-sticker serif-soft inline-block font-serif italic text-[clamp(0.9375rem,1.6vw,1.25rem)] text-ink bg-blush px-5 py-2 shadow-[4px_5px_0_rgba(18,48,42,0.25)] -rotate-3"
            >
              {whoTheyWere.eyebrow}
            </motion.p>

          {/* heading — display caps with the serif word on a highlighter */}
          <motion.h2
            variants={theatre ? undefined : cascade}
            initial={theatre ? false : "hidden"}
            whileInView={theatre ? undefined : "visible"}
            viewport={{ once: true, amount: 0.5 }}
            className="mt-10 md:mt-7 font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(2.75rem,6.8vw,5.5rem)]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            <CascadeLine text={whoTheyWere.heading.line1} theatre={theatre} />
            <span className="block">
              <span className="relative inline-block px-3 md:px-4 mr-[0.18em] -rotate-1 align-baseline normal-case">
                <motion.span
                  initial={theatre ? false : { scaleX: 0 }}
                  whileInView={theatre ? undefined : { scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="story-bar absolute inset-0 origin-left bg-marigold"
                  aria-hidden
                />
                <span className="serif-soft relative z-10 font-serif italic font-medium">
                  <CascadeLine text={whoTheyWere.heading.highlighted} theatre={theatre} inline />
                </span>
              </span>
              <CascadeLine text={whoTheyWere.heading.line2} theatre={theatre} inline />
            </span>
          </motion.h2>

          {/* the register quote, typed in */}
          <div className="quote-block mt-12 md:mt-9 max-w-[62ch]">
            <p className="serif-soft font-serif italic text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.4] text-ink">
              {Array.from(whoTheyWere.pullQuote.text).map((char, i) => (
                <span key={i} className="quote-char">
                  {char}
                </span>
              ))}
            </p>
            <span className="quote-rule block h-[3px] w-44 mt-5 bg-coral origin-left" aria-hidden />
            <p className="quote-citation mt-3 text-[0.8125rem] font-semibold tracking-wide text-ink/55">
              {whoTheyWere.pullQuote.citation}
            </p>
          </div>

          {/* mobile: the door grid; desktop gets the door theatre instead */}
          <div className="md:hidden">
            <RoomDoors />
          </div>
          </div>

          {/* bottom band — the chair quote and the numbers, sharing one row */}
          <div className="md:mt-auto md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-12">
            <motion.blockquote
              initial={theatre ? false : { y: 30, opacity: 0 }}
              whileInView={theatre ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="story-dark texture-grain relative overflow-hidden mt-16 md:mt-0 rounded-[1.5rem] bg-evergreen-deep px-7 py-6 md:px-8 md:py-7 md:max-w-[58ch]"
            >
              <p className="serif-soft relative font-serif italic text-parchment text-[clamp(1.0625rem,1.5vw,1.25rem)] leading-[1.5]">
                &ldquo;{whoTheyWere.darkQuote.text}&rdquo;
              </p>
              <footer className="relative mt-3 text-[0.75rem] font-semibold tracking-wide text-blush">
                {whoTheyWere.darkQuote.citation}
              </footer>
            </motion.blockquote>

            <StoryStats />
          </div>
        </div>
      </div>
    </section>
  );
}

interface CascadeLineProps {
  readonly text: string;
  readonly theatre: boolean;
  readonly inline?: boolean;
}

/** Per-letter masked cascade — motion on mobile, timeline-owned in theatre. */
function CascadeLine({ text, theatre, inline }: CascadeLineProps) {
  return (
    <span className={inline ? "inline" : "block"}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap mr-[0.22em] last:mr-0">
          {Array.from(word).map((letter, i) => (
            <span
              key={i}
              className="story-slot inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom"
            >
              <motion.span
                variants={theatre ? undefined : letterVariants}
                className="story-rise inline-block"
              >
                <span className="story-letter inline-block cursor-default transition-colors duration-300 hover:text-coral">
                  {letter}
                </span>
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
