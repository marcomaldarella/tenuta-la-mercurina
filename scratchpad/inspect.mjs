import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'

const env = Object.fromEntries(
  readFileSync(process.env.HOME + '/tenuta-la-mercurina/.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
)

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

if (process.argv[1].endsWith('inspect.mjs')) {
  const slugs = ['la-tenuta', 'la-storia', 'fondazione', 'casa-di-caccia', 'taneto', 'prodotti']
  const docs = await client.fetch(
    `*[_type == "page" && slug.current in $slugs]{_id, "slug": slug.current,
      "hero": count(hero.images),
      sections[]{_key, "t": coalesce(title.it, title), "n": count(images)}}`,
    { slugs }
  )
  for (const doc of docs) {
    console.log(`\n${doc.slug}  (${doc._id})  hero:${doc.hero ?? 0}`)
    for (const s of doc.sections ?? []) console.log(`   ${s._key}  imgs:${s.n ?? 0}  "${s.t ?? ''}"`)
  }
}
