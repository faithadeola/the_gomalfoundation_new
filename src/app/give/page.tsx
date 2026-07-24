import type { Metadata } from "next";
import { contents } from "@contents";
import { GiveScreen } from "@features/give/screen/give-screen";

export const metadata: Metadata = {
  title: contents.site.pages.give.title,
  description: contents.site.pages.give.description,
  openGraph: contents.site.pages.give.openGraph,
};

export default function GivePage() {
  return <GiveScreen />;
}
