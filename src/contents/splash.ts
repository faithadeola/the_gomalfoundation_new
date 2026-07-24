export const splashContents = {
  splash: {
    /**
     * Master switch — flip to false while working to skip the whole
     * performance (saves you the full durationMs on every reload).
     */
    enabled: true,
    /**
     * Total budget for the entire splash, title-reveal to disc-landing.
     * Every phase is a fraction of this, so one number rescales the
     * whole choreography. Portraits come from hero.images.
     */
    durationMs: 5000,
    lineOne: "THE GOMAL",
    lineTwo: "FOUNDATION",
    /** Vertical columns on desktop, horizontal rows on mobile. */
    panelCount: 8,
  },
} as const;
