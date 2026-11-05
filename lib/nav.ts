export type L10nString = { it: string; en: string }

export type NavItem = {
  slug: string
  label: L10nString
  /* solo sulle voci CTA (es. "crea la tua esperienza"): link secco fuori
     dalla pagina di gruppo, non un'ancora #slug al suo interno */
  href?: string
}

export type NavEntry = {
  label: L10nString
  slug: string
  /* presenti solo sui gruppi: sono ancore dentro la pagina unica entry.slug */
  items?: NavItem[]
}

/* pagine uniche: le sotto-pagine sono blocchi ancorati dentro la pagina del
   gruppo. In nav le ancore non compaiono più (Marco, 15 set): tenuta e
   foresteria sono link secchi, esperienze ed eventi restano espandibili su
   desktop ma le loro voci puntano all'ancora, non a una pagina a sé.
   heroFrom: doc da cui prendere l'hero, se diverso dalla prima sotto-pagina */
export const anchorGroups: Record<
  string,
  { label: L10nString; items: NavItem[]; heroFrom?: string }
> = {
  /* ex gruppo "tenuta": rinominato "chi siamo" (richiesta cliente nov 2026),
     slug spostato con lui — "tenuta" in menu è ora la voce che porta in home */
  'chi-siamo': {
    label: { it: 'chi siamo', en: 'about us' },
    items: [
      { slug: 'la-tenuta', label: { it: 'la tenuta', en: 'the estate' } },
      { slug: 'la-storia', label: { it: 'la storia', en: 'the history' } },
      { slug: 'casa-di-caccia', label: { it: 'ex casa di caccia', en: 'ex hunting lodge' } },
      { slug: 'taneto', label: { it: "l'ontaneto", en: 'the alder grove' } },
      {
        slug: 'prodotti',
        label: { it: 'i prodotti della tenuta', en: 'the estate products' },
      },
    ],
  },
  foresteria: {
    label: { it: 'foresteria', en: 'guesthouse' },
    items: [
      /* blocco introduttivo dal foglio REV 3/11: il doc page-foresteria (che
         dà anche l'hero del gruppo, essendo prima sotto-pagina) ha ora la sua
         sezione "Ospitalità in natura" */
      { slug: 'foresteria', label: { it: 'la foresteria', en: 'the guesthouse' } },
      { slug: 'camere', label: { it: 'le camere', en: 'the rooms' } },
      { slug: 'il-porticato', label: { it: 'il porticato', en: 'the portico' } },
      {
        slug: 'la-corte-giardino',
        label: { it: 'la corte giardino', en: 'the garden courtyard' },
      },
      { slug: 'spazi-interni', label: { it: 'gli spazi interni', en: 'the interior spaces' } },
    ],
  },
  esperienze: {
    label: { it: 'esperienze', en: 'experiences' },
    heroFrom: 'esperienze',
    items: [
      { slug: 'percorsi', label: { it: 'percorsi', en: 'trails' } },
      /* contenuto Sanity ancora sotto lo slug "workshop-floreali" (non
         rinominato, per non rompere l'ancora esistente): cambia solo la
         label in nav, richiesta dal cliente come "workshop" */
      {
        slug: 'workshop-floreali',
        label: { it: 'workshop', en: 'workshop' },
      },
      /* nuova voce: pagina Sanity creata come scheletro (title+slug, nessun
         contenuto) in attesa dei testi/foto del cliente, vedi scratchpad/seed-retreat.mjs */
      { slug: 'retreat', label: { it: 'retreat', en: 'retreat' } },
      /* blocco vero della pagina (Marco, 23 set): il foglio ESPERIENZE lo
         prevede come sezione col suo testo e tasto prenota — il contenuto
         vive nel doc visite-e-lezioni */
      {
        slug: 'visite-e-lezioni',
        label: { it: 'crea la tua esperienza', en: 'create your experience' },
      },
    ],
  },
  eventi: {
    label: { it: 'eventi', en: 'events' },
    /* la pagina "eventi" esiste già a CMS con il suo hero: le sue sezioni
       restano fuori (i blocchi sono le sotto-pagine), l'hero invece è quello */
    heroFrom: 'eventi',
    items: [
      {
        slug: 'il-mercato',
        label: { it: 'il mercato della domenica', en: 'the sunday market' },
      },
      /* reintegrato nel gruppo (Marco, 23 set): il foglio EVENTI lo prevede
         come sezione della pagina, tra mercato e matrimoni */
      { slug: 'pranzo-a-tema', label: { it: 'pranzo a tema', en: 'themed lunch' } },
      { slug: 'matrimoni', label: { it: 'matrimoni', en: 'weddings' } },
      /* blocco vero della pagina (Marco, 23 set): il foglio EVENTI lo
         prevede come sezione col suo testo/foto, non più solo un link */
      {
        slug: 'eventi-privati',
        label: { it: 'crea il tuo evento', en: 'create your event' },
      },
    ],
  },
}

export const navEntries: NavEntry[] = [
  /* slug vuoto = link alla home: la voce "tenuta" apre il sito, non una
     pagina interna (il logo continua a fare lo stesso) */
  { slug: '', label: { it: 'tenuta', en: 'estate' } },
  { slug: 'chi-siamo', label: anchorGroups['chi-siamo'].label },
  { slug: 'foresteria', label: anchorGroups.foresteria.label },
  {
    slug: 'esperienze',
    label: anchorGroups.esperienze.label,
    items: anchorGroups.esperienze.items,
  },
  { slug: 'eventi', label: anchorGroups.eventi.label, items: anchorGroups.eventi.items },
  { slug: 'contatti', label: { it: 'contatti', en: 'contacts' } },
]

/* overlay mobile: solo le voci principali, le ancore restano dentro la pagina */
export const overlayRows: { path: string; label: L10nString }[] = navEntries.map(
  (entry) => ({ path: entry.slug, label: entry.label })
)

/* slug di sotto-pagina → path della sua ancora: serve a chi linka le pagine
   per slug (le card della home puntano al doc) per non passare dal 308 */
const anchorPaths: Record<string, string> = Object.fromEntries(
  Object.entries(anchorGroups).flatMap(([groupSlug, group]) =>
    /* le voci CTA (href) non sono ancore della pagina di gruppo: non
       entrano in questa mappa, restano risolte come pagina a sé (vedi
       pagePath) */
    group.items
      .filter((item) => !item.href)
      .map((item, index) => [
        item.slug,
        index === 0 ? groupSlug : `${groupSlug}#${item.slug}`,
      ])
  )
)

export const pagePath = (slug: string): string => anchorPaths[slug] ?? slug

/* pagine reali (le ancore non sono url a sé), per la sitemap: la voce home
   (slug vuoto) resta fuori, la home è già in sitemap per conto suo */
export const topLevelSlugs: string[] = navEntries
  .map((entry) => entry.slug)
  .filter(Boolean)
