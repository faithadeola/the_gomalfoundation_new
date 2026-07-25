import type { MetadataRoute } from "next";
import { ROUTES } from "@shared/constants/routes";
import { SITE_URL } from "@shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${SITE_URL}${ROUTES.HOME}`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}${ROUTES.GIVE}`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.TRIBUTES}`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.PARTNERSHIP}`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.CONFERENCE}`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
