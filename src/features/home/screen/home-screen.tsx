import { SplashProvider } from "@features/splash/splash-context";
import { SplashScreen } from "@features/splash/splash-screen";
import { SiteNav } from "./parts/navigation/site-nav";
import { StoryStage } from "./parts/story-theatre/story-stage";
import { FoundationSection } from "./parts/foundation-scene/foundation-section";
import { WordmarkSection } from "./parts/wordmark-scene/wordmark-section";
import { TributesCorridor } from "./parts/tributes-scene/tributes-corridor";
import { GiveSection } from "./parts/give-scene/give-section";
import { GallerySection } from "./parts/gallery-scene/gallery-section";
import { ConferenceSection } from "./parts/conference-scene/conference-section";
import { PartnershipMarquee } from "./parts/partnership-scene/partnership-marquee";
import { SiteFooter } from "./parts/footer/site-footer";
import { SectionHashSync } from "./parts/section-hash-sync";

export function HomeScreen() {
  return (
    <SplashProvider>
      <SplashScreen />
      <SectionHashSync />
      <SiteNav />
      <main>
        <StoryStage />
        <FoundationSection />
        <WordmarkSection />
        <TributesCorridor />
        <GallerySection />
        <GiveSection />
        <ConferenceSection />
        <PartnershipMarquee />
      </main>
      <SiteFooter />
    </SplashProvider>
  );
}
