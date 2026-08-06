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

// file -> dove va: 'hero' oppure il title.it della sezione
const PLACEMENT = [
  ['home-hero.jpg', 'hero'],
  ['home-la-tenuta.jpg', 'la tenuta'],
  ['home-foresteria.jpg', 'foresteria'],
  ['home-il-taneto.jpg', 'il taneto'],
  ['home-percorsi.jpg', 'percorsi naturalistici'],
  ['home-eventi.jpg', 'eventi'],
  ['home-il-mercato.jpg', 'il mercato'],
  ['home-fondazione.jpg', 'fondazione'],
]

async function upload(file) {
  const body = fs.readFileSync(`${DIR}/${file}`)
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v2024-01-01/assets/images/${DATASET}?filename=${encodeURIComponent(file)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'image/jpeg' },
      body,
    }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(`upload ${file}: ${JSON.stringify(json)}`)
  return json.document._id
}

async function query(groq) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  )
  return (await res.json()).result
}

const sections = await query('*[_id=="page-home"][0].sections[]{_key,"t":title.it}')
const keyOf = Object.fromEntries(sections.map((s) => [s.t, s._key]))

const patches = {}
for (const [file, target] of PLACEMENT) {
  const assetId = await upload(file)
  const image = {
    _type: 'image',
    _key: crypto.randomBytes(6).toString('hex'),
    asset: { _type: 'reference', _ref: assetId },
  }
  if (target === 'hero') {
    patches['hero.images'] = [image]
  } else {
    const key = keyOf[target]
    if (!key) throw new Error(`sezione non trovata: ${target}`)
    patches[`sections[_key=="${key}"].images`] = [image]
  }
  console.log(`✓ ${file} → ${target} (${assetId})`)
}

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ patch: { id: 'page-home', set: patches } }] }),
  }
)
const json = await res.json()
if (!res.ok) throw new Error(JSON.stringify(json))
console.log('patch home ok:', json.results?.[0]?.operation)
