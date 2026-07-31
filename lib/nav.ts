export type L10nString = { it: string; en: string }

export type NavItem = { slug: string; label: L10nString }

export type NavEntry = {
  label: L10nString
  slug?: string
  items?: NavItem[]
}

export const navEntries: NavEntry[] = [
  {
    label: { it: 'tenuta', en: 'estate' },
    items: [
      { slug: 'chi-siamo', label: { it: 'chi siamo', en: 'about us' } },
      { slug: 'foresteria', label: { it: 'foresteria', en: 'guesthouse' } },
      { slug: 'taneto', label: { it: 'ontaneto', en: 'alder grove' } },
      { slug: 'location', label: { it: 'location', en: 'location' } },
    ],
  },
  {
    label: { it: 'attività', en: 'activities' },
    items: [
      {
        slug: 'percorsi-naturalistici',
        label: { it: 'percorsi naturalistici', en: 'nature trails' },
      },
      {
        slug: 'didattica-ambientale',
        label: { it: 'didattica ambientale', en: 'environmental education' },
      },
      { slug: 'team-building', label: { it: 'team building', en: 'team building' } },
      { slug: 'eventi', label: { it: 'eventi', en: 'events' } },
    ],
  },
  { slug: 'il-mercato', label: { it: 'il mercato', en: 'the market' } },
  { slug: 'prodotti', label: { it: 'prodotti', en: 'products' } },
  { slug: 'fondazione', label: { it: 'fondazione', en: 'foundation' } },
  { slug: 'contatti', label: { it: 'contatti', en: 'contacts' } },
]

export const flatNavItems: NavItem[] = navEntries.flatMap((entry) =>
  entry.items ? entry.items : [{ slug: entry.slug!, label: entry.label }]
)
