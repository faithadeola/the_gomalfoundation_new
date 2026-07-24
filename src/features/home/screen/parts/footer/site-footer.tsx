"use client";

import Link from "next/link";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";
import { LogoMark } from "@ui/components/logo/logo-mark";
import { Rise } from "@ui/components/reveal/rise";

/**
 * The footer — the site closes the way it opened: with the wordmark.
 * The GOMAL letters rise in blush, and the songbird glides in to perch
 * on the final letter.
 */
export function SiteFooter() {
  const { footer, site } = contents;

  return (
    <footer className="texture-grain relative overflow-hidden bg-evergreen-deep text-parchment">
      <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-8">
        {/* top — blurb + link columns */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 md:gap-14 pb-14 border-b border-parchment/10">
          <Rise>
            <LogoMark className="text-coral mb-5" />
            <p className="serif-soft font-serif italic text-[1rem] leading-[1.6] text-parchment/75 max-w-[38ch]">
              {footer.blurb}
            </p>
            <p className="mt-4 text-[0.8125rem] text-parchment/50">{site.address.full}</p>
          </Rise>
          <Rise delay={0.12}>
          <nav aria-label={footer.foundationHeading}>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-4">
              {footer.foundationHeading}
            </p>
            <ul className="space-y-2.5">
              {footer.foundationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-parchment/75 hover:text-marigold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          </Rise>
          <Rise delay={0.24}>
          <nav aria-label={footer.getInvolvedHeading}>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-4">
              {footer.getInvolvedHeading}
            </p>
            <ul className="space-y-2.5">
              {footer.actionLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-parchment/75 hover:text-marigold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ROUTES.GIVE}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-coral text-ink text-[0.8125rem] font-semibold px-6 py-2.5 hover:bg-marigold transition-colors duration-300"
            >
              {footer.giveCta}
            </Link>
          </nav>
          </Rise>
        </div>

        {/* legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-0">
          <p className="text-[0.75rem] text-parchment/45">{footer.copyright}</p>
          <p className="serif-soft font-serif italic text-[0.75rem] text-parchment/45">{site.contact.foundationEmail}</p>
        </div>
      </div>
    </footer>
  );
}
