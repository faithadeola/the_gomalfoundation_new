"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";

gsap.registerPlugin(ScrollTrigger);

/** Rows per odometer strip: 0–9 then 0 again for a seamless wrap. */
const STRIP_ROWS = 11;

/**
 * The word arrives in three pieces, each carrying a portrait like a
 * water droplet: GO (Baba clinging on top) from the top-left, MA
 * (Mama hanging beneath) from the bottom, L (the two of them together,
 * on top) from the top-right.
 */
const SEGMENTS = [
  {
    text: "GO",
    from: { x: "-46vw", y: "-46vh", rotation: -300 },
    disc: "baba" as const,
    discSide: "top" as const,
    exit: { y: "-55vh" },
  },
  {
    text: "MA",
    from: { x: "0vw", y: "64vh", rotation: 220 },
    disc: "mama" as const,
    discSide: "bottom" as const,
    exit: { y: "55vh" },
  },
  {
    text: "L",
    from: { x: "46vw", y: "-46vh", rotation: 300 },
    disc: "together" as const,
    discSide: "top" as const,
    exit: { y: "-55vh" },
  },
];

/**
 * Section 4 — the wordmark + the number.
 * GO / MA / L converge with their portrait droplets; the droplets
 * detach and fly; the curtain draws off left while GOMAL itself stays —
 * recoloring and gliding to the top of the revealed parchment — and
 * then the odometer counts, properly: units rolling 0–9, tens carrying,
 * the whole thing in ~3 real seconds.
 */
export function WordmarkSection() {
  const scope = useRef<HTMLElement>(null);
  const { multiplicationWall } = contents;

  const target = multiplicationWall.counterTarget;
  const digitChars = Array.from(String(target)); // no comma

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // mobile: simple count-up
      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        const el = scope.current?.querySelector<HTMLElement>(".wm2-mobile-count");
        if (!el) return;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const segs = gsap.utils.toArray<HTMLElement>(".wm3-seg");
        const strips = gsap.utils.toArray<HTMLElement>(".wm3-strip");

        // ── the true odometer: one value, every wheel geared to it
        const value = { v: 0 };
        const layoutDigits = () => {
          strips.forEach((strip) => {
            const place = Number(strip.dataset.place ?? "0");
            const p = (value.v / Math.pow(10, place)) % 10;
            gsap.set(strip, { yPercent: -(p * 100) / STRIP_ROWS });
          });
        };
        layoutDigits();
        let countTween: gsap.core.Tween | null = null;
        const playCount = () => {
          countTween?.kill();
          value.v = 0;
          layoutDigits();
          countTween = gsap.to(value, {
            v: target,
            duration: 3,
            ease: "power2.out",
            onUpdate: layoutDigits,
          });
        };
        const resetCount = () => {
          countTween?.kill();
          value.v = 0;
          layoutDigits();
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=340%",
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

        tl.fromTo(".wm2-eyebrow", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.3);

        // ── the three pieces converge (0.6 → 5.2)
        segs.forEach((seg, i) => {
          tl.fromTo(
            seg,
            { ...SEGMENTS[i].from, autoAlpha: 0 },
            { x: "0vw", y: "0vh", rotation: 0, autoAlpha: 1, duration: 2.2, ease: "power2.out" },
            0.6 + i * 0.9
          );
        });
        tl.addLabel("wm-word", 5.2);

        // ── the droplets let go (6 → 8)
        segs.forEach((seg, i) => {
          tl.to(
            seg.querySelector(".wm3-disc"),
            { ...SEGMENTS[i].exit, autoAlpha: 0, rotation: 140, duration: 1.6, ease: "power2.in" },
            6 + i * 0.3
          );
        });

        // ── the curtain draws off left; GOMAL stays, recolors, and
        //    glides to the top of the parchment (8.2 → 11.6)
        tl.to(".wm3-curtain", { xPercent: -101, duration: 3.4, ease: "power2.inOut" }, 8.2);
        tl.to(".wm3-word", { y: "-31vh", scale: 0.48, duration: 2.8, ease: "power2.inOut" }, 8.5);
        tl.to(".wm3-letter", { color: "#093b31", duration: 2.4 }, 8.7);
        tl.addLabel("wm-cleared", 11.8);

        // the count runs in real time once the curtain has cleared;
        // scrolling back up resets it to zero
        tl.call(
          () => {
            const st = tl.scrollTrigger;
            if (st && st.direction < 0) resetCount();
            else playCount();
          },
          [],
          12
        );

        // caption
        tl.fromTo(".wm2-cap-word", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.8 }, 13);
        tl.fromTo(".wm2-sub", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 14.1);
        tl.addLabel("wm-done", 15.2);
        tl.to({}, { duration: 1.2 });
      });
    },
    { scope }
  );

  const portraitSrc = {
    baba: contents.hero.images.baba,
    mama: contents.hero.images.mama,
    together: contents.hero.images.together,
  };

  return (
    <section
      id="legacy"
      ref={scope}
      className="texture-grain relative overflow-hidden bg-parchment text-ink md:motion-safe:h-svh"
    >
      {/* ───────── theatre (desktop, motion-safe) ───────── */}
      <div className="hidden md:motion-safe:block absolute inset-0">
        {/* base layer — parchment, the odometer waiting at zero */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-x-0 top-[34%] flex items-center justify-center gap-[0.7vw]">
            {digitChars.map((_, i) => {
              const place = digitChars.length - 1 - i;
              return (
                <span
                  key={i}
                  className="wm3-window relative block h-[20vh] w-[11vh] overflow-hidden rounded-[1vh] bg-evergreen-deep shadow-[inset_0_12px_22px_rgba(4,26,21,0.6),inset_0_-12px_22px_rgba(4,26,21,0.6),0_16px_40px_rgba(18,48,42,0.25)]"
                >
                  <span className="wm3-strip block" data-place={place}>
                    {Array.from({ length: STRIP_ROWS }, (_, r) => (r === 10 ? 0 : r)).map((d, r) => (
                      <span
                        key={r}
                        className="flex h-[20vh] items-center justify-center font-display font-black text-marigold text-[13vh] leading-none"
                      >
                        {d}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </div>

          {/* caption on parchment */}
          <div className="absolute inset-x-0 top-[64%] text-center px-8">
            <p
              className="font-display font-black uppercase text-ink text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.05]"
              style={{ fontVariationSettings: "'wdth' 84" }}
            >
              {multiplicationWall.headingAfterCounter.split(" ").map((word, w) => (
                <span key={w} className="wm2-cap-word inline-block mr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>
            <p className="wm2-sub serif-soft mt-3 font-serif italic text-ink/60 text-[clamp(1rem,1.6vw,1.375rem)]">
              {multiplicationWall.subheading}
            </p>
          </div>
        </div>

        {/* the curtain — evergreen + pattern; it leaves, the word doesn't */}
        <div className="wm3-curtain absolute inset-0 z-10 bg-evergreen-deep">
          <svg aria-hidden className="absolute inset-0 w-full h-full opacity-[0.045]">
            <rect width="100%" height="100%" fill="url(#hero-arches)" />
          </svg>
          <svg
            aria-hidden
            viewBox="0 0 40 800"
            preserveAspectRatio="none"
            className="absolute -right-[18px] top-0 h-full w-[36px]"
          >
            <path
              d="M20 0 c 22 40 -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 120 s -22 80 0 80"
              fill="none"
              stroke="var(--color-marigold)"
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
          <p className="wm2-eyebrow absolute top-[9%] left-1/2 -translate-x-1/2 text-[12px] font-semibold tracking-[0.22em] uppercase text-blush opacity-0">
            {multiplicationWall.eyebrow}
          </p>
        </div>

        {/* the word — above the curtain, it stays for the whole scene */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="wm3-word flex items-center gap-[1vw]">
            {SEGMENTS.map((segment) => (
              <div key={segment.text} className="wm3-seg relative opacity-0 will-change-transform">
                <span
                  className="wm3-letter block font-display font-black text-parchment/95 text-[16vw] leading-none"
                  style={{ fontVariationSettings: "'wdth' 84" }}
                >
                  {segment.text}
                </span>
                {/* the droplet */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 ${
                    segment.discSide === "top" ? "-top-[6.5vw]" : "-bottom-[6.5vw]"
                  }`}
                >
                  <span className="wm3-disc block w-[8.5vw] aspect-square rounded-full overflow-hidden border-[0.45vw] border-blush/70 bg-evergreen shadow-[0_14px_34px_rgba(4,26,21,0.5)] relative">
                    <Image
                      src={portraitSrc[segment.disc]}
                      alt=""
                      fill
                      sizes="9vw"
                      className="object-cover"
                    />
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── flowing fallback (mobile / reduced motion) ───────── */}
      <div className="md:motion-safe:hidden relative z-10 max-w-[720px] mx-auto px-6 py-20 text-center">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-coral mb-6">
          {multiplicationWall.eyebrow}
        </p>
        <p
          className="wm2-mobile-count font-display font-black text-coral text-[clamp(4.5rem,20vw,8rem)] leading-none"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {String(target)}
        </p>
        <p
          className="mt-3 font-display font-black uppercase text-ink text-[clamp(1.5rem,6vw,2.25rem)] leading-[1.1]"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {multiplicationWall.headingAfterCounter}
        </p>
        <p className="serif-soft mt-4 font-serif italic text-ink/60 text-[1.0625rem]">
          {multiplicationWall.subheading}
        </p>
      </div>
    </section>
  );
}
