import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // cross-fade tra pagine (React <ViewTransition> nel layout [locale])
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // slug rinominati con la nuova alberatura (xls 2026-08) + pagine unite
  // tenuta/foresteria (set 2026): i vecchi slug atterrano sull'ancora
  async redirects() {
    return [
      // la pagina unita vive su /chi-siamo da nov 2026 (la voce "tenuta" in
      // menu ora porta in home): il vecchio url e le ancore seguono
      { source: "/:locale/tenuta", destination: "/:locale/chi-siamo", permanent: true },
      { source: "/:locale/la-tenuta", destination: "/:locale/chi-siamo", permanent: true },
      {
        source: "/:locale/la-storia",
        destination: "/:locale/chi-siamo#la-storia",
        permanent: true,
      },
      {
        source: "/:locale/casa-di-caccia",
        destination: "/:locale/chi-siamo#casa-di-caccia",
        permanent: true,
      },
      { source: "/:locale/taneto", destination: "/:locale/chi-siamo#taneto", permanent: true },
      {
        source: "/:locale/prodotti",
        destination: "/:locale/chi-siamo#prodotti",
        permanent: true,
      },
      // da quando "la foresteria" è il primo blocco (foglio REV 3/11) le
      // camere non sono più in testa alla pagina: servono l'ancora
      { source: "/:locale/camere", destination: "/:locale/foresteria#camere", permanent: true },
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
        destination: "/:locale/esperienze#percorsi",
        permanent: true,
      },
      // pagine unite esperienze/eventi (15 set): anche queste sotto-pagine
      // diventano ancore, i loro slug restavano linkati da home e vecchi link
      { source: "/:locale/percorsi", destination: "/:locale/esperienze", permanent: true },
      {
        source: "/:locale/workshop-floreali",
        destination: "/:locale/esperienze#workshop-floreali",
        permanent: true,
      },
      // rientrate nei gruppi come blocchi (23 set + foglio REV 3/11): anche
      // questi slug atterrano sull'ancora, niente pagina standalone doppia
      {
        source: "/:locale/visite-e-lezioni",
        destination: "/:locale/esperienze#visite-e-lezioni",
        permanent: true,
      },
      { source: "/:locale/retreat", destination: "/:locale/esperienze#retreat", permanent: true },
      { source: "/:locale/il-mercato", destination: "/:locale/eventi", permanent: true },
      {
        source: "/:locale/pranzo-a-tema",
        destination: "/:locale/eventi#pranzo-a-tema",
        permanent: true,
      },
      {
        source: "/:locale/matrimoni",
        destination: "/:locale/eventi#matrimoni",
        permanent: true,
      },
      {
        source: "/:locale/eventi-privati",
        destination: "/:locale/eventi#eventi-privati",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
