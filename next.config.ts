import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // slug rinominati con la nuova alberatura (xls 2026-08) + pagine unite
  // tenuta/foresteria (set 2026): i vecchi slug atterrano sull'ancora
  async redirects() {
    return [
      { source: "/:locale/chi-siamo", destination: "/:locale/tenuta", permanent: true },
      { source: "/:locale/la-tenuta", destination: "/:locale/tenuta", permanent: true },
      { source: "/:locale/la-storia", destination: "/:locale/tenuta#la-storia", permanent: true },
      {
        source: "/:locale/casa-di-caccia",
        destination: "/:locale/tenuta#casa-di-caccia",
        permanent: true,
      },
      { source: "/:locale/taneto", destination: "/:locale/tenuta#taneto", permanent: true },
      { source: "/:locale/prodotti", destination: "/:locale/tenuta#prodotti", permanent: true },
      { source: "/:locale/camere", destination: "/:locale/foresteria", permanent: true },
      {
        source: "/:locale/il-porticato",
        destination: "/:locale/foresteria#il-porticato",
        permanent: true,
      },
      {
        source: "/:locale/la-corte-giardino",
        destination: "/:locale/foresteria#la-corte-giardino",
        permanent: true,
      },
      {
        source: "/:locale/spazi-interni",
        destination: "/:locale/foresteria#spazi-interni",
        permanent: true,
      },
      {
        source: "/:locale/location",
        destination: "/:locale/foresteria#spazi-interni",
        permanent: true,
      },
      {
        source: "/:locale/spazi-comuni",
        destination: "/:locale/foresteria#spazi-interni",
        permanent: true,
      },
      {
        source: "/:locale/percorsi-naturalistici",
        destination: "/:locale/percorsi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
