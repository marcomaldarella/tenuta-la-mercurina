import { noOrphans } from '../lib/typo'

/* Un testo di sezione può contenere più titoletti, non solo quello in cima:
   in Studio si scrivono su una riga loro fra doppi asterischi — **così** —
   e qui diventano grassetti come i titoletti dei blocchi. Le righe normali
   restano paragrafi (gli a capo del CMS li tiene il white-space: pre-line). */
export default function BodyText({
  text,
  textClass,
  titleClass,
  className,
  tail,
}: {
  text: string
  textClass: string
  titleClass: string
  className?: string
  /* mail CORREZIONI SITO 23/11: la cta scorre in coda all'ultimo paragrafo,
     non su una riga sua — così il testo resta allineato alla foto con o
     senza pulsante */
  tail?: React.ReactNode
}) {
  const blocchi: { titolo: boolean; righe: string[] }[] = []

  for (const riga of text.split('\n')) {
    const titoletto = riga.trim().match(/^\*\*(.+)\*\*$/)
    if (titoletto) {
      blocchi.push({ titolo: true, righe: [titoletto[1].trim()] })
      continue
    }
    const ultimo = blocchi[blocchi.length - 1]
    if (ultimo && !ultimo.titolo) ultimo.righe.push(riga)
    else blocchi.push({ titolo: false, righe: [riga] })
  }

  /* la coda (cta) entra DENTRO l'ultimo paragrafo: individuato qui, così
     i titoletti eventualmente in fondo non la catturano */
  const ultimoParagrafo = blocchi.reduce(
    (found, blocco, i) =>
      !blocco.titolo && blocco.righe.some((r) => r.trim()) ? i : found,
    -1
  )

  /* un solo figlio del contenitore: così il gap del blocco non si infila
     fra il titoletto e il suo testo, la spaziatura la decide solo il CSS qui */
  return (
    <div className={className}>
      {blocchi.map((blocco, i) =>
        blocco.titolo ? (
          <h3 key={i} className={titleClass}>
            {noOrphans(blocco.righe[0])}
          </h3>
        ) : (
          /* richiesta cliente 11/11: niente a-capo né righe vuote nei testi —
             le righe del CMS si fondono in un paragrafo continuo. ECCEZIONE:
             le voci di elenco (righe che iniziano con •) restano una per riga */
          (() => {
            const linee: string[] = []
            for (const r of blocco.righe) {
              const riga = r.trim()
              if (!riga) continue
              const puntata = riga.startsWith('•') || riga.startsWith('- ')
              const prec = linee[linee.length - 1]
              if (puntata || !prec || prec.startsWith('•') || prec.startsWith('- ')) {
                linee.push(riga)
              } else {
                linee[linee.length - 1] = `${prec} ${riga}`
              }
            }
            if (!linee.length) return null
            return (
              <p key={i} className={textClass}>
                {linee.map((l, j) => (
                  <span key={j}>
                    {j > 0 && <br />}
                    {noOrphans(l)}
                  </span>
                ))}
                {tail && i === ultimoParagrafo && <> {tail}</>}
              </p>
            )
          })()
        )
      )}
      {/* testo senza paragrafi (solo titoletti): la coda non si perde */}
      {tail && ultimoParagrafo === -1 && <p className={textClass}>{tail}</p>}
    </div>
  )
}
