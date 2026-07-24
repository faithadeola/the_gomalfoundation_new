"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { contents } from "@contents";
import { SiteNav } from "@features/home/screen/parts/navigation/site-nav";
import { SiteFooter } from "@features/home/screen/parts/footer/site-footer";

export function TributesScreen() {
  const { tributes, site } = contents;

  return (
    <>
      <SiteNav />
      <main className="bg-evergreen-deep text-parchment">
        {/* header */}
        <div className="texture-grain relative overflow-hidden pt-32 pb-16 px-6 text-center border-b border-parchment/10">
          <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-blush/50">
            <Image
              src={tributes.page.portrait.src}
              alt={tributes.page.portrait.alt}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-3">
            {tributes.page.eyebrow}
          </p>
          <h1
            className="font-display font-black uppercase text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {tributes.page.headingCount}{" "}
            <span className="text-blush">{tributes.page.headingSuffix}</span>
          </h1>
          <p className="serif-soft mt-3 font-serif italic text-sage text-[1.0625rem]">
            {tributes.page.subheading}
          </p>
          <a
            href={`mailto:${site.contact.foundationEmail}`}
            className="mt-7 inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300"
          >
            {tributes.page.cta}
          </a>
        </div>

        {/* the wall */}
        <div className="texture-grain relative bg-parchment text-ink py-16 px-6 md:px-10">
          <div className="max-w-[1240px] mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {/* the empty slot — yours */}
            <a
              href={`mailto:${site.contact.foundationEmail}`}
              className="break-inside-avoid block rounded-xl border-2 border-dashed border-ink/25 px-6 py-8 text-center hover:border-coral hover:-rotate-1 transition-all duration-300"
            >
              <p className="serif-soft font-serif italic text-[1rem] text-ink/55">
                {tributes.page.addYoursSlotLabel}
              </p>
              <p className="mt-3 text-[0.8125rem] font-semibold text-coral">{tributes.page.cta} →</p>
            </a>

            {tributes.all.map((tribute, i) => (
              <motion.blockquote
                key={tribute.id}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="break-inside-avoid rounded-xl bg-parchment-deep/60 border border-ink/10 px-6 py-5"
              >
                <p className="serif-soft font-serif italic text-[0.9375rem] leading-[1.6]">
                  &ldquo;{tribute.text}&rdquo;
                </p>
                <footer className="mt-3 text-[0.75rem] font-semibold text-ink/55">
                  {tribute.name} · {tribute.relation}
                </footer>
              </motion.blockquote>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={`mailto:${site.contact.foundationEmail}`}
              className="inline-flex items-center rounded-full bg-evergreen-deep text-parchment text-[0.9375rem] font-semibold px-8 py-3 hover:bg-coral hover:text-ink transition-colors duration-300"
            >
              {tributes.page.bottomCta}
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
