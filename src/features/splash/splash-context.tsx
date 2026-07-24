"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { contents } from "@contents";
import { useMounted } from "@shared/hooks/use-mounted";

interface SplashContextValue {
  /** Whether the splash performance is turned on at all (contents.splash.enabled). */
  readonly splashEnabled: boolean;
  /**
   * True once the splash has finished (or was never enabled). Hero
   * entrance animations hold until this flips so they play in front of
   * the user instead of finishing invisibly behind the splash.
   */
  readonly heroReady: boolean;
  /** Called once by the splash when the disc lands. */
  readonly finishSplash: () => void;
}

const SplashContext = createContext<SplashContextValue>({
  splashEnabled: false,
  heroReady: true,
  finishSplash: () => {},
});

interface SplashProviderProps {
  readonly children: React.ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const enabled = contents.splash.enabled;
  const [done, setDone] = useState(!enabled);

  const finishSplash = useCallback(() => setDone(true), []);

  const value = useMemo<SplashContextValue>(
    () => ({ splashEnabled: enabled, heroReady: done, finishSplash }),
    [enabled, done, finishSplash]
  );

  return <SplashContext.Provider value={value}>{children}</SplashContext.Provider>;
}

export function useSplash(): SplashContextValue {
  return useContext(SplashContext);
}

/**
 * Entrance gate for hero elements whose intro animations must wait for
 * the splash:
 *
 * - "ssr"  — before hydration: leave styles alone so content is visible
 *            on first paint without JS (the splash covers it anyway)
 * - "hold" — splash still running: snap to the hidden pre-entrance state
 *            so nothing shows fully-formed when the curtains part
 * - "play" — splash done (or disabled): run the entrance
 */
export type EntrancePhase = "ssr" | "hold" | "play";

export function useEntrancePhase(): EntrancePhase {
  const mounted = useMounted();
  const { heroReady } = useSplash();
  if (!mounted) return "ssr";
  return heroReady ? "play" : "hold";
}
