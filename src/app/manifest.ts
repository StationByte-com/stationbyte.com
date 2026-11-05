import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import en from "../../messages/en.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: en.meta.title,
    short_name: site.name,
    description: en.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#f6f6f4",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
