"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { contents } from "@contents";
import { useLetterRipple } from "@shared/hooks/use-letter-ripple";
import { useEntrancePhase, type EntrancePhase } from "@features/splash/splash-context";

const CASCADE_BASE_DELAY = 0.35;
const CASCADE_STAGGER = 0.04;

export function HeroHeadline() {
  const { hero } = contents;
  const scope = useRef<HTMLDivElement>(null);
  const phase = useEntrancePhase();

  useLetterRipple(scope, {
    selector: ".hl-letter",
    measureClosest: ".hl-slot",
    radius: 190,
    lift: 30,
    rotate: 11,
  });

  const lineOneLetterCount = hero.headline.lineOne.replace(/\s/g, "").length;

  return (
    <div ref={scope} className="relative z-20 px-5 md:px-12 max-w-[1400px] max-md:text-center">
      {/* the two display lines, letter by letter */}
      <h1
        aria-label={hero.ariaLabel}
        className="font-display font-black uppercase leading-[0.88] tracking-[-0.02em] text-[clamp(4.25rem,14.5vw,13.5rem)]"
        style={{ fontVariationSettings: "'wdth' 84" }}
      >
        <HeadlineLine
          text={hero.headline.lineOne}
          className="text-parchment"
          startIndex={0}
          phase={phase}
        />
        <HeadlineLine
          text={hero.headline.lineTwo}
          className="text-blush"
          startIndex={lineOneLetterCount}
          phase={phase}
          trailing={<ApostropheSwoosh />}
        />
      </h1>

      {/* the exclaim — serif on a highlighter bar */}
      <motion.p
        initial={false}
        animate={
          phase === "ssr" ? undefined : phase === "play" ? { opacity: [0, 1] } : { opacity: 0 }
        }
        transition={phase === "play" ? { delay: 1.15, duration: 0.01 } : { duration: 0 }}
        className="hero-exclaim mt-6 md:mt-9 -rotate-1"
      >
        <span className="relative inline-block px-4 py-1.5">
          <motion.span
            initial={false}
            animate={
              phase === "ssr" ? undefined : phase === "play" ? { scaleX: [0, 1] } : { scaleX: 0 }
            }
            transition={
              phase === "play"
                ? { delay: 1.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 }
            }
            className="absolute inset-0 origin-left bg-marigold"
            aria-hidden
          />
          <span className="serif-soft relative z-10 font-serif italic text-ink text-[clamp(1.375rem,3.4vw,2.625rem)]">
            {hero.headline.exclaim}
          </span>
        </span>
      </motion.p>

      {/* the two of them, named */}
      <motion.div
        initial={false}
        animate={
          phase === "ssr"
            ? undefined
            : phase === "play"
              ? { y: [24, 0], opacity: [0, 1] }
              : { y: 24, opacity: 0 }
        }
        transition={
          phase === "play"
            ? { delay: 1.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }
        }
        className="hero-chips mt-9 md:mt-11 flex flex-wrap gap-2.5 max-md:justify-center"
      >
        <NameChip name={hero.phases.baba.name} dates={hero.phases.baba.dates} />
        <NameChip name={hero.phases.mama.name} dates={hero.phases.mama.dates} />
      </motion.div>
    </div>
  );
}

interface HeadlineLineProps {
  readonly text: string;
  readonly startIndex: number;
  readonly phase: EntrancePhase;
  readonly className?: string;
  readonly trailing?: React.ReactNode;
}

function HeadlineLine({ text, startIndex, phase, className, trailing }: HeadlineLineProps) {
  const words = text.split(" ");
  let letterIndex = startIndex;

  return (
    <span className={`block ${className ?? ""}`}>
      {words.map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap mr-[0.22em] last:mr-0">
          {Array.from(word).map((letter, i) => {
            const delay = CASCADE_BASE_DELAY + letterIndex * CASCADE_STAGGER;
            letterIndex += 1;
            return (
              <span
                key={i}
                className="hl-slot inline-block overflow-hidden pb-[0.06em] -mb-[0.06em] align-bottom"
              >
                <motion.span
                  initial={false}
                  animate={
                    phase === "ssr"
                      ? undefined
                      : phase === "play"
                        ? { y: ["115%", "0%"], rotate: [9, 0], opacity: [0, 1] }
                        : { y: "115%", rotate: 9, opacity: 0 }
                  }
                  transition={
                    phase === "play"
                      ? { delay, type: "spring", stiffness: 320, damping: 26 }
                      : { duration: 0 }
                  }
                  className="inline-block"
                >
                  {/* .hl-exit — the theatre's Act I folds letters up
                      through the mask on this dedicated layer */}
                  <span className="hl-exit inline-block">
                    <span className="hl-letter inline-block cursor-default transition-colors duration-300 hover:text-marigold">
                      {letter}
                    </span>
                  </span>
                </motion.span>
              </span>
            );
          })}
          {w === words.length - 1 ? trailing : null}
        </span>
      ))}
    </span>
  );
}

/** The lilac swoosh, closing the second line like a punctuation mark. */
function ApostropheSwoosh() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className="inline-block w-[0.36em] align-top ml-[0.08em] -mt-[0.04em]"
      animate={reduce ? undefined : { y: [0, -10, 0], rotate: [0, 7, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 220" className="w-full h-auto">
        <path
          d="M186 12 C 150 40 128 84 132 138 C 135 180 112 208 76 214 C 40 220 12 196 10 162 C 40 178 68 170 82 142 C 100 106 120 48 186 12 Z"
          fill="var(--color-lilac)"
        />
      </svg>
    </motion.span>
  );
}

interface NameChipProps {
  readonly name: string;
  readonly dates: string;
}

function NameChip({ name, dates }: NameChipProps) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-full border-2 border-blush/40 px-4 py-2">
      <span className="text-[0.8125rem] font-semibold tracking-wide text-parchment">{name}</span>
      <span className="serif-soft font-serif italic text-[0.8125rem] text-blush">{dates}</span>
    </span>
  );
}
