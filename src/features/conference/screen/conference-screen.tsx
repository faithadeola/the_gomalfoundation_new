"use client";

import { contents } from "@contents";
import { SiteNav } from "@features/home/screen/parts/navigation/site-nav";
import { SiteFooter } from "@features/home/screen/parts/footer/site-footer";
import { ConferenceForm } from "../components/conference-form";

export function ConferenceScreen() {
  const { conference } = contents;

  return (
    <>
      <SiteNav />
      <main className="bg-evergreen-deep text-parchment">
        {/* header */}
        <div className="texture-grain relative overflow-hidden pt-32 pb-14 px-6 text-center border-b border-parchment/10">
          <p className="serif-soft inline-block font-serif italic text-[1rem] text-ink bg-blush px-5 py-2 shadow-[4px_5px_0_rgba(0,0,0,0.35)] -rotate-2 mb-6">
            {conference.section.dateLocation}
          </p>
          <h1
            className="font-display font-black uppercase text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] mb-4"
            style={{ fontVariationSettings: "'wdth' 84" }}
          >
            {conference.section.heading}
          </h1>
          <p className="serif-soft font-serif italic text-sage text-[1.0625rem] max-w-[52ch] mx-auto">
            {conference.modal.intro}
          </p>
        </div>

        {/* form */}
        <div className="texture-grain relative bg-parchment text-ink py-16 px-6 md:px-10">
          <div className="max-w-[760px] mx-auto">
            <ConferenceForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
