export type L10nString = { it: string; en: string }

export type NavItem = { slug: string; label: L10nString }

export type NavEntry = {
  label: L10nString
  slug?: string
  items?: NavItem[]
  /* true: le voci non sono pagine ma ancore dentro la pagina unica entry.slug */
  anchors?: boolean
}

export const navEntries: NavEntry[] = [
  {
    label: { it: 'tenuta', en: 'estate' },
    slug: 'tenuta',
    anchors: true,
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
  {
    label: { it: 'foresteria', en: 'guesthouse' },
    slug: 'foresteria',
    anchors: true,
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
  {
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
  {
    label: { it: 'eventi', en: 'events' },
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
  { slug: 'contatti', label: { it: 'contatti', en: 'contacts' } },
]

/* pagine uniche: slug del gruppo → label + sotto-pagine (slug = id ancora,
   label = titolo del blocco editoriale) */
export const anchorGroups: Record<string, { label: L10nString; items: NavItem[] }> =
  Object.fromEntries(
    navEntries
      .filter((entry) => entry.anchors && entry.slug && entry.items)
      .map((entry) => [entry.slug!, { label: entry.label, items: entry.items! }])
  )

/* voci piatte per l'overlay mobile: path già pronto (con #ancora per i gruppi) */
export const flatNavItems: { path: string; label: L10nString }[] = navEntries.flatMap(
  (entry) =>
    entry.items
      ? entry.items.map((item) => ({
          path: entry.anchors ? `${entry.slug}#${item.slug}` : item.slug,
          label: item.label,
        }))
      : [{ path: entry.slug!, label: entry.label }]
)

/* pagine reali (senza ancore), per la sitemap */
export const topLevelSlugs: string[] = navEntries.flatMap((entry) =>
  entry.anchors || !entry.items ? [entry.slug!] : entry.items.map((item) => item.slug)
)
