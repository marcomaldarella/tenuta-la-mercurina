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
      { slug: 'la-tenuta', label: { it: 'la tenuta', en: 'the estate' } },
      { slug: 'la-storia', label: { it: 'la storia', en: 'the history' } },
      { slug: 'casa-di-caccia', label: { it: 'casa di caccia', en: 'hunting lodge' } },
      { slug: 'taneto', label: { it: 'ontaneto', en: 'alder grove' } },
      {
        slug: 'prodotti',
        label: { it: 'prodotti della tenuta', en: 'estate products' },
      },
    ],
  },
  {
    label: { it: 'ospitalità', en: 'hospitality' },
    items: [
      { slug: 'foresteria', label: { it: 'foresteria', en: 'guesthouse' } },
      { slug: 'camere', label: { it: 'camere', en: 'rooms' } },
      { slug: 'spazi-comuni', label: { it: 'spazi comuni', en: 'common spaces' } },
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
  { slug: 'fondazione', label: { it: 'fondazione', en: 'foundation' } },
  { slug: 'contatti', label: { it: 'contatti', en: 'contacts' } },
]

export const flatNavItems: NavItem[] = navEntries.flatMap((entry) =>
  entry.items ? entry.items : [{ slug: entry.slug!, label: entry.label }]
)
