import type { Metadata } from "next";
import { contents } from "@contents";
import { PartnershipScreen } from "@features/partnership/screen/partnership-screen";

export const metadata: Metadata = {
  title: contents.site.pages.partnership.title,
  description: contents.site.pages.partnership.description,
  alternates: { canonical: "/partnership" },
};

export default function PartnershipPage() {
  return <PartnershipScreen />;
}
