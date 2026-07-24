import { contents } from "@contents";
import { ROOM_ICONS, type RoomIconName } from "@icons";

/** Per-room accent — tints the stage and colors the pile spines. */
export const ROOM_ACCENTS = [
  "var(--color-marigold)",
  "var(--color-blush)",
  "var(--color-coral)",
  "var(--color-lilac)",
] as const;

/**
 * The door theatre DOM — four fullscreen door scenes, the left-edge
 * pile of flung doors, and the progress marker. Purely presentational:
 * every element here is animated by StoryStage's master timeline via
 * the .dt-* classes. Desktop theatre only.
 */
export function DoorTheatre() {
  const { rooms } = contents.whoTheyWere;

  return (
    <div
      data-door-theatre
      aria-hidden
      className="dt-root hidden md:block absolute inset-0 z-[45] pointer-events-none opacity-0"
    >
      {/* stage floor — deep evergreen with the arch pattern, tinted per room */}
      <div className="absolute inset-0 bg-evergreen-deep" />
      <div className="dt-tint absolute inset-0 opacity-[0.14]" style={{ background: ROOM_ACCENTS[0] }} />
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
        <defs>
          <pattern id="dt-arches" width="180" height="180" patternUnits="userSpaceOnUse">
            <path d="M20 160 v-60 a35 35 0 0 1 70 0 v60 Z" fill="var(--color-parchment)" />
            <path d="M125 40 l30 30 -30 30 -30 -30 Z" fill="var(--color-parchment)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dt-arches)" />
      </svg>

      {/* the four scenes */}
      {rooms.map((room, i) => {
        const Icon = ROOM_ICONS[room.icon as RoomIconName];
        return (
          <div key={room.eyebrow} data-scene={i} className="absolute inset-0">
            {/* the room. The title's letters live here from the start —
                locked behind the door, pouring out as it opens, then
                composing themselves back into the words. */}
            <div className="dt-room absolute inset-0 flex flex-col items-center justify-center text-center px-8">
              <Icon className="dt-room-rest w-14 h-14 mb-8" />
              <p className="dt-room-rest text-[12px] font-semibold tracking-[0.2em] uppercase text-blush mb-4">
                {room.eyebrow}
              </p>
              <h3
                className="font-display font-black uppercase text-parchment text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] max-w-[16ch] mb-6 [perspective:900px]"
                style={{ fontVariationSettings: "'wdth' 84" }}
              >
                {room.title.split(" ").map((word, w) => (
                  <span key={w} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
                    {Array.from(word).map((letter, k) => (
                      <span key={k} className="dt-letter inline-block will-change-transform">
                        {letter}
                      </span>
                    ))}
                  </span>
                ))}
              </h3>
              <p className="dt-room-rest serif-soft font-serif italic text-[clamp(1.0625rem,1.7vw,1.375rem)] leading-[1.6] text-parchment/80 max-w-[46ch]">
                {room.body}
              </p>
            </div>

            {/* the door — hinged left, opened by the user's scroll */}
            <div className="dt-doorwrap absolute inset-0 flex items-center justify-center [perspective:1600px]">
              <div className="relative h-[74vh] aspect-[0.62] [transform-style:preserve-3d]">
                {/* light spilling through the opening gap */}
                <div
                  className="dt-glow absolute -inset-x-10 inset-y-6 opacity-0"
                  style={{
                    background:
                      "radial-gradient(60% 80% at 20% 50%, color-mix(in srgb, var(--color-marigold) 45%, transparent), transparent 70%)",
                  }}
                />
                <div className="dt-door absolute inset-0 rounded-t-full bg-parchment-deep border-2 border-ink/20 [transform-origin:left_center] shadow-[24px_0_80px_rgba(0,0,0,0.45)]">
                  <div className="absolute inset-[8%] rounded-t-full border-2 border-ink/10" />
                  <div className="dt-handle absolute right-[11%] top-1/2 w-4 h-4 rounded-full bg-ink/40" />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* the pile — flung doors resting at the left edge like stacked books */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[46vh] pointer-events-none">
        {rooms.map((room, i) => (
          <button
            key={room.eyebrow}
            type="button"
            data-spine={i}
            tabIndex={-1}
            className="dt-spine pointer-events-auto cursor-pointer absolute top-0 h-full w-[22px] rounded-r-[6px] border-y border-r border-ink/20 opacity-0"
            style={{ left: `${i * 15}px`, background: ROOM_ACCENTS[i], rotate: `${(i % 2 === 0 ? 1 : -1) * 0.8}deg` }}
          />
        ))}
      </div>

      {/* progress — 01/04 and four little arches filling in */}
      <div className="absolute bottom-9 right-10 flex items-center gap-5">
        <div className="flex items-end gap-1.5">
          {rooms.map((room, i) => (
            <svg key={room.eyebrow} viewBox="0 0 20 24" className="w-4 h-5">
              <path
                d="M2 22 v-10 a8 8 0 0 1 16 0 v10 Z"
                fill="none"
                stroke="var(--color-blush)"
                strokeWidth="2"
                opacity="0.45"
              />
              <path
                data-pip={i}
                d="M2 22 v-10 a8 8 0 0 1 16 0 v10 Z"
                fill="var(--color-marigold)"
                opacity="0"
              />
            </svg>
          ))}
        </div>
        <div className="relative h-6 w-[74px]">
          {rooms.map((room, i) => (
            <span
              key={room.eyebrow}
              data-count={i}
              className="dt-count absolute inset-0 font-display font-bold text-parchment text-[15px] tracking-[0.12em] text-right opacity-0"
            >
              {String(i + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
