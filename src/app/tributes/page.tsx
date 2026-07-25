import type { Metadata } from "next";
import { contents } from "@contents";
import { TributesScreen } from "@features/tributes/screen/tributes-screen";

export const metadata: Metadata = {
  title: contents.site.pages.tributes.title,
  description: contents.site.pages.tributes.description,
  alternates: { canonical: "/tributes" },
};

export default function TributesPage() {
  return <TributesScreen />;
}
