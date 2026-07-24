import type { Metadata } from "next";
import { contents } from "@contents";
import { ConferenceScreen } from "@features/conference/screen/conference-screen";

export const metadata: Metadata = {
  title: contents.conference.section.heading,
  description: contents.conference.modal.intro,
};

export default function ConferencePage() {
  return <ConferenceScreen />;
}
