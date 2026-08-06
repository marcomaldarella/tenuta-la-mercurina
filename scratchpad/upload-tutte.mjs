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

// slug pagina -> { hero: file, sezioni: { "titolo sezione it" | indice: file } }
// indice numerico per le sezioni senza titolo
const PLAN = {
  home: {
    sections: {
      'spazi interni': 'spazi-interni.jpg',
      'didattica ambientale': 'visite-e-lezioni.jpg',
      'team building': 'eventi-privati.jpg',
      prodotti: 'prodotti-cesto.jpg',
    },
  },

  // tenuta
  'la-tenuta': { hero: 'home-la-tenuta.jpg', sections: { 0: 'corte-giardino.jpg' } },
  'la-storia': { hero: 'home-la-storia.jpg', sections: { 0: 'tramonto-risaia.jpg' } },
  'casa-di-caccia': {
    hero: 'casa-di-caccia-esterno.jpg',
    sections: { 0: 'casa-di-caccia-interno.jpg' },
  },
  taneto: {
    hero: 'home-il-taneto.jpg',
    sections: {
      'Un patrimonio di biodiversità': 'taneto-equiseti.jpg',
      'La foresta e la garzaia': 'home-fondazione.jpg',
    },
  },
  prodotti: { hero: 'prodotti-cesto.jpg', sections: { 'Il riso': 'percorsi-riso.jpg' } },

  // ospitalità
  foresteria: { hero: 'home-foresteria.jpg' },
  camere: {
    hero: 'home-foresteria.jpg',
    sections: { 'Le tipologie': 'foresteria-dettaglio.jpg' },
  },
  'il-porticato': {
    hero: 'porticato.jpg',
    sections: { 'Il porticato': 'home-pranzo-a-tema.jpg' },
  },
  'la-corte-giardino': {
    hero: 'corte-giardino.jpg',
    sections: { 'La corte giardino': 'cascina-sera.jpg' },
  },
  'spazi-interni': {
    hero: 'spazi-interni.jpg',
    sections: { 'Gli spazi interni': 'eventi-privati.jpg' },
  },

  // esperienze
  percorsi: {
    hero: 'home-percorsi.jpg',
    sections: {
      'Percorsi in natura': 'percorsi-natura.jpg',
      'Percorsi a tema riso': 'percorsi-riso.jpg',
    },
  },
  'workshop-floreali': {
    hero: 'workshop-floreali-vaso.jpg',
    sections: { 0: 'home-workshop-floreali.jpg' },
  },
  'visite-e-lezioni': { hero: 'visite-e-lezioni.jpg' },
  'didattica-ambientale': {
    hero: 'visite-e-lezioni.jpg',
    sections: { 'Per professionisti e privati': 'fondazione-osservazione.jpg' },
  },
  'team-building': {
    hero: 'eventi-privati.jpg',
    sections: { 'Team building in natura': 'percorsi-natura.jpg' },
  },

  // eventi
  eventi: {
    hero: 'home-eventi.jpg',
    sections: {
      'Il mercato della domenica': 'mercato-welcome.jpg',
      'Matrimoni e wedding destination': 'home-matrimoni.jpg',
      'Pranzo a tema con workshop floreale': 'home-pranzo-a-tema.jpg',
      'Il tuo evento': 'eventi-privati.jpg',
    },
  },
  'il-mercato': { hero: 'home-il-mercato.jpg' },
  matrimoni: { hero: 'home-matrimoni.jpg', sections: { 0: 'spazi-interni.jpg' } },
  'pranzo-a-tema': {
    hero: 'home-pranzo-a-tema.jpg',
    sections: { 0: 'workshop-floreali-vaso.jpg' },
  },
  'eventi-privati': { hero: 'eventi-privati.jpg', sections: { 0: 'cascina-sera.jpg' } },

  // fondazione
  fondazione: {
    hero: 'fondazione-pioppi.jpg',
    sections: {
      Storia: 'fondazione-risaia.jpg',
      Mission: 'home-fondazione.jpg',
      'La rigenerazione': 'fondazione-osservazione.jpg',
    },
  },
}

const cache = new Map()
async function upload(file) {
  if (cache.has(file)) return cache.get(file)
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
  cache.set(file, json.document._id)
  return json.document._id
}

const imageFor = async (file) => ({
  _type: 'image',
  _key: crypto.randomBytes(6).toString('hex'),
  asset: { _type: 'reference', _ref: await upload(file) },
})

const q = `*[_type=="page"]{"slug":slug.current,_id,sections[]{_key,"t":title.it}}`
const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(q)}`,
  { headers: { Authorization: `Bearer ${TOKEN}` } }
)
const pages = (await res.json()).result

const mutations = []
for (const [slug, plan] of Object.entries(PLAN)) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) throw new Error(`pagina non trovata: ${slug}`)
  const set = {}

  if (plan.hero) {
    set['hero.images'] = [await imageFor(plan.hero)]
    console.log(`${slug} · hero ← ${plan.hero}`)
  }

  for (const [target, file] of Object.entries(plan.sections || {})) {
    const idx = /^\d+$/.test(target) ? Number(target) : null
    const section =
      idx !== null ? page.sections?.[idx] : page.sections?.find((s) => s.t === target)
    if (!section) throw new Error(`${slug}: sezione non trovata "${target}"`)
    set[`sections[_key=="${section._key}"].images`] = [await imageFor(file)]
    console.log(`${slug} · ${section.t ?? `sezione ${idx}`} ← ${file}`)
  }

  mutations.push({ patch: { id: page._id, set } })
}

const mres = await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations }),
})
const mjson = await mres.json()
if (!mres.ok) throw new Error(JSON.stringify(mjson))
console.log(`\n${mutations.length} pagine aggiornate`)
