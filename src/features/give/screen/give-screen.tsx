"use client";

import { useState } from "react";
import { contents } from "@contents";
import { SiteNav } from "@features/home/screen/parts/navigation/site-nav";
import { SiteFooter } from "@features/home/screen/parts/footer/site-footer";

export function GiveScreen() {
  const { give } = contents;

  return (
    <>
      <SiteNav />
      <main className="bg-evergreen-deep text-parchment">
        {/* mini hero */}
        <div className="texture-grain relative overflow-hidden pt-32 pb-14 px-6 text-center border-b border-parchment/10">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-3">
            {give.miniHero.eyebrow}
          </p>
          <h1
            className="font-display font-black uppercase text-[clamp(1.75rem,4vw,2.75rem)] mb-2"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {give.miniHero.title}
          </h1>
          <p className="text-[0.8125rem] text-parchment/60 mb-5">{give.miniHero.dates}</p>
          <p className="serif-soft font-serif italic text-sage text-[1.0625rem]">
            &ldquo;{give.miniHero.quote}&rdquo;
          </p>
        </div>

        {/* give body */}
        <div className="texture-grain relative bg-parchment text-ink py-16 px-6 md:px-10">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink/45 mb-3">{give.eyebrow}</p>
            <h2
              className="font-display font-black uppercase text-[clamp(1.75rem,3.6vw,2.75rem)] mb-2"
              style={{ fontVariationSettings: "'wdth' 84" }}
            >
              {give.heading}
            </h2>
            <p className="serif-soft font-serif italic text-ink/60 text-[1.0625rem] mb-12 max-w-[52ch]">{give.body}</p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
              {/* give card */}
              <div className="rounded-[1.5rem] bg-parchment-deep/60 border border-ink/10 px-7 py-7 md:px-9 md:py-8">
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
                <a
                  href={`mailto:${contents.site.contact.giveEmail}`}
                  className="inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300"
                >
                  {give.card.ctaIdle}
                </a>
                <div className="mt-5 space-y-1.5">
                  <p className="text-[0.8125rem] text-ink/55">{give.card.tertiaryLinks.partner}</p>
                  <p className="text-[0.8125rem] text-ink/55">{give.card.tertiaryLinks.volunteer}</p>
                </div>
              </div>

              {/* bank card */}
              <div className="rounded-[1.5rem] bg-evergreen-deep text-parchment px-7 py-7">
                <h3 className="font-display font-bold text-[1.125rem] mb-4" style={{ fontVariationSettings: "'wdth' 88" }}>
                  {give.bank.heading}
                </h3>
                <GiveBankRow label={give.bank.accountNameLabel} value={give.bank.accountName} />
                <GiveBankRow label={give.bank.bankLabel} value={give.bank.bankName} />
                <GiveBankAccountRow />
                <p className="mt-4 text-[0.75rem] leading-[1.55] text-parchment/55">{give.bank.afterTransferNote}</p>
                <p className="mt-2 text-[0.75rem] leading-[1.55] text-parchment/55">{give.bank.internationalNote}</p>
              </div>
            </div>

            <p className="mt-10 text-center text-[0.75rem] font-semibold tracking-wide text-ink/45">
              {give.trustSignal}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

interface GiveBankRowProps {
  readonly label: string;
  readonly value: string;
}

function GiveBankRow({ label, value }: GiveBankRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-parchment/10">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-parchment/45">{label}</span>
      <span className="text-[0.9375rem] font-semibold">{value}</span>
    </div>
  );
}

function GiveBankAccountRow() {
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
        <span className="font-display font-bold text-[1.0625rem] tracking-[0.06em]">{bank.accountNumber}</span>
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
