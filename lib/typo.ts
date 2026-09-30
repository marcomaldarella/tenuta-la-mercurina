/* le parole di una sola lettera ("I nostri fornitori", "e", "a", "o") non
   devono mai restare appese a fine riga: lo spazio che le segue diventa
   unificatore ( ), così vanno sempre a capo insieme alla parola dopo.
   Doppio passaggio per le sequenze tipo "e a casa", dove il primo replace
   consuma lo spazio che farebbe da aggancio al secondo match. */
const SINGLE_LETTER = /(^|[\s("'«“‘])([AaEeIiOoÈè]) /g

export function noOrphans(s: string): string
export function noOrphans(s?: string): string | undefined
export function noOrphans(s?: string) {
  if (!s) return s
  return s
    .replace(SINGLE_LETTER, '$1$2 ')
    .replace(SINGLE_LETTER, '$1$2 ')
}
