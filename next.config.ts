import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // slug rinominati con la nuova alberatura (xls 2026-08)
  async redirects() {
    return [
      { source: "/:locale/chi-siamo", destination: "/:locale/la-tenuta", permanent: true },
      { source: "/:locale/location", destination: "/:locale/spazi-comuni", permanent: true },
      {
        source: "/:locale/percorsi-naturalistici",
        destination: "/:locale/percorsi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
