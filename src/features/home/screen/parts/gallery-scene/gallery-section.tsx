"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";

gsap.registerPlugin(ScrollTrigger);

/** Photos per strip; the 12 gallery images are dealt across three rows. */
const ROWS = 3;

/** How much a centred photo grows. */
const CENTER_SCALE = 0.24;

/**
 * Section — the album as a camera roll.
 * The title writes itself in from the left and exits right. Then three
 * film strips shear past each other — rows sliding in opposite
 * directions like the Partner-With-Us marquee — and whatever sits at
 * the centre of each strip swells so you can see it. The worship
 * photograph rises to close.
 */
export function GallerySection() {
  const scope = useRef<HTMLElement>(null);
  const { gallery } = contents;

  // deal the images across three strips, doubled for length
  const strips = Array.from({ length: ROWS }, (_, r) => {
    const rowImages = gallery.images.filter((_, i) => i % ROWS === r);
    return [...rowImages, ...rowImages, ...rowImages];
  });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const rows = gsap.utils.toArray<HTMLElement>(".ga-row");
        const photos = gsap.utils.toArray<HTMLElement>(".ga-photo");
        if (rows.length === 0) return;

        // centred photos swell — pure function of current positions,
        // so it's scrub-reversible for free
        const centerScale = () => {
          const mid = window.innerWidth / 2;
          photos.forEach((photo) => {
            const rect = photo.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - mid);
            const falloff = Math.max(0, 1 - distance / (window.innerWidth * 0.3));
            const s = falloff * falloff * (3 - 2 * falloff);
            gsap.set(photo, { scale: 1 + CENTER_SCALE * s, zIndex: Math.round(10 + s * 20) });
          });
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "+=420%",
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
            onUpdate: centerScale,
            onRefresh: centerScale,
          },
        });

        // ── the title sweeps through: writes in from the left, exits
        //    right (0 → 4)
        tl.fromTo(".ga-title", { x: "-45vw", autoAlpha: 0 }, { x: "0vw", autoAlpha: 1, duration: 1.6, ease: "power2.out" }, 0.2);
        tl.fromTo(".ga-title-char", { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.03, duration: 0.02 }, 0.5);
        tl.to(".ga-title", { x: "55vw", autoAlpha: 0, duration: 1.6, ease: "power2.in" }, 2.6);
        tl.addLabel("ga-title-out", 4.2);

        // ── the strips surface (3.6 → 5)
        tl.fromTo(".ga-roll", { autoAlpha: 0, y: "6vh" }, { autoAlpha: 1, y: "0vh", duration: 1.4 }, 3.6);

        // ── the shear (4.5 → 16): alternating directions, slightly
        //    different speeds so the roll reads deep
        rows.forEach((row, r) => {
          const dir = r % 2 === 0 ? -1 : 1;
          // strips are ~3× viewport wide; keep the window covered while
          // travelling ~40% of the strip in alternating directions
          const nearEdge = -10 - r * 2;
          const farEdge = -50 - r * 2;
          const from = dir === -1 ? nearEdge : farEdge;
          const to = dir === -1 ? farEdge : nearEdge;
          tl.fromTo(row, { xPercent: from }, { xPercent: to, duration: 12 }, 4.5);
        });
        tl.addLabel("ga-roll-mid", 11);

        // ── the centrepiece rises out of the roll (16.5 → 19.5)
        tl.to(".ga-roll", { autoAlpha: 0.25, duration: 1.6 }, 16.5);
        tl.fromTo(
          ".ga-center",
          { autoAlpha: 0, scale: 0.5, rotation: -7, y: "8vh" },
          { autoAlpha: 1, scale: 1, rotation: -2, y: "0vh", duration: 2.2, ease: "power2.out" },
          16.8
        );
        tl.fromTo(".ga-caption", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1 }, 18.4);
        tl.addLabel("ga-done", 19.8);
        tl.to({}, { duration: 1.4 });
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="texture-grain relative overflow-hidden bg-evergreen text-parchment md:motion-safe:h-svh"
    >
      <svg aria-hidden className="absolute inset-0 z-0 w-full h-full opacity-[0.04]">
        <rect width="100%" height="100%" fill="url(#hero-arches)" />
      </svg>

      {/* ───────── theatre ───────── */}
      <div className="hidden md:motion-safe:block absolute inset-0">
        {/* the sweeping title */}
        <div className="ga-title absolute inset-x-0 top-[44%] text-center opacity-0 pointer-events-none">
          <p className="text-[12px] font-semibold tracking-[0.22em] uppercase text-blush mb-3">{gallery.eyebrow}</p>
          <p
            className="font-display font-black uppercase text-[clamp(2.25rem,5vw,4.25rem)]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {Array.from(gallery.heading).map((char, i) => (
              <span key={i} className="ga-title-char">
                {char}
              </span>
            ))}
          </p>
        </div>

        {/* the camera roll — three strips (outer div owns the centering
            transform; the inner .ga-roll is GSAP's to animate) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="ga-roll space-y-[2.2vh] opacity-0">
          {strips.map((strip, r) => (
            <div key={r} className="relative">
              {/* sprocket holes */}
              <div
                aria-hidden
                className="absolute -top-[1.1vh] inset-x-0 h-[1vh] opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--color-parchment) 0 8px, transparent 8px 26px)",
                }}
              />
              <div className="ga-row flex gap-[1.2vw] w-max">
                {strip.map((image, i) => (
                  <div key={`${image.src}-${i}`} className="ga-photo shrink-0 w-[19vw] will-change-transform">
                    <div className="bg-parchment p-[0.4vw] pb-[1.4vh] rounded-sm shadow-[0_14px_36px_rgba(4,26,21,0.5)]">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={image.src} alt={image.alt} fill sizes="19vw" className="object-cover" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                aria-hidden
                className="absolute -bottom-[1.1vh] inset-x-0 h-[1vh] opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, var(--color-parchment) 0 8px, transparent 8px 26px)",
                }}
              />
            </div>
          ))}
          </div>
        </div>

        {/* centrepiece */}
        <div className="absolute left-1/2 top-1/2">
          <div className="ga-center absolute z-50 -ml-[17vw] -mt-[21vh] w-[34vw] opacity-0">
            <div className="bg-parchment p-[0.7vw] pb-[3.2vh] rounded-sm shadow-[0_36px_90px_rgba(4,26,21,0.65)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={gallery.centerpiece.src}
                  alt={gallery.centerpiece.alt}
                  fill
                  sizes="34vw"
                  className="object-cover"
                />
              </div>
              <p className="ga-caption serif-soft absolute bottom-[0.7vh] inset-x-0 text-center font-serif italic text-ink text-[1.5vh] opacity-0">
                {gallery.centerpiece.caption}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ───────── side-to-side fallback (mobile / reduced motion) ───────── */}
      <div className="md:motion-safe:hidden relative z-10 py-16">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-blush mb-2 text-center px-6">
          {gallery.eyebrow}
        </p>
        <p
          className="text-center font-display font-black uppercase text-[clamp(1.75rem,7vw,2.5rem)] mb-8 px-6"
          style={{ fontVariationSettings: "'wdth' 84" }}
        >
          {gallery.heading}
        </p>
        <div className="space-y-4">
          {strips.map((strip, r) => (
            <div key={r} className="overflow-x-auto snap-x snap-mandatory flex gap-3 px-6 pb-2">
              {strip.slice(0, 8).map((image, i) => (
                <div key={`${image.src}-${i}`} className="snap-center shrink-0 w-[68vw] bg-parchment p-2 pb-4 rounded-sm">
                  <div className="relative aspect-[4/3]">
                    <Image src={image.src} alt={image.alt} fill sizes="68vw" className="object-cover" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 px-6 max-w-[420px] mx-auto bg-parchment p-2 pb-6 rounded-sm relative">
          <div className="relative aspect-[4/3]">
            <Image src={gallery.centerpiece.src} alt={gallery.centerpiece.alt} fill sizes="90vw" className="object-cover" />
          </div>
          <p className="serif-soft absolute bottom-1 inset-x-0 text-center font-serif italic text-ink text-[0.75rem]">
            {gallery.centerpiece.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
