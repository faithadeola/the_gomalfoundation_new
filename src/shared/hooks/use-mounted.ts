"use client";

import { useEffect, useState } from "react";

/**
 * False during SSR and the hydration render, true right after mount.
 * Used to trigger entrance animations as a post-mount state change so
 * content is fully visible on first paint (no blank hero on slow
 * connections) yet still animates once JS arrives.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
