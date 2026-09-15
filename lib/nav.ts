export type L10nString = { it: string; en: string }

export type NavItem = { slug: string; label: L10nString }

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
      {
        slug: 'workshop-floreali',
        label: { it: 'workshop floreali', en: 'floral workshops' },
      },
      {
        slug: 'visite-e-lezioni',
        label: { it: 'visite e lezioni', en: 'visits & lessons' },
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
      { slug: 'pranzo-a-tema', label: { it: 'pranzo a tema', en: 'themed lunch' } },
      { slug: 'matrimoni', label: { it: 'matrimoni', en: 'weddings' } },
      {
        slug: 'eventi-privati',
        label: { it: 'eventi privati', en: 'private events' },
      },
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
    group.items.map((item, index) => [
      item.slug,
      index === 0 ? groupSlug : `${groupSlug}#${item.slug}`,
    ])
  )
)

export const pagePath = (slug: string): string => anchorPaths[slug] ?? slug

/* pagine reali (le ancore non sono url a sé), per la sitemap */
export const topLevelSlugs: string[] = navEntries.map((entry) => entry.slug)
