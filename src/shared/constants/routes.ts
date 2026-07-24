export const ROUTES = {
  HOME: "/",
  GIVE: "/give",
  TRIBUTES: "/tributes",
  PARTNERSHIP: "/partnership",
  CONFERENCE: "/conference",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
