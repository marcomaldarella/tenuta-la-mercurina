/* seconde foto delle gallery dei blocchi di /tenuta (Marco, 11 set 2026).
   Appende un'immagine in coda a sections[_key].images della pagina indicata. */
import { execFileSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createReadStream, mkdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { client } from './inspect.mjs'

const HOME = process.env.HOME
const DOWNLOADS = join(HOME, 'Downloads')
const OUT = join(HOME, 'tenuta-la-mercurina/scratchpad/out')
mkdirSync(OUT, { recursive: true })

const jobs = [
  {
    file: 'Screenshot 2026-05-25 alle 14.53.00 1 (1).png',
    name: 'tenuta-chi-siamo-2.jpg',
    doc: 'page-chi-siamo',
    key: 'f3a0a8b736f1',
  },
  {
    file: 'Screenshot 2026-05-25 alle 14.53.00 21 (1).png',
    name: 'tenuta-la-storia-2.jpg',
    doc: 'page-la-storia',
    key: '1da5d4a7dda9',
  },
  {
    file: 'Screenshot 2026-05-25 alle 14.53.00 23.png',
    name: 'tenuta-rigenerazione-2.jpg',
    doc: 'page-fondazione',
    key: '796f564593af',
  },
  {
    file: 'ex casa di caccia 1.png',
    name: 'tenuta-casa-di-caccia-2.jpg',
    doc: 'page-casa-di-caccia',
    key: 'c6ac886ee3f6',
  },
  {
    file: 'Screenshot 2026-05-25 alle 14.53.00 27.png',
    name: 'tenuta-taneto-3.jpg',
    doc: 'page-taneto',
    key: 'c7daed115274',
  },
  {
    file: 'prodotti della tenuta 1.png',
    name: 'tenuta-prodotti-spaccio.jpg',
    doc: 'page-prodotti',
    key: 'cae4aa7066e5',
  },
]

for (const job of jobs) {
  const src = join(DOWNLOADS, job.file)
  const out = join(OUT, job.name)
  execFileSync('magick', [
    src,
    '-resize', '2560x2560>',
    '-colorspace', 'sRGB',
    '-strip',
    '-quality', '85',
    out,
  ])

  const asset = await client.assets.upload('image', createReadStream(out), {
    filename: basename(out),
  })

  const item = {
    _type: 'image',
    _key: randomBytes(6).toString('hex'),
    asset: { _type: 'reference', _ref: asset._id },
  }

  await client
    .patch(job.doc)
    .setIfMissing({ [`sections[_key=="${job.key}"].images`]: [] })
    .append(`sections[_key=="${job.key}"].images`, [item])
    .commit()

  console.log(`✓ ${job.name} → ${job.doc} / ${job.key}`)
}
