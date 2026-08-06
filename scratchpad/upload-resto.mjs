import fs from 'node:fs'
import crypto from 'node:crypto'

const env = Object.fromEntries(
  fs
    .readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
)
const PROJECT = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = env.SANITY_API_WRITE_TOKEN
const DIR =
  '/private/tmp/claude-501/-Users-marcomaldarella/0784d630-e341-4978-b6df-ee51b22e57bf/scratchpad/hp'

const PLAN = {
  camere: { 'Le camere': 'home-foresteria.jpg' },
  'didattica-ambientale': { 'Per le scuole': 'visite-e-lezioni.jpg' },
  'team-building': { 'Organizza il tuo evento': 'cascina-sera.jpg' },
  'visite-e-lezioni': { 'Alla scoperta del territorio': 'fondazione-risaia.jpg' },
}

const cache = new Map()
async function upload(file) {
  if (cache.has(file)) return cache.get(file)
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=${encodeURIComponent(file)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'image/jpeg' },
      body: fs.readFileSync(`${DIR}/${file}`),
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(json))
  cache.set(file, json.document._id)
  return json.document._id
}

const q = `*[_type=="page"]{"slug":slug.current,_id,sections[]{_key,"t":title.it}}`
const pages = (
  await (
    await fetch(
      `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    )
  ).json()
).result

const mutations = []
for (const [slug, sections] of Object.entries(PLAN)) {
  const page = pages.find((p) => p.slug === slug)
  const set = {}
  for (const [title, file] of Object.entries(sections)) {
    const section = page.sections.find((s) => s.t === title)
    if (!section) throw new Error(`${slug}: "${title}" non trovata`)
    set[`sections[_key=="${section._key}"].images`] = [
      {
        _type: 'image',
        _key: crypto.randomBytes(6).toString('hex'),
        asset: { _type: 'reference', _ref: await upload(file) },
      },
    ]
    console.log(`${slug} · ${title} ← ${file}`)
  }
  mutations.push({ patch: { id: page._id, set } })
}

const res = await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations }),
})
if (!res.ok) throw new Error(JSON.stringify(await res.json()))
console.log('ok')
