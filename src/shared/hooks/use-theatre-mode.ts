"use client";

import { useEffect, useState } from "react";

const THEATRE_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * True when the scroll-theatre choreography is active: desktop viewport
 * with motion allowed. Mobile and reduced-motion users keep the simple
 * flow. False during SSR/hydration (mobile-first default).
 */
export function useTheatreMode(): boolean {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(THEATRE_QUERY);
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return on;
}
