import { HeroWatermark } from "./hero-watermark";
import { HeroShapes } from "./hero-shapes";
import { HeroMedallion } from "./hero-medallion";
import { HeroHeadline } from "./hero-headline";
import { HeroScrollBadge } from "./hero-scroll-badge";

// NOTE: the desktop medallion instance lives in StoryStage (stage level)
// so the theatre can carry it above the story card; this section renders
// only the mobile in-flow instance.

export function HeroSection() {
  // overflow-x-clip (not hidden): the watermark stays clipped
  // horizontally, while the medallion is free to travel vertically
  // across the section boundary during the story handoff
  return (
    <section id="top" className="texture-grain relative min-h-[100svh] overflow-x-clip bg-evergreen flex items-center">
      {/* faint geometric pattern, Ahadi-style architecture */}
      <svg aria-hidden className="absolute inset-0 z-0 w-full h-full opacity-[0.045]">
        <defs>
          <pattern id="hero-arches" width="180" height="180" patternUnits="userSpaceOnUse">
            <path d="M20 160 v-60 a35 35 0 0 1 70 0 v60 Z" fill="var(--color-parchment)" />
            <path d="M125 40 l30 30 -30 30 -30 -30 Z" fill="var(--color-parchment)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-arches)" />
      </svg>

      <HeroWatermark />
      <HeroShapes />

      <div className="relative z-20 w-full pt-24 md:pt-32 pb-40 md:pb-52">
        <HeroHeadline />
        {/* mobile: full disc in flow, just under the name tags */}
        <HeroMedallion className="md:hidden relative mx-auto mt-12 w-[min(62vw,290px)]" />
      </div>

      <HeroScrollBadge />
    </section>
  );
}
