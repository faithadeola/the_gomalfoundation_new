"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section — Give: the curtain reveal.
 * This section drives ITSELF: when it scrolls into view, the green
 * curtain draws off to the left, "Support the work they started."
 * settles on the parchment beneath, and the two cards slide in from
 * opposite sides. Scroll away and everything returns the way it came.
 * No pin, no scrub — a performance that plays on arrival.
 */
export function GiveSection() {
  const scope = useRef<HTMLElement>(null);
  const squiggleRef = useRef<SVGPathElement>(null);
  const { give } = contents;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stage = scope.current;
        if (!stage) return;

        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: stage,
            start: "top 62%",
            end: "bottom 30%",
            toggleActions: "play reverse play reverse",
          },
        });

        // curtain draws off left
        tl.to(".gv-curtain", { xPercent: -101, duration: 1.1, ease: "power3.inOut" }, 0);
        // heading settles
        tl.fromTo(".gv-lead", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.55);
        // the cards arrive from opposite sides — no flips, just entrances
        tl.fromTo(
          ".gv-card-give",
          { x: "-70vw", rotation: -4, autoAlpha: 0 },
          { x: "0vw", rotation: 0, autoAlpha: 1, duration: 0.85, ease: "back.out(1.15)" },
          0.8
        );
        tl.fromTo(
          ".gv-card-bank",
          { x: "70vw", rotation: 4, autoAlpha: 0 },
          { x: "0vw", rotation: 0, autoAlpha: 1, duration: 0.85, ease: "back.out(1.15)" },
          0.95
        );
        // account digits flicker in like a mini odometer
        tl.fromTo(
          ".gv-digit",
          { yPercent: -45, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, stagger: 0.045, duration: 0.4 },
          1.35
        );
        // the squiggle underlines the ask
        const path = squiggleRef.current;
        if (path) {
          const length = path.getTotalLength();
          tl.fromTo(
            path,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.1, ease: "power2.out" },
            1.5
          );
        }
        tl.fromTo(".gv-trust", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.9);
      });
    },
    { scope }
  );

  return (
    <section
      id="give"
      ref={scope}
      className="texture-grain relative overflow-hidden bg-parchment text-ink"
    >
      {/* the green curtain over everything (motion-safe) */}
      <div
        aria-hidden
        className="gv-curtain motion-reduce:hidden absolute inset-0 z-30 bg-evergreen-deep pointer-events-none"
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.045]">
          <rect width="100%" height="100%" fill="url(#hero-arches)" />
        </svg>
        {/* squiggle trim on the curtain's leading edge */}
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
      </div>

      {/* the room — centred */}
      <div className="relative z-10 max-w-[1040px] mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
        <div className="gv-lead motion-safe:opacity-0">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-ink/50 mb-3">{give.eyebrow}</p>
          <h2
            className="font-display font-black uppercase text-[clamp(1.875rem,4vw,3.25rem)] leading-[1.05]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {give.heading}
          </h2>
          <p className="serif-soft mt-3 font-serif italic text-ink/60 text-[clamp(1rem,1.6vw,1.25rem)]">
            {give.body}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start text-left">
          <div className="gv-card-give rounded-[1.5rem] bg-parchment-deep/60 border border-ink/10 px-7 py-7 md:px-8 md:py-8">
            <h3 className="font-display font-bold text-[1.25rem] mb-1.5" style={{ fontVariationSettings: "'wdth' 88" }}>
              {give.card.heading}
            </h3>
            <p className="text-[0.875rem] text-ink/65 mb-5">{give.card.subheading}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {give.card.presetValuesNaira.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center rounded-full border-2 border-ink/15 px-4 py-1.5 text-[0.8125rem] font-semibold"
                >
                  {give.card.currencySymbol}
                  {value.toLocaleString("en-US")}
                </span>
              ))}
            </div>
            <Link
              href={ROUTES.GIVE}
              className="inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-7 py-3 hover:bg-marigold transition-colors duration-300"
            >
              {give.card.ctaIdle}
            </Link>
          </div>

          <div className="gv-card-bank rounded-[1.5rem] bg-evergreen-deep text-parchment px-7 py-7 md:px-8 md:py-8">
            <h3 className="font-display font-bold text-[1.125rem] mb-4" style={{ fontVariationSettings: "'wdth' 88" }}>
              {give.bank.heading}
            </h3>
            <BankRow label={give.bank.accountNameLabel} value={give.bank.accountName} />
            <BankRow label={give.bank.bankLabel} value={give.bank.bankName} />
            <BankAccountRow />
            <p className="mt-4 text-[0.75rem] leading-[1.55] text-parchment/55">{give.bank.afterTransferNote}</p>
          </div>
        </div>

        {/* the squiggle underline + trust */}
        <div className="mt-10">
          <svg viewBox="0 0 900 40" className="motion-reduce:hidden w-full max-w-[760px] mx-auto h-7" aria-hidden>
            <path
              ref={squiggleRef}
              d="M10 24 c 45 -22 90 22 135 0 s 90 22 135 0 s 90 22 135 0 s 90 22 135 0 s 90 22 135 0 s 90 22 135 0"
              fill="none"
              stroke="var(--color-marigold)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <p className="gv-trust mt-3 text-[0.75rem] font-semibold tracking-wide text-ink/50 motion-safe:opacity-0">
            {give.trustSignal}
          </p>
        </div>
      </div>
    </section>
  );
}

interface BankRowProps {
  readonly label: string;
  readonly value: string;
}

function BankRow({ label, value }: BankRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-parchment/10">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-parchment/45">{label}</span>
      <span className="text-[0.9375rem] font-semibold">{value}</span>
    </div>
  );
}

/** Account number row — digits flicker in, copy stamps. */
function BankAccountRow() {
  const { bank } = contents.give;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bank.accountNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — the number stays selectable
    }
  };

  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-parchment/10">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-parchment/45">
        {bank.accountNumberLabel}
      </span>
      <span className="flex items-center gap-2.5">
        <span className="font-display font-bold text-[1.0625rem] tracking-[0.06em] inline-flex overflow-hidden">
          {Array.from(bank.accountNumber).map((digit, i) => (
            <span key={i} className="gv-digit inline-block">
              {digit}
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-parchment text-ink text-[0.6875rem] font-semibold px-3 py-1 active:scale-90 transition-transform duration-150"
        >
          {copied ? bank.copiedLabel : bank.copyLabel}
        </button>
      </span>
    </div>
  );
}
