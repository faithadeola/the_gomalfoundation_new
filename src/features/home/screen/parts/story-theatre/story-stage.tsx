"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { contents } from "@contents";
import { HeroSection } from "../hero/hero-section";
import { HeroMedallion } from "../hero/hero-medallion";
import { WhoTheyWereSection } from "../who-they-were/who-they-were-section";
import { DoorTheatre } from "./door-theatre";

gsap.registerPlugin(ScrollTrigger);
// mobile browsers resize the viewport as the address bar hides/shows —
// don't let that re-layout the pinned scenes mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });

/** Stage tints per room — hex because GSAP tweens resolved colors. */
const ROOM_TINTS = ["#f7c948", "#f6c0ae", "#e96d51", "#b9a3e3"] as const;

/** Virtual scroll length of the whole performance, in viewport-heights. */
const SCROLL_LENGTH = "+=850%";

/** Deterministic jitter in [-m, m], stable per letter index. */
const jig = (n: number, m: number) => ((n * 7919) % (2 * m + 1)) - m;

/**
 * The five-act scroll theatre. Desktop + motion-safe only — one pinned
 * stage, one scrubbed master timeline, fully reversible:
 *
 *   Act I    hero folds itself away, disc rises to centre, pulse
 *   Act II   empty parchment card rises beneath the floating disc
 *   Act III  disc rolls to the top-left seal dock; content wakes
 *   Act IV   four fullscreen doors — scroll opens each, fling, room,
 *            pile of spines at the left edge
 *   Act V    theatre clears, pin releases into the outro
 *
 * Mobile / reduced-motion: the stage is a plain wrapper and the
 * sections behave as their own flowing selves.
 */
export function StoryStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardLayerRef = useRef<HTMLDivElement>(null);
  const roomCount = contents.whoTheyWere.rooms.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        const cardLayer = cardLayerRef.current;
        const wrapper = gsap.utils
          .toArray<HTMLElement>("[data-hero-medallion]")
          .find((el) => getComputedStyle(el).display !== "none");
        const roller = wrapper?.querySelector<HTMLElement>("[data-medallion-roller]");
        const dock = stage?.querySelector<HTMLElement>("[data-story-dock]");
        if (!stage || !cardLayer || !wrapper || !roller || !dock) return;

        // ── measurements, all stage-relative so refresh position never
        //    matters. wrapper/dock never carry GSAP transforms; the card
        //    layer's translation is compensated explicitly.
        const rest = () => {
          const r = wrapper.getBoundingClientRect();
          return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width };
        };
        const centerDy = () => {
          const s = stage.getBoundingClientRect();
          return s.top + window.innerHeight / 2 - rest().cy;
        };
        const dockPoint = () => {
          const d = dock.getBoundingClientRect();
          const cardY = Number(gsap.getProperty(cardLayer, "y")) || 0;
          return {
            cx: d.left + d.width / 2,
            cy: d.top + d.height / 2 - cardY,
            w: d.width,
          };
        };
        const dockDx = () => dockPoint().cx - rest().cx;
        const dockDy = () => dockPoint().cy - rest().cy;
        const dockScale = () => dockPoint().w / rest().w;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: SCROLL_LENGTH,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: "labelsDirectional",
              duration: { min: 0.25, max: 0.9 },
              delay: 0.15,
              ease: "power2.inOut",
            },
          },
        });

        tl.addLabel("rest", 0);

        // ─── ACT I — the hero folds itself away (0 → 10)
        tl.to(".hl-exit", { y: "-118%", stagger: { each: 0.05, from: "edges" }, duration: 3.5 }, 0.5);
        tl.to(".hero-exclaim", { y: -50, autoAlpha: 0, duration: 2.5 }, 1.5);
        tl.to(".hero-chips", { y: -40, autoAlpha: 0, duration: 2.5 }, 2.2);
        tl.to(".hero-badge", { scale: 0, autoAlpha: 0, duration: 2 }, 2.5);
        tl.to(".hero-sparks", { autoAlpha: 0, duration: 2 }, 2);
        tl.to(".wm-letter", { x: (i: number) => (i - 2) * 60, autoAlpha: 0.25, duration: 8 }, 1);
        tl.to(".stage-vignette", { autoAlpha: 1, duration: 6 }, 3);
        tl.to(roller, { y: () => centerDy(), scale: 1.15, duration: 7, ease: "power1.inOut" }, 2);
        // the pulse — one ripple emitted the moment the disc centres
        tl.fromTo(".stage-pulse", { scale: 0.8, autoAlpha: 0 }, { scale: 1.05, autoAlpha: 0.55, duration: 0.9 }, 8.6);
        tl.to(".stage-pulse", { scale: 2.6, autoAlpha: 0, duration: 1.4 }, 9.5);
        tl.addLabel("disc-center", 10.9);

        // ─── ACT II — the empty card rises beneath the disc (11 → 18)
        tl.fromTo(
          cardLayer,
          { y: "100%", rotateX: 7, transformOrigin: "50% 100%" },
          { y: "0%", rotateX: 0, duration: 7, ease: "power1.out" },
          11
        );
        tl.addLabel("card-full", 18);

        // ─── ACT III — the disc takes its seat, the room wakes (18 → 27.6)
        tl.to(
          roller,
          // 720° — full turns only, so the portraits land upright
          { x: () => dockDx(), y: () => dockDy(), scale: () => dockScale(), rotation: 720, duration: 5, ease: "power1.inOut" },
          18.5
        );
        tl.fromTo(".story-dock-ring", { rotate: -160 }, { rotate: 0, duration: 4 }, 19);
        // the wax-stamp press
        tl.to(roller, { scale: () => dockScale() * 0.92, duration: 0.5 }, 23.5);
        tl.to(roller, { scale: () => dockScale(), duration: 0.6 }, 24);
        tl.fromTo(
          ".story-sticker",
          { scale: 0, rotate: -14, autoAlpha: 0 },
          { scale: 1, rotate: -3, autoAlpha: 1, duration: 1.6, ease: "back.out(1.6)" },
          23.8
        );
        // autoAlpha included — motion may have left inline opacity:0 from
        // the pre-theatre render pass; the timeline must own it fully
        tl.fromTo(
          ".story-rise",
          { y: "115%", rotate: 7, autoAlpha: 0 },
          { y: "0%", rotate: 0, autoAlpha: 1, stagger: 0.06, duration: 1.6 },
          24
        );
        tl.fromTo(".story-bar", { scaleX: 0, autoAlpha: 1 }, { scaleX: 1, autoAlpha: 1, duration: 1.2 }, 25.4);
        tl.fromTo(".quote-char", { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.012, duration: 0.05 }, 25.4);
        tl.fromTo(".quote-rule", { scaleX: 0 }, { scaleX: 1, duration: 1 }, 26.6);
        tl.fromTo(".quote-citation", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 26.8);

        // the bottom band — chair quote slides up, numbers count in
        tl.fromTo(".story-dark", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 26.9);
        tl.fromTo(".story-stats", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 27.1);
        gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
          const raw = el.dataset.value ?? "";
          const numeric = Number(raw.replace(/[^0-9]/g, ""));
          const hasCommas = raw.includes(",");
          if (raw && /[0-9]/.test(raw) && !Number.isNaN(numeric)) {
            const counter = { v: 0 };
            tl.to(
              counter,
              {
                v: numeric,
                duration: 1.4,
                onUpdate: () => {
                  const value = Math.round(counter.v);
                  el.textContent = hasCommas ? value.toLocaleString("en-US") : String(value);
                },
              },
              27.1
            );
          } else {
            tl.fromTo(
              el,
              { rotation: -200, scale: 0.4, autoAlpha: 0 },
              { rotation: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: "back.out(2)" },
              27.4
            );
          }
        });
        tl.addLabel("content-in", 28.6);

        // ─── ACT IV — the doors (29 → 81)
        tl.fromTo(".dt-root", { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 28.9);

        for (let i = 0; i < roomCount; i++) {
          const base = 31 + i * 13;
          const scene = `[data-scene="${i}"]`;

          tl.to(".dt-tint", { backgroundColor: ROOM_TINTS[i % ROOM_TINTS.length], duration: 2 }, base);

          // counter swap
          if (i > 0) tl.to(`[data-count="${i - 1}"]`, { autoAlpha: 0, y: -8, duration: 0.6 }, base);
          tl.fromTo(`[data-count="${i}"]`, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8 }, base + 0.2);

          // the door rises to fill the screen — its room (and the locked
          // letters) appear behind it just before it lands
          tl.fromTo(`${scene} .dt-doorwrap`, { y: "115vh", autoAlpha: 1 }, { y: "0vh", duration: 3, ease: "power1.out" }, base);
          tl.fromTo(`${scene} .dt-room`, { autoAlpha: 0, x: 0, scale: 1 }, { autoAlpha: 1, duration: 0.5 }, base + 2.6);
          // your scroll is the handle — heavy at first
          tl.fromTo(`${scene} .dt-door`, { rotateY: 0 }, { rotateY: -112, duration: 5, ease: "power1.in" }, base + 3);
          tl.fromTo(`${scene} .dt-glow`, { autoAlpha: 0 }, { autoAlpha: 0.8, duration: 4 }, base + 3.5);
          tl.to(`${scene} .dt-glow`, { autoAlpha: 0, duration: 1 }, base + 8.2);
          // the letters — locked in a heap behind the door, they pour out
          // onto the floor in 3D as the gap widens...
          tl.fromTo(
            `${scene} .dt-letter`,
            {
              x: (j: number) => `${jig(j, 4)}vw`,
              y: "15vh",
              scale: 0.45,
              rotationX: 0,
              rotation: (j: number) => jig(j * 3 + 1, 18),
              transformOrigin: "50% 100%",
            },
            {
              x: (j: number) => `${jig(j * 5 + 2, 15)}vw`,
              y: "25vh",
              scale: 0.7,
              rotationX: 74,
              rotation: (j: number) => jig(j * 7 + 3, 40),
              duration: 4.6,
              ease: "power1.in",
              stagger: 0.06,
            },
            base + 3.2
          );
          // the fling
          tl.to(`${scene} .dt-door`, { x: "-135vw", rotate: -20, duration: 1.6, ease: "power2.in" }, base + 8);
          tl.to(`${scene} .dt-doorwrap`, { autoAlpha: 0, duration: 0.3 }, base + 9.6);
          // ...then rise off the floor and compose themselves back into the title
          tl.to(
            `${scene} .dt-letter`,
            { x: "0vw", y: "0vh", scale: 1, rotationX: 0, rotation: 0, duration: 2, ease: "back.out(1.4)", stagger: 0.05 },
            base + 8.4
          );
          // the rest of the room follows the letters in
          tl.fromTo(`${scene} .dt-room-rest`, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.15 }, base + 9.2);
          // the flung door joins the pile
          tl.fromTo(`[data-spine="${i}"]`, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2 }, base + 9.4);
          tl.fromTo(`[data-pip="${i}"]`, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, base + 9.4);
          tl.addLabel(`room-${i + 1}`, base + 10.6);
          // current room steps aside for the next door
          if (i < roomCount - 1) {
            tl.to(`${scene} .dt-room`, { x: "8vw", autoAlpha: 0, duration: 1.6, ease: "power1.in" }, base + 11.4);
          }
        }

        // ─── ACT V — release
        const lastBase = 31 + (roomCount - 1) * 13;
        tl.to(`[data-scene="${roomCount - 1}"] .dt-room`, { y: "-6vh", autoAlpha: 0, duration: 1.6 }, lastBase + 11.5);
        tl.to(`[data-count="${roomCount - 1}"]`, { autoAlpha: 0, duration: 0.8 }, lastBase + 11.5);
        tl.to(".dt-spine", { x: -90, autoAlpha: 0, stagger: 0.15, duration: 1.5 }, lastBase + 12);
        tl.to(".dt-root", { autoAlpha: 0, duration: 2.2 }, lastBase + 12.5);
        tl.addLabel("release", lastBase + 15);
        tl.to({}, { duration: 2 });

        // ── the pile is a table of contents: click a spine, revisit its room
        const st = tl.scrollTrigger;
        const spines = gsap.utils.toArray<HTMLElement>("[data-spine]", stage);
        const onSpineClick = (e: Event) => {
          if (!st) return;
          const idx = Number((e.currentTarget as HTMLElement).dataset.spine);
          const label = tl.labels[`room-${idx + 1}`];
          if (label === undefined) return;
          const top = st.start + (label / tl.duration()) * (st.end - st.start);
          window.scrollTo({ top, behavior: "smooth" });
        };
        spines.forEach((sp) => sp.addEventListener("click", onSpineClick));
        return () => spines.forEach((sp) => sp.removeEventListener("click", onSpineClick));
      });
    },
    { scope: stageRef }
  );

  return (
    <div
      ref={stageRef}
      className="relative md:motion-safe:h-svh md:motion-safe:overflow-hidden md:motion-safe:[perspective:1400px]"
    >
      {/* hero layer — no z/isolation so the medallion stacks globally */}
      <div className="relative md:motion-safe:absolute md:motion-safe:inset-0">
        <HeroSection />
        {/* desktop disc — stage level so the theatre can carry it over the card */}
        <HeroMedallion className="hidden md:block absolute z-40 left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] w-[min(32vw,330px)]" />
      </div>

      {/* Act I dressing */}
      <div
        aria-hidden
        className="stage-vignette hidden md:motion-safe:block absolute inset-0 z-[25] pointer-events-none opacity-0"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 50%, transparent 52%, rgba(4, 26, 21, 0.6) 100%)",
        }}
      />
      <div
        aria-hidden
        className="hidden md:motion-safe:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[25] pointer-events-none w-[min(38vw,400px)] aspect-square"
      >
        <div className="stage-pulse w-full h-full rounded-full border-[3px] border-marigold opacity-0" />
      </div>

      {/* story card layer */}
      <div
        ref={cardLayerRef}
        className="story-card-layer relative md:motion-safe:absolute md:motion-safe:inset-0 md:motion-safe:z-30 md:motion-safe:will-change-transform"
      >
        <WhoTheyWereSection />
      </div>

      <DoorTheatre />
    </div>
  );
}
