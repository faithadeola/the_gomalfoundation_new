"use client";

import { useEffect, useState } from "react";
import { contents } from "@contents";
import { SiteNav } from "@features/home/screen/parts/navigation/site-nav";
import { SiteFooter } from "@features/home/screen/parts/footer/site-footer";
import { PartnershipForm } from "../components/partnership-form";

type FocusPair = { readonly type: string; readonly desc: string };
type TypeLabels = Record<string, string>;

function MobilePairsGrid({ pairs, typeLabels }: { pairs: readonly FocusPair[]; typeLabels: TypeLabels }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 1024);
      setCols(w >= 640 ? 3 : 2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isDesktop) {
    return (
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {pairs.map((pair) => (
          <li key={pair.type} style={{ borderRadius: "0.75rem", background: "rgba(243,226,205,0.6)", border: "1px solid rgba(18,48,42,0.1)", padding: "0.875rem 1.25rem" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>{typeLabels[pair.type]}</p>
            <p style={{ fontSize: "0.8125rem", color: "rgba(18,48,42,0.6)" }}>{pair.desc}</p>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: "0.75rem" }}>
      {pairs.map((pair) => (
        <div key={pair.type} style={{ borderRadius: "0.75rem", background: "rgba(243,226,205,0.6)", border: "1px solid rgba(18,48,42,0.1)", padding: "0.875rem 1.25rem" }}>
          <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>{typeLabels[pair.type]}</p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(18,48,42,0.6)" }}>{pair.desc}</p>
        </div>
      ))}
    </div>
  );
}

export function PartnershipScreen() {
  const { partnership } = contents;

  return (
    <>
      <SiteNav />
      <main className="bg-evergreen-deep text-parchment">
        {/* header */}
        <div className="texture-grain relative overflow-hidden pt-32 pb-14 px-6 md:px-10 border-b border-parchment/10">
          <div className="max-w-[1140px] mx-auto">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-4">
              {partnership.page.eyebrow}
            </p>
            <h1
              className="font-display font-black uppercase text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] mb-4"
              style={{ fontVariationSettings: "'wdth' 84" }}
            >
              {partnership.page.heading}
            </h1>
            <p className="serif-soft font-serif italic text-sage text-[1.0625rem] leading-[1.6] max-w-[56ch]">
              {partnership.page.body}
            </p>
          </div>
        </div>

        {/* body */}
        <div className="texture-grain relative bg-parchment text-ink py-16 px-6 md:px-10">
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-12 items-start">
            <div>
              <h2 className="font-display font-bold text-[1.25rem] mb-5" style={{ fontVariationSettings: "'wdth' 88" }}>
                {partnership.page.waysToPartnerHeading}
              </h2>
              <MobilePairsGrid pairs={partnership.focusPairs} typeLabels={partnership.typeLabels} />
              <div className="mt-8 rounded-xl bg-evergreen-deep text-parchment px-6 py-5">
                <p className="font-bold text-[0.9375rem] mb-1">{partnership.page.trustCard.heading}</p>
                <p className="text-[0.8125rem] text-parchment/70 leading-[1.6]">{partnership.page.trustCard.body}</p>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-parchment-deep/50 border border-ink/10 px-7 py-7">
              <h2 className="font-display font-bold text-[1.25rem] mb-1.5" style={{ fontVariationSettings: "'wdth' 88" }}>
                {partnership.page.card.heading}
              </h2>
              <p className="text-[0.875rem] text-ink/65 mb-6">{partnership.page.card.body}</p>
              <PartnershipForm />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
