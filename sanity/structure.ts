import type { StructureBuilder, StructureResolver } from 'sanity/structure'

/* Studio ordinato come la nav del sito: le pagine fisse si aprono dirette
   (niente liste piatte da scavare), i gruppi rispecchiano le pagine unite.
   Gli id dei doc sono quelli storici, non sempre uguali allo slug. */

const pagina = (S: StructureBuilder, id: string, title: string) =>
  S.listItem()
    .id(id)
    .title(title)
    .schemaType('page')
    .child(S.document().documentId(id).schemaType('page'))

const gruppo = (
  S: StructureBuilder,
  id: string,
  title: string,
  voci: [string, string][]
) =>
  S.listItem()
    .id(id)
    .title(title)
    .child(
      S.list()
        .title(title)
        .items(voci.map(([docId, label]) => pagina(S, docId, label)))
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenuti')
    .items([
      pagina(S, 'page-home', 'Home'),
      S.divider(),
      gruppo(S, 'gruppo-tenuta', 'Tenuta', [
        ['page-chi-siamo', 'la tenuta'],
        ['page-la-storia', 'la storia'],
        ['page-casa-di-caccia', 'ex casa di caccia'],
        ['page-taneto', "l'ontaneto"],
        ['page-prodotti', 'i prodotti della tenuta'],
      ]),
      gruppo(S, 'gruppo-foresteria', 'Foresteria', [
        ['page-camere', 'le camere'],
        ['page-il-porticato', 'il porticato'],
        ['page-la-corte-giardino', 'la corte giardino'],
        ['page-location', 'gli spazi interni'],
      ]),
      gruppo(S, 'gruppo-esperienze', 'Esperienze', [
        ['page-esperienze', 'hero della pagina'],
        ['page-percorsi-naturalistici', 'percorsi'],
        ['page-workshop-floreali', 'workshop'],
        ['lQZy04MU9BHWsLf0pNsOlA', 'retreat'],
        ['page-visite-e-lezioni', 'crea la tua esperienza'],
      ]),
      gruppo(S, 'gruppo-eventi', 'Eventi', [
        ['page-eventi', 'hero della pagina'],
        ['page-il-mercato', 'il mercato della domenica'],
        ['page-pranzo-a-tema', 'pranzo a tema'],
        ['page-matrimoni', 'matrimoni'],
        ['page-eventi-privati', 'crea il tuo evento'],
      ]),
      pagina(S, 'page-fondazione', 'Fondazione'),
      pagina(S, 'page-contatti', 'Contatti'),
      S.divider(),
      S.listItem()
        .id('mercato-date')
        .title('Date del mercato')
        .schemaType('marketDate')
        .child(
          S.documentTypeList('marketDate')
            .title('Date del mercato')
            .defaultOrdering([{ field: 'date', direction: 'desc' }])
        ),
      pagina(S, 'page-prenota', 'Pagina prenota'),
      S.listItem()
        .id('prenotazioni')
        .title('Prenotazioni ricevute')
        .schemaType('booking')
        .child(
          S.documentTypeList('booking')
            .title('Prenotazioni ricevute')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }])
        ),
      S.divider(),
      gruppo(S, 'gruppo-altre', 'Altre pagine (fuori menu)', [
        ['page-foresteria', 'foresteria (pagina propria)'],
        ['page-didattica-ambientale', 'didattica ambientale'],
        ['page-team-building', 'team building'],
        ['page-privacy-policy', 'privacy policy'],
      ]),
      S.listItem()
        .id('impostazioni')
        .title('Impostazioni sito')
        .schemaType('siteSettings')
        .child(
          S.document().documentId('siteSettings').schemaType('siteSettings')
        ),
    ])
