"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { ROOM_ICONS, type RoomIconName } from "@icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * The four rooms as four arch doors — because nobody was ever turned
 * away, every door swings open as it enters view, revealing the room.
 */
export function RoomDoors() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".room-door", { rotateY: -104 });
        gsap.set(".room-interior", { autoAlpha: 1 });
      });

      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        // your scroll is the handle — each door opens as it crosses the
        // viewport, and closes again if you scroll back
        gsap.utils.toArray<HTMLElement>(".room-door").forEach((door) => {
          const article = door.closest("article") ?? door;
          const interior = article.querySelector(".room-interior");
          gsap.fromTo(
            door,
            { rotateY: 0 },
            {
              rotateY: -108,
              ease: "none",
              scrollTrigger: { trigger: article, start: "top 80%", end: "top 34%", scrub: 0.5 },
            }
          );
          if (interior) {
            gsap.fromTo(
              interior,
              { autoAlpha: 0.1 },
              {
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: { trigger: article, start: "top 72%", end: "top 40%", scrub: 0.5 },
              }
            );
          }
        });
      });
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      {contents.whoTheyWere.rooms.map((room) => {
        const Icon = ROOM_ICONS[room.icon as RoomIconName];
        return (
          <article key={room.eyebrow} className="relative [perspective:1500px] group">
            <div className="relative rounded-t-full min-h-[400px] [transform-style:preserve-3d]">
              {/* the room behind the door */}
              <div className="room-interior absolute inset-0 rounded-t-full bg-evergreen-deep overflow-hidden flex flex-col items-center text-center px-7 pt-20 pb-9 transition-transform duration-300 group-hover:-translate-y-1.5">
                <Icon className="w-9 h-9 text-marigold mb-6" />
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-blush mb-3">
                  {room.eyebrow}
                </p>
                <h3
                  className="font-display font-bold text-parchment text-[1.3rem] leading-[1.15] mb-4"
                  style={{ fontVariationSettings: "'wdth' 88" }}
                >
                  {room.title}
                </h3>
                <p className="text-[0.9rem] leading-[1.65] text-parchment/75">{room.body}</p>
              </div>

              {/* the door itself — hinged on the left */}
              <div
                aria-hidden
                className="room-door absolute inset-0 z-10 rounded-t-full bg-parchment-deep border-2 border-ink/15 [transform-origin:left_center] shadow-[8px_0_24px_rgba(18,48,42,0.18)]"
              >
                {/* door panelling + handle */}
                <div className="absolute inset-[9%] rounded-t-full border-2 border-ink/10" />
                <div className="absolute right-[13%] top-1/2 w-2.5 h-2.5 rounded-full bg-ink/35" />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
