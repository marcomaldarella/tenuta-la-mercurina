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
  tenuta: {
    label: { it: 'tenuta', en: 'estate' },
    items: [
      { slug: 'la-tenuta', label: { it: 'la tenuta', en: 'the estate' } },
      { slug: 'la-storia', label: { it: 'la storia', en: 'the history' } },
      { slug: 'casa-di-caccia', label: { it: 'ex casa di caccia', en: 'ex hunting lodge' } },
      { slug: 'taneto', label: { it: 'il taneto', en: 'the alder grove' } },
      {
        slug: 'prodotti',
        label: { it: 'i prodotti della tenuta', en: 'the estate products' },
      },
    ],
  },
  foresteria: {
    label: { it: 'foresteria', en: 'guesthouse' },
    items: [
      { slug: 'camere', label: { it: 'le camere', en: 'the rooms' } },
      { slug: 'il-porticato', label: { it: 'il porticato', en: 'the portico' } },
      {
        slug: 'la-corte-giardino',
        label: { it: 'la corte giardino', en: 'the garden courtyard' },
      },
      { slug: 'spazi-interni', label: { it: 'spazi interni', en: 'interior spaces' } },
    ],
  },
  esperienze: {
    label: { it: 'esperienze', en: 'experiences' },
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
      /* CTA, non un'ancora editoriale: rimanda a contatti (non esiste ancora
         una pagina/form dedicata a "crea la tua esperienza") */
      {
        slug: 'crea-la-tua-esperienza',
        label: { it: 'crea la tua esperienza', en: 'create your experience' },
        href: '/contatti',
      },
      /* "visite-e-lezioni" tolta dal menu su richiesta cliente: il doc Sanity
         resta intatto, la pagina è ancora raggiungibile a /it|en/visite-e-lezioni
         (route [slug] standalone), solo non più linkata da nav */
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
      { slug: 'matrimoni', label: { it: 'matrimoni', en: 'weddings' } },
      /* CTA, non un'ancora editoriale: rimanda a contatti (non esiste ancora
         una pagina/form dedicata a "crea il tuo evento") */
      {
        slug: 'crea-il-tuo-evento',
        label: { it: 'crea il tuo evento', en: 'create your event' },
        href: '/contatti',
      },
      /* "pranzo-a-tema" e "eventi-privati" tolte dal menu su richiesta
         cliente: doc Sanity intatti, pagine ancora raggiungibili standalone
         a /it|en/pranzo-a-tema e /it|en/eventi-privati, solo non più in nav.
         "archivio eventi" NON aggiunta: il cliente ha chiesto di ignorarla
         per ora. */
    ],
  },
}

export const navEntries: NavEntry[] = [
  { slug: 'tenuta', label: anchorGroups.tenuta.label },
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

/* pagine reali (le ancore non sono url a sé), per la sitemap */
export const topLevelSlugs: string[] = navEntries.map((entry) => entry.slug)
