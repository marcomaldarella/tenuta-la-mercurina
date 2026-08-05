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
  {
    slug: 'fondazione',
    label: { it: 'fondazione darefrutto', en: 'darefrutto foundation' },
  },
  { slug: 'contatti', label: { it: 'contatti', en: 'contacts' } },
]

export const flatNavItems: NavItem[] = navEntries.flatMap((entry) =>
  entry.items ? entry.items : [{ slug: entry.slug!, label: entry.label }]
)
