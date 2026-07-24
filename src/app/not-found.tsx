import Link from "next/link";
import { contents } from "@contents";
import { ROUTES } from "@shared/constants/routes";

export default function NotFound() {
  const { notFound } = contents;

  return (
    <main className="texture-grain relative min-h-svh overflow-hidden bg-evergreen text-parchment flex flex-col items-center justify-center px-6 text-center">
      <p
        className="font-display font-black text-blush text-[clamp(6rem,28vw,16rem)] leading-none tracking-[-0.03em]"
        style={{ fontVariationSettings: "'wdth' 84" }}
      >
        {notFound.code}
      </p>
      <p className="serif-soft mt-4 font-serif italic text-sage text-[clamp(1.125rem,2vw,1.5rem)]">
        {notFound.message}
      </p>
      <Link
        href={ROUTES.HOME}
        className="mt-9 inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300"
      >
        {notFound.cta}
      </Link>
    </main>
  );
}
