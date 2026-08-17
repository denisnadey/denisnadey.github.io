import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Denis Nadey — Engineering Manager & Mobile Engineer", short_name: "Denis Nadey", description: "Engineering leadership and hands-on mobile engineering.", start_url: "/en", display: "standalone", background_color: "#f3f1e9", theme_color: "#1649ff", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}

