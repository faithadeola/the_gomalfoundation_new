"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";
import { useEntrancePhase } from "@features/splash/splash-context";
import { LogoMark } from "@ui/components/logo/logo-mark";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function SiteNav() {
  const { nav } = contents;
  const storyLink = nav.homeLinks[0];
  const phase = useEntrancePhase();
  const [menuOpen, setMenuOpen] = useState(false);

  // no page scroll behind the drawer
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={
          phase === "ssr"
            ? undefined
            : phase === "play"
              ? { y: [-80, 0], opacity: [0, 1] }
              : { y: -80, opacity: 0 }
        }
        transition={
          phase === "play" ? { duration: 0.7, ease: EASE_OUT, delay: 0.2 } : { duration: 0 }
        }
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label={nav.mainNavLabel}
          className="flex items-center justify-between px-5 md:px-9 py-5"
        >
          <Link href={ROUTES.HOME} className="text-coral hover:text-blush transition-colors">
            <LogoMark />
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href={storyLink.href}
              className="hidden sm:inline-flex items-center rounded-full bg-blush text-ink text-[0.8125rem] font-semibold tracking-wide px-5 py-2.5 hover:bg-parchment hover:-rotate-2 transition-all duration-300"
            >
              {storyLink.label}
            </Link>
            <Link
              href={ROUTES.GIVE}
              className="inline-flex items-center gap-2 rounded-full bg-coral text-ink text-[0.8125rem] font-semibold tracking-wide px-5 py-2.5 hover:bg-marigold hover:rotate-2 transition-all duration-300"
            >
              <svg viewBox="0 0 16 14" className="w-3.5 h-3.5 fill-ink" aria-hidden>
                <path d="M8 13.2 1.6 6.8a4 4 0 0 1 0-5.6 3.8 3.8 0 0 1 5.5 0L8 2.1l.9-.9a3.8 3.8 0 0 1 5.5 0 4 4 0 0 1 0 5.6L8 13.2Z" />
              </svg>
              {nav.giveCta}
            </Link>
            <Link
              href={ROUTES.PARTNERSHIP}
              className="hidden md:inline-flex items-center rounded-full border-2 border-blush/60 bg-ink/25 backdrop-blur-md text-blush text-[0.8125rem] font-semibold tracking-wide px-5 py-[0.5625rem] hover:bg-blush hover:text-ink hover:-rotate-2 transition-all duration-300"
            >
              {nav.homeLinks[3].label}
            </Link>
            {/* mobile menu trigger */}
            <button
              type="button"
              aria-label={menuOpen ? nav.closeMenuLabel : nav.openMenuLabel}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-ink/25 backdrop-blur-md text-parchment"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* mobile drawer */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-4%" }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="texture-grain fixed inset-0 z-40 bg-evergreen-deep md:hidden"
          >
            <nav
              aria-label={nav.mobileNavLabel}
              className="h-full flex flex-col justify-center px-8 pt-16"
            >
              <ul className="space-y-2">
                {nav.homeLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.12 + i * 0.07, duration: 0.5, ease: EASE_OUT }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-display font-black uppercase text-parchment text-[2.5rem] leading-[1.15] hover:text-marigold transition-colors"
                      style={{ fontVariationSettings: "'wdth' 84" }}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + nav.homeLinks.length * 0.07, duration: 0.5, ease: EASE_OUT }}
                >
                  <Link
                    href={ROUTES.TRIBUTES}
                    onClick={() => setMenuOpen(false)}
                    className="font-display font-black uppercase text-blush text-[2.5rem] leading-[1.15] hover:text-marigold transition-colors"
                    style={{ fontVariationSettings: "'wdth' 84" }}
                  >
                    {nav.innerLinks[2].label}
                  </Link>
                </motion.li>
              </ul>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5, ease: EASE_OUT }}
                className="mt-10"
              >
                <Link
                  href={ROUTES.GIVE}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-7 py-3"
                >
                  {nav.giveCtaFull}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
