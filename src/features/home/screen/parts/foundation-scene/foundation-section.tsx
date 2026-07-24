"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { contents } from "@contents";
import { useLetterRipple } from "@shared/hooks/use-letter-ripple";
import { useTheatreMode } from "@shared/hooks/use-theatre-mode";

gsap.registerPlugin(ScrollTrigger);

const ORB_ACCENTS = ["#f7c948", "#f6c0ae", "#e96d51", "#b9a3e3"] as const;

/**
 * Section 3 — The Foundation: "The Multiplication".
 * The disc arrives, pulses, and splits into four orbs that orbit it on a
 * tilted plane; scroll spins the orbit, then slams each orb down into its
 * focus-area card. Giant outline numerals sweep behind like weather.
 */
export function FoundationSection() {
  const scope = useRef<HTMLElement>(null);
  const theatre = useTheatreMode();
  const { foundation } = contents;

  useLetterRipple(scope, {
    selector: ".fd-letter",
    measureClosest: ".fd-slot",
    radius: 140,
    lift: 18,
    rotate: 9,
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        const parent = stage?.querySelector<HTMLElement>(".fd-parent");
        const orbs = gsap.utils.toArray<HTMLElement>(".fd-orb");
        if (!stage || !parent || orbs.length === 0) return;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=320%",
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

        // ── heading wakes (0 → 2.5)
        tl.fromTo(
          ".fd-sticker",
          { scale: 0, rotate: -14, autoAlpha: 0 },
          { scale: 1, rotate: -3, autoAlpha: 1, duration: 1, ease: "back.out(1.6)" },
          0.2
        );
        tl.fromTo(
          ".fd-rise",
          { y: "115%", rotate: 7, autoAlpha: 0 },
          { y: "0%", rotate: 0, autoAlpha: 1, stagger: 0.04, duration: 1.2 },
          0.6
        );
        tl.fromTo(".fd-intro", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.6);
        tl.addLabel("fd-heading", 2.5);

        // ── the disc arrives rolling small, then GROWS as it takes its
        //    seat (1.5 → 4.8): arrival and growth are one gesture
        tl.fromTo(
          parent,
          { x: "-60vw", rotation: -540, scale: 0.62, autoAlpha: 1 },
          { x: "0vw", rotation: 0, scale: 0.62, duration: 2.2, ease: "power1.out" },
          1.5
        );
        tl.to(parent, { scale: 1.45, duration: 1, ease: "back.out(1.7)" }, 3.8);
        // settle thump
        tl.to(parent, { scale: 1.38, duration: 0.25 }, 4.8);
        // the orbit track sketches itself around the seated disc
        tl.fromTo(
          ".fd-track",
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 0.35, scale: 1, duration: 0.8, ease: "power2.out" },
          4.4
        );
        // pulse before the split
        tl.fromTo(".fd-pulse", { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.6, duration: 0.5 }, 3.9);
        tl.to(".fd-pulse", { scale: 2.4, autoAlpha: 0, duration: 0.8 }, 4.4);

        // ── the split + orbit (5.5 → 16). One state object drives all
        //    four orbs so the orbit is perfectly scrub-reversible.
        //    Radius pulled in tight; exactly two revolutions.
        const orbit = { t: 0.12, r: 0 };
        const layout = () => {
          const RX = stage.clientWidth * 0.16;
          const RY = stage.clientHeight * 0.11;
          orbs.forEach((orb, i) => {
            const ang = (orbit.t + i / orbs.length) * Math.PI * 2;
            const depth = (Math.sin(ang) + 1) / 2; // 1 = front
            gsap.set(orb, {
              x: Math.cos(ang) * RX * orbit.r,
              y: Math.sin(ang) * RY * orbit.r,
              scale: (0.62 + 0.42 * depth) * Math.min(1, orbit.r * 2 + 0.35),
              zIndex: 20 + Math.round(depth * 20),
              autoAlpha: orbit.r === 0 ? 0 : 0.55 + 0.45 * depth,
            });
          });
        };
        // one and a half revolutions, no more
        tl.to(orbit, { r: 1, duration: 1.4, ease: "power2.out", onUpdate: layout }, 5);
        tl.to(orbit, { t: 1.62, duration: 4.6, onUpdate: layout }, 5);
        tl.addLabel("fd-orbit", 7.5);

        // numerals sweep behind throughout
        tl.to(".fd-num", { x: (i: number) => `${(i % 2 === 0 ? -1 : 1) * 46}vw`, stagger: 0.4, duration: 12 }, 2);

        // ── landings (10 → 16): orb i leaves the ring, slams into its card
        orbs.forEach((orb, i) => {
          const at = 10 + i * 1.6;
          const socket = stage.querySelector<HTMLElement>(`[data-fd-socket="${i}"]`);
          const card = stage.querySelector<HTMLElement>(`[data-fd-card="${i}"]`);
          // absolute transform target = socket centre minus the orb's
          // untransformed rest centre. Both rects are compensated for any
          // transforms active at measure time (the card's reveal offset,
          // the orb's orbit position) so the landing is pixel-exact.
          const target = () => {
            if (!socket) return { x: 0, y: 0 };
            const s = socket.getBoundingClientRect();
            const o = orb.getBoundingClientRect();
            const ox = Number(gsap.getProperty(orb, "x")) || 0;
            const oy = Number(gsap.getProperty(orb, "y")) || 0;
            const cardX = card ? Number(gsap.getProperty(card, "x")) || 0 : 0;
            const cardY = card ? Number(gsap.getProperty(card, "y")) || 0 : 0;
            return {
              x: s.left - cardX + s.width / 2 - (o.left + o.width / 2 - ox),
              y: s.top - cardY + s.height / 2 - (o.top + o.height / 2 - oy),
            };
          };
          tl.fromTo(`[data-fd-card="${i}"]`, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, at - 0.3);
          tl.to(orb, {
            x: () => target().x,
            y: () => target().y,
            scale: 0.42,
            autoAlpha: 1,
            zIndex: 40,
            duration: 0.8,
            ease: "power2.in",
          }, at);
          tl.fromTo(
            `[data-fd-dust="${i}"]`,
            { scale: 0.3, autoAlpha: 0.7 },
            { scale: 1.9, autoAlpha: 0, duration: 0.8, ease: "power1.out" },
            at + 0.75
          );
          tl.addLabel(`fd-land-${i + 1}`, at + 1.1);
        });

        // ── the pull quote types; the parent, its work delegated, rolls off
        tl.fromTo(".fd-word", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.7 }, 16.4);
        tl.to(".fd-track", { autoAlpha: 0, duration: 0.8 }, 16.4);
        tl.to(parent, { x: "60vw", rotation: 540, scale: 0.6, autoAlpha: 0, duration: 1.8, ease: "power1.in" }, 16.8);
        tl.addLabel("fd-done", 18.8);

        // ── the X-axis exit: everything sweeps off horizontally as you
        //    scroll away, gallery-title style — the orbit layer (with the
        //    landed orbs) rides the same sweep
        tl.to(".fd-exit", { x: "-55vw", autoAlpha: 0, stagger: 0.2, duration: 1.8, ease: "power2.in" }, 19.2);
        tl.to(".fd-orbitwrap", { x: "-55vw", autoAlpha: 0, duration: 1.8, ease: "power2.in" }, 19.4);
        tl.to(".fd-num", { autoAlpha: 0, duration: 1 }, 19.4);
        tl.addLabel("fd-out", 21.4);
        tl.to({}, { duration: 1 });
      });
    },
    { scope }
  );

  return (
    <section
      id="foundation"
      ref={scope}
      className="texture-grain relative overflow-hidden bg-evergreen text-parchment md:motion-safe:h-svh"
    >
      {/* arch architecture */}
      <svg aria-hidden className="absolute inset-0 z-0 w-full h-full opacity-[0.045]">
        <rect width="100%" height="100%" fill="url(#hero-arches)" />
      </svg>

      {/* giant outline numerals, sweeping behind (theatre) */}
      <div aria-hidden className="hidden md:motion-safe:block absolute inset-0 z-0 select-none">
        {foundation.focusAreas.map((area, i) => (
          <span
            key={area.num}
            className="fd-num absolute font-display font-black text-transparent text-[16vw] leading-none opacity-[0.16]"
            style={{
              WebkitTextStroke: "2px var(--color-evergreen-soft)",
              top: `${6 + i * 22}%`,
              left: i % 2 === 0 ? "58%" : "-6%",
            }}
          >
            {area.num}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-10 py-16 md:py-[2vw] md:h-full md:flex md:flex-col md:justify-center">
        {/* header — riding high */}
        <div className="fd-exit md:max-w-[54%]">
          <motion.p
            initial={theatre ? false : { scale: 0, rotate: -12, opacity: 0 }}
            whileInView={theatre ? undefined : { scale: 1, rotate: -3, opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="fd-sticker serif-soft inline-block font-serif italic text-[clamp(0.9375rem,1.5vw,1.125rem)] text-ink bg-marigold px-5 py-2 shadow-[4px_5px_0_rgba(4,26,21,0.45)] -rotate-3"
          >
            {foundation.eyebrow}
          </motion.p>

          <h2
            className="mt-8 md:mt-6 font-display font-black uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(2.5rem,5.8vw,4.75rem)]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            <FdCascade text={foundation.heading.line1} />
            <span className="block text-blush">
              <FdCascade text={foundation.heading.highlighted} inline />
            </span>
          </h2>

          <p className="fd-intro mt-6 text-[clamp(0.9375rem,1.3vw,1.0625rem)] leading-[1.65] text-parchment/75 max-w-[52ch]">
            {foundation.intro}
          </p>

          {/* pull quote — words revealed one by one in theatre */}
          <p className="serif-soft mt-6 md:mt-5 font-serif italic text-[clamp(1rem,1.5vw,1.25rem)] text-sage leading-[1.55] max-w-[48ch]">
            {foundation.pullQuote.split(" ").map((word, w) => (
              <span key={w} className="fd-word inline-block mr-[0.3em]">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* the orbit theatre — parent disc + four orbs (desktop) */}
        <div aria-hidden className="fd-orbitwrap hidden md:motion-safe:block absolute left-[70%] top-[34%] z-20">
          <div className="fd-pulse absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[24vw] aspect-square rounded-full border-[3px] border-marigold opacity-0" />
          {/* the orbit track the orbs will ride */}
          <div className="fd-track absolute left-1/2 top-1/2 -ml-[16vw] -mt-[11vh] w-[32vw] h-[22vh] rounded-[50%] border-2 border-dashed border-blush/40 opacity-0" />
          <div className="fd-parent absolute left-1/2 top-1/2 -ml-[85px] -mt-[85px] w-[170px] aspect-square">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-blush/60 bg-evergreen-deep relative">
              <Image src={contents.hero.images.together} alt="" fill sizes="170px" className="object-cover" />
            </div>
          </div>
          {foundation.focusAreas.map((area, i) => (
            <div key={area.num} className="fd-orb absolute left-1/2 top-1/2 -ml-[52px] -mt-[52px] w-[104px] aspect-square opacity-0">
              <div
                className="w-full h-full rounded-full flex items-center justify-center border-[3px] border-evergreen-deep shadow-[0_14px_30px_rgba(4,26,21,0.45)]"
                style={{ background: ORB_ACCENTS[i % ORB_ACCENTS.length] }}
              >
                <span className="font-display font-black text-ink text-2xl">{area.num}</span>
              </div>
            </div>
          ))}
        </div>

        {/* the four focus cards — pulled up toward the content */}
        <div className="fd-exit mt-12 md:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4">
          {foundation.focusAreas.map((area, i) => (
            <motion.article
              key={area.num}
              data-fd-card={i}
              initial={theatre ? false : { y: 40, opacity: 0 }}
              whileInView={theatre ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[1.25rem] bg-parchment text-ink px-6 pt-12 pb-6"
            >
              {/* the socket the orb slams into */}
              <div
                data-fd-socket={i}
                className="absolute -top-7 left-6 w-14 aspect-square rounded-full border-2 border-dashed border-parchment/70 md:border-blush/70"
              >
                <span
                  className="md:motion-safe:hidden absolute inset-1 rounded-full flex items-center justify-center font-display font-black text-ink text-sm"
                  style={{ background: ORB_ACCENTS[i % ORB_ACCENTS.length] }}
                >
                  {area.num}
                </span>
              </div>
              <div
                data-fd-dust={i}
                aria-hidden
                className="absolute -top-7 left-6 w-14 aspect-square rounded-full border-2 opacity-0"
                style={{ borderColor: ORB_ACCENTS[i % ORB_ACCENTS.length] }}
              />
              <h3
                className="font-display font-bold text-[1.05rem] leading-[1.2] mb-2.5"
                style={{ fontVariationSettings: "'wdth' 88" }}
              >
                {area.title}
              </h3>
              <p className="text-[0.85rem] leading-[1.6] text-ink/70">{area.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FdCascadeProps {
  readonly text: string;
  readonly inline?: boolean;
}

function FdCascade({ text, inline }: FdCascadeProps) {
  return (
    <span className={inline ? "inline" : "block"}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap mr-[0.22em] last:mr-0">
          {Array.from(word).map((letter, i) => (
            <span key={i} className="fd-slot inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom">
              <span className="fd-rise inline-block">
                <span className="fd-letter inline-block cursor-default transition-colors duration-300 hover:text-marigold">
                  {letter}
                </span>
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
