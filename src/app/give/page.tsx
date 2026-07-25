import type { Metadata } from "next";
import { contents } from "@contents";
import { GiveScreen } from "@features/give/screen/give-screen";

export const metadata: Metadata = {
  title: contents.site.pages.give.title,
  description: contents.site.pages.give.description,
  alternates: { canonical: "/give" },
  openGraph: {
    ...contents.site.pages.give.openGraph,
    url: "/give",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

export default function GivePage() {
  return <GiveScreen />;
}
