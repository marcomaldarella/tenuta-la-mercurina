// Carica i testi definitivi dal doc "testi sito tenuta motel milano.doc"
// IT dal documento, EN tradotti a mano (rivedibili in Studio).
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
)

const client = createClient({
  projectId: '1tm4878j',
  dataset: 'production',
  token: env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
})

const key = () => randomBytes(6).toString('hex')
const section = (it, en, textIt, textEn, extra = {}) => ({
  _type: 'section',
  _key: key(),
  title: { _type: 'localeString', it, en },
  text: { _type: 'localeText', it: textIt, en: textEn },
  cta: 'none',
  ...extra,
})

/* ── testi ── */

const INTRO_IT = `Attraversare un bosco di ontani mentre gli aironi della garzaia si alzano in volo, tra canali e rogge. Percorrere un lungo viale di pioppi cipressini con due ali di risaie che al cambiare delle stagioni cambiano lo scenario. Raggiungere una delle due cascine dove si trovano la foresteria e i suoi spazi, e aprire lo sguardo sulla corte interna, sul porticato in mattoni rossi e sugli edifici chiari delle case degli ex salariati.
Immersa in 200 ettari di risaie, tenuta lamercurina è un esempio di tradizione e tutela della semplicità rurale.`
const INTRO_EN = `Crossing an alder wood as the herons of the heronry take flight, among canals and irrigation ditches. Walking down a long avenue of cypress poplars flanked by rice fields whose scenery changes with the seasons. Reaching one of the two farmsteads that house the guesthouse and its spaces, and opening your gaze onto the inner courtyard, the red-brick portico and the pale buildings of the former farmhands' homes.
Set in 200 hectares of rice fields, tenuta lamercurina is an example of tradition and of safeguarding rural simplicity.`

const STORIA_IT = `Un'antica tenuta dell'alta borghesia milanese situata nel cuore della Lomellina, a 40 minuti da Milano e vicina alle grandi città di Genova e Torino.
Acquistata negli anni '50 da un importante capitano dell'industria chimica italiana, Piero Saronio, fondatore della Saronio Chimica, in seguito Presidente della Carlo Erba e consulente del governo. La storia di questa famiglia ruota in particolare attorno alla figura di Carlo Saronio, raccontata da Mario Calabresi nel suo libro "Quello che non ti dicono", edito da Mondadori.
Carlo Saronio fu rapito e ucciso il 4 aprile del 1975 a Milano; oggi una targa in sua memoria è posata sul palazzo di Corso Venezia dove fu rapito. A fare da sfondo alla storia, divenendone personaggio essa stessa, è la Tenuta la Mercurina, teatro di episodi chiave degli anni di piombo: è lì che si incontrarono Toni Negri, il filosofo padovano, e il brigatista Renato Curcio.`
const STORIA_EN = `An old estate of the Milanese upper class in the heart of Lomellina, 40 minutes from Milan and close to the great cities of Genoa and Turin.
It was purchased in the 1950s by a leading captain of the Italian chemical industry, Piero Saronio, founder of Saronio Chimica, later Chairman of Carlo Erba and government advisor. The story of this family revolves in particular around the figure of Carlo Saronio, told by Mario Calabresi in his book "Quello che non ti dicono", published by Mondadori.
Carlo Saronio was kidnapped and killed in Milan on 4 April 1975; today a plaque in his memory stands on the building in Corso Venezia where he was abducted. The backdrop to this story — and a character in it — is Tenuta la Mercurina, the setting of key episodes of Italy's Years of Lead: it was here that Toni Negri, the Paduan philosopher, and Renato Curcio of the Red Brigades met.`

const CACCIA_IT = `All'interno della tenuta, ai confini del bosco, si trova la ex Casa di Caccia, costruita a metà degli anni '50 con dettagli architettonici che riportano alla "scuola" di importanti architetti dell'epoca come Portaluppi, oggetto di un'approfondita ricerca documentale.
Una residenza di rappresentanza per accogliere amici e personalità della borghesia milanese e internazionale, tra battute di caccia e cene conviviali. Un grande camino nella sala da pranzo e un tavolo per 20 persone sono il fulcro della sala centrale, con grandi vetrate che affacciano sul bosco e sul viale.
Oggi è aperta al pubblico per visite ed eventi culturali.`
const CACCIA_EN = `Within the estate, on the edge of the wood, stands the former Hunting Lodge, built in the mid-1950s with architectural details recalling the "school" of leading architects of the time such as Portaluppi, and the subject of in-depth documentary research.
A residence built to host friends and figures of the Milanese and international upper class, between hunting parties and convivial dinners. A great fireplace in the dining room and a table for 20 are the heart of the central hall, with large windows overlooking the wood and the avenue.
Today it is open to the public for visits and cultural events.`

const CHISIAMO_IT = `Un pool di professionisti innamorati della natura e delle antiche architetture rurali di cui la campagna lombarda è costellata. Anni di lavoro e di impegno per riportare la tenuta alla sua originale bellezza. L'amore per la semplicità del vero lusso.`
const CHISIAMO_EN = `A pool of professionals in love with nature and with the old rural architecture that dots the Lombard countryside. Years of work and dedication to bring the estate back to its original beauty. A love for the simplicity of true luxury.`

const ONTANETO_1_IT = `Gli ambienti naturali presenti nell'area sono di grande rilevanza scientifica e naturalistica e rappresentano un patrimonio di biodiversità molto importante, che merita di essere conservato e conosciuto.`
const ONTANETO_1_EN = `The natural environments of the area are of great scientific and naturalistic importance and represent a precious heritage of biodiversity that deserves to be preserved and known.`
const ONTANETO_2_IT = `In Tenuta, la preziosa foresta di ontano nero che cresce in un terreno paludoso e i fontanili che alimentano i corsi d'acqua naturali, ricchi di specie vegetali e animali. All'interno si trova una delle "garzaie" più belle della Lomellina.`
const ONTANETO_2_EN = `On the estate, the precious black alder forest growing on marshy ground and the springs that feed the natural watercourses, rich in plant and animal species. Within it lies one of the most beautiful heronries in Lomellina.`

const PORTICO_IT = `Un porticato aggettante, sorretto da pilastri in mattoni, che in passato ospitava carri, carrozze e landò: oggi uno spazio ampio che si presta ad allestimenti di grande fascino, affaccia sulla corte interna con giardino ed è illuminato di sera.`
const PORTICO_EN = `A projecting portico, supported by brick pillars, that once sheltered carts, carriages and landaus: today a generous space lending itself to displays of great charm, overlooking the inner courtyard garden and lit up in the evening.`
const CORTE_IT = `Cuore pulsante della vita di campagna, luogo di gioco e di festa, la corte interna è uno spazio verde da vivere per eventi open air, di giorno e di sera. Festeggiare sotto le stelle immersi nell'atmosfera calda che si accende al tramonto: tutto intorno è d'oro, come polvere di stelle che illumina di magia la festa.`
const CORTE_EN = `The beating heart of country life, a place of play and celebration, the inner courtyard is a green space to be lived in for open-air events, by day and by night. Celebrating under the stars in the warm atmosphere that lights up at sunset: everything around turns golden, like stardust casting its magic over the party.`
const STALLA_IT = `La ex stalla, completamente restaurata, apre ampi spazi con volte antiche, riscaldata e raffrescata, con finestre che affacciano sulle risaie o sul porticato. Un restauro conservativo e l'illuminazione a pavimento completano l'atmosfera degli interni.`
const STALLA_EN = `The former stable, fully restored, opens up generous spaces with ancient vaults, heated and cooled, with windows looking onto the rice fields or the portico. A conservative restoration and floor lighting complete the atmosphere of the interiors.`

const CAMERE_IT = `11 camere, ricavate dalle vecchie abitazioni degli ex salariati, ristrutturate seguendo un restauro conservativo che ha voluto mantenere intatte tutte le caratteristiche strutturali ed estetiche e recuperare l'antico fascino.
Materiali e colori, così come i dettagli, seguono il concetto di funzionalità. Tutto il restauro è caratterizzato dalla parola "semplicità", che contraddistingue la filosofia della tenuta.`
const CAMERE_EN = `11 rooms, created from the former farmhands' homes, renovated through a conservative restoration that kept all structural and aesthetic features intact and recovered their old charm.
Materials and colours, as well as details, follow the concept of functionality. The whole restoration is defined by the word "simplicity", the hallmark of the estate's philosophy.`
const TIPOLOGIE_IT = `Le tipologie matrimoniale classica e suite, tutte dotate di bagno en suite con doccia, aria condizionata e riscaldamento, zanzariere, courtesy kit e doppia esposizione.`
const TIPOLOGIE_EN = `Classic double and suite room types, all with en-suite bathroom with shower, air conditioning and heating, mosquito nets, courtesy kit and dual aspect.`

const PERCORSI_IT = `Passeggiate e soggiorni che permettono di riscoprire la natura percorrendo i sentieri della tenuta, tra bosco e risaie, scoprendone la biodiversità accompagnati da guide naturalistiche certificate.`
const PERCORSI_EN = `Walks and stays to rediscover nature along the estate's trails, between wood and rice fields, exploring their biodiversity in the company of certified nature guides.`
const RISO_TOUR_IT = `Scoprire il riso e i suoi segreti con un/una "sommelier del riso", nuova figura certificata che accompagna attraverso le risaie alla scoperta del riso e delle sue varietà, con degustazione e cooking class.`
const RISO_TOUR_EN = `Discover rice and its secrets with a certified "rice sommelier", a new professional figure who leads you through the paddies to explore rice and its varieties, with tastings and cooking classes.`
const FLOREALI_IT = `Con una flower designer che insegna a comporre un centrotavola e fa scoprire le erbe spontanee che crescono in tenuta.`
const FLOREALI_EN = `With a flower designer who teaches you how to compose a centrepiece and introduces you to the wild herbs growing on the estate.`
const YOGA_IT = `Su prenotazione, lezioni private di yoga e pilates immersi nella natura della tenuta.`
const YOGA_EN = `By reservation, private yoga and pilates lessons immersed in the nature of the estate.`
const CANTINE_IT = `Visite guidate alle cantine del Monferrato o dell'Oltrepò, alla scoperta dei vini e dei produttori del territorio.`
const CANTINE_EN = `Guided tours of the wineries of Monferrato and Oltrepò, discovering the wines and producers of the area.`
const TERRITORIO_IT = `Visite guidate alla scoperta del territorio della Lomellina, tra cascine storiche, borghi e paesaggi d'acqua.`
const TERRITORIO_EN = `Guided tours to discover the Lomellina area, among historic farmsteads, villages and waterscapes.`

const MERCATO_IT = `Due edizioni, primavera e autunno: un evento che riunisce espositori, musica, buon cibo e convivialità.`
const MERCATO_EN = `Two editions, spring and autumn: an event bringing together exhibitors, music, good food and conviviality.`
const PRANZO_IT = `Due volte al mese viene organizzato un pranzo a tema stagionale con prodotti del territorio, accompagnato da un workshop floreale.`
const PRANZO_EN = `Twice a month, a seasonal themed lunch with local produce is organised, accompanied by a floral workshop.`
const MATRIMONI_IT = `Uno scenario unico e semplicemente autentico. Dai matrimoni intimi alle celebrazioni più grandi, ogni matrimonio in tenuta è curato con amore e attenzione. I nostri fornitori si preoccuperanno di personalizzare il tuo evento.`
const MATRIMONI_EN = `A unique, simply authentic setting. From intimate weddings to larger celebrations, every wedding on the estate is looked after with love and care. Our suppliers will take care of tailoring your event.`
const TUOEVENTO_IT = `Feste e party privati e aziendali, team building in natura, retreat di yoga, weekend olistici, forest bathing: organizza il tuo evento in tenuta.`
const TUOEVENTO_EN = `Private and corporate parties, team building in nature, yoga retreats, holistic weekends, forest bathing: organise your event on the estate.`

const PRODOTTI_RISO_IT = `Il riso della tenuta è coltivato in biodiversità, su un territorio agricolo circondato dalla natura e lontano da strade di passaggio, e dà vita a diverse varietà di altissima qualità, tra cui il Vialone Nano e il Carnaroli classico.`
const PRODOTTI_RISO_EN = `The estate's rice is grown amid biodiversity, on farmland surrounded by nature and far from busy roads, producing several varieties of the highest quality, including Vialone Nano and classic Carnaroli.`
const PRODOTTI_MIELE_IT = `Il miele di tiglio o millefiori della tenuta è prodotto nella natura dal nostro apicoltore; le arnie sono stanziali nei nostri terreni.`
const PRODOTTI_MIELE_EN = `The estate's lime-blossom and wildflower honey is produced in nature by our beekeeper; the hives are kept permanently on our land.`
const PRODOTTI_SPACCIO_IT = `I prodotti possono essere acquistati nello spaccio della tenuta, oppure ritrovati nei menù e nelle bomboniere degli eventi.`
const PRODOTTI_SPACCIO_EN = `Our products can be purchased at the estate shop, or found in event menus and wedding favours.`

const FONDAZIONE_HERO_IT = `La Tenuta è stata oggetto di un'importante ri-generazione a cura della Fondazione Darefrutto, che ne è la custode e che porta avanti progetti di educazione ambientale, cultura e didattica per scuole, professionisti e privati.`
const FONDAZIONE_HERO_EN = `The estate has undergone a major re-generation led by the Darefrutto Foundation, its custodian, which carries out environmental education, culture and teaching projects for schools, professionals and private individuals.`
const RIGENERAZIONE_IT = `Dal male al bene, dalla violenza privata alla sostenibilità sociale, dalla morte alla nuova vita: è questo il senso del progetto di rigenerazione della Tenuta la Mercurina e, come riporta incisa la targa dedicata a Carlo Saronio, "la sua storia prosegue con la Fondazione Darefrutto".`
const RIGENERAZIONE_EN = `From evil to good, from private violence to social sustainability, from death to new life: this is the meaning of the regeneration project of Tenuta la Mercurina and, as the plaque dedicated to Carlo Saronio reads, "his story continues with the Darefrutto Foundation".`

const DIDATTICA_IT = `La Fondazione Darefrutto porta avanti in tenuta progetti di educazione ambientale, cultura e didattica per scuole, professionisti e privati, promuovendo la tutela del patrimonio rurale, naturalistico e ambientale.`
const DIDATTICA_EN = `On the estate, the Darefrutto Foundation carries out environmental education, culture and teaching projects for schools, professionals and private individuals, promoting the protection of the rural, natural and environmental heritage.`

const TEAMBUILDING_IT = `Team building in natura, retreat di yoga, weekend olistici, forest bathing: la tenuta è lo scenario ideale per giornate aziendali e di gruppo lontane dalla città, tra bosco, risaie e spazi restaurati.`
const TEAMBUILDING_EN = `Team building in nature, yoga retreats, holistic weekends, forest bathing: the estate is the ideal setting for corporate and group days away from the city, among woods, rice fields and restored spaces.`

/* teaser home: una riga per sezione */
const HOME_TEASER = {
  'chi siamo': ['Anni di lavoro per riportare la tenuta alla sua originale bellezza: l’amore per la semplicità del vero lusso.', 'Years of work to bring the estate back to its original beauty: a love for the simplicity of true luxury.'],
  foresteria: ['11 camere ricavate dalle case degli ex salariati, restaurate nel segno della semplicità.', '11 rooms created from the former farmhands’ homes, restored in the name of simplicity.'],
  taneto: ['La foresta di ontano nero, i fontanili e una delle garzaie più belle della Lomellina.', 'The black alder forest, the springs and one of the most beautiful heronries in Lomellina.'],
  location: ['Portico, corte giardino e antiche stalle restaurate per eventi open air e allestimenti.', 'Portico, courtyard garden and restored old stables for open-air events and displays.'],
  'percorsi naturalistici': ['Sentieri tra bosco e risaie con guide naturalistiche certificate.', 'Trails between wood and rice fields with certified nature guides.'],
  'didattica ambientale': ['Progetti di educazione ambientale per scuole, professionisti e privati.', 'Environmental education projects for schools, professionals and private individuals.'],
  'team building': ['Giornate aziendali e di gruppo in natura, tra bosco, risaie e spazi restaurati.', 'Corporate and group days in nature, among woods, rice fields and restored spaces.'],
  eventi: ['Matrimoni, pranzi a tema, feste private e aziendali in uno scenario autentico.', 'Weddings, themed lunches, private and corporate parties in an authentic setting.'],
  'il mercato': ['Due edizioni, primavera e autunno: espositori, musica, buon cibo e convivialità.', 'Two editions, spring and autumn: exhibitors, music, good food and conviviality.'],
  prodotti: ['Riso Vialone Nano e Carnaroli, miele di tiglio e millefiori dallo spaccio della tenuta.', 'Vialone Nano and Carnaroli rice, lime-blossom and wildflower honey from the estate shop.'],
  fondazione: ['La Fondazione Darefrutto custodisce la tenuta e i suoi progetti di rigenerazione.', 'The Darefrutto Foundation is the custodian of the estate and its regeneration projects.'],
}

/* ── esecuzione ── */

const setLoc = (patch, path, it, en) =>
  patch.set({ [`${path}.it`]: it, [`${path}.en`]: en })

const run = async () => {
  const pages = await client.fetch('*[_type == "page"]{ _id, "secs": sections[]{ _key } }')
  const secKeys = Object.fromEntries(pages.map((p) => [p._id, (p.secs || []).map((s) => s._key)]))
  const tx = client.transaction()

  // home: hero + teaser sezioni
  {
    const p = client.patch('page-home')
    setLoc(p, 'hero.text', INTRO_IT, INTRO_EN)
    const homeSecs = await client.fetch('*[_id == "page-home"][0].sections[]{ _key, "t": title.it }')
    for (const s of homeSecs) {
      const teaser = HOME_TEASER[s.t]
      if (teaser) setLoc(p, `sections[_key=="${s._key}"].text`, teaser[0], teaser[1])
    }
    // la voce "taneto" in home diventa "ontaneto"
    const taneto = homeSecs.find((s) => s.t === 'taneto')
    if (taneto) setLoc(p, `sections[_key=="${taneto._key}"].title`, 'ontaneto', 'the alder grove')
    tx.patch(p)
  }

  // chi siamo: chi siamo in hero, storia + casa di caccia come sezioni
  {
    const [k0, k1] = secKeys['page-chi-siamo']
    const p = client.patch('page-chi-siamo')
    setLoc(p, 'hero.text', CHISIAMO_IT, CHISIAMO_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'La storia', 'The history')
    setLoc(p, `sections[_key=="${k0}"].text`, STORIA_IT, STORIA_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'La ex Casa di Caccia', 'The former Hunting Lodge')
    setLoc(p, `sections[_key=="${k1}"].text`, CACCIA_IT, CACCIA_EN)
    tx.patch(p)
  }

  // taneto → Ontaneto
  {
    const [k0, k1] = secKeys['page-taneto']
    const p = client.patch('page-taneto')
    setLoc(p, 'title', 'Ontaneto', 'The alder grove')
    setLoc(p, 'hero.text', ONTANETO_1_IT, ONTANETO_1_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'Un patrimonio di biodiversità', 'A heritage of biodiversity')
    setLoc(p, `sections[_key=="${k0}"].text`, ONTANETO_1_IT, ONTANETO_1_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'La foresta e la garzaia', 'The forest and the heronry')
    setLoc(p, `sections[_key=="${k1}"].text`, ONTANETO_2_IT, ONTANETO_2_EN)
    tx.patch(p)
  }

  // location: portico, corte giardino (+ spazi interni)
  {
    const [k0, k1] = secKeys['page-location']
    const p = client.patch('page-location')
    setLoc(p, 'hero.text',
      'Portico, corte giardino e antiche stalle restaurate: gli spazi della tenuta si prestano ad allestimenti ed eventi open air, di giorno e di sera.',
      'Portico, courtyard garden and restored old stables: the estate’s spaces lend themselves to displays and open-air events, by day and by night.')
    setLoc(p, `sections[_key=="${k0}"].title`, 'Il porticato', 'The portico')
    setLoc(p, `sections[_key=="${k0}"].text`, PORTICO_IT, PORTICO_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'La corte giardino', 'The courtyard garden')
    setLoc(p, `sections[_key=="${k1}"].text`, CORTE_IT, CORTE_EN)
    p.insert('after', 'sections[-1]', [section('Gli spazi interni', 'The interiors', STALLA_IT, STALLA_EN)])
    tx.patch(p)
  }

  // foresteria: camere + tipologie (details prezzi/servizi restano)
  {
    const [k0, k1] = secKeys['page-foresteria']
    const p = client.patch('page-foresteria')
    setLoc(p, 'hero.text', CAMERE_IT, CAMERE_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'Le camere', 'The rooms')
    setLoc(p, `sections[_key=="${k0}"].text`, CAMERE_IT, CAMERE_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'Le tipologie', 'Room types')
    setLoc(p, `sections[_key=="${k1}"].text`, TIPOLOGIE_IT, TIPOLOGIE_EN)
    tx.patch(p)
  }

  // percorsi naturalistici: le esperienze
  {
    const [k0, k1] = secKeys['page-percorsi-naturalistici']
    const p = client.patch('page-percorsi-naturalistici')
    setLoc(p, 'hero.text', PERCORSI_IT, PERCORSI_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'Percorsi in natura', 'Nature trails')
    setLoc(p, `sections[_key=="${k0}"].text`, PERCORSI_IT, PERCORSI_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'Percorsi a tema riso', 'Rice-themed tours')
    setLoc(p, `sections[_key=="${k1}"].text`, RISO_TOUR_IT, RISO_TOUR_EN)
    p.insert('after', 'sections[-1]', [
      section('Workshop floreali', 'Floral workshops', FLOREALI_IT, FLOREALI_EN),
      section('Lezioni private di yoga e pilates', 'Private yoga and pilates lessons', YOGA_IT, YOGA_EN),
      section('Visite guidate alle cantine', 'Guided winery tours', CANTINE_IT, CANTINE_EN),
      section('Alla scoperta del territorio', 'Discovering the area', TERRITORIO_IT, TERRITORIO_EN),
    ])
    tx.patch(p)
  }

  // didattica ambientale (testo derivato dalla fondazione — da far rivedere)
  {
    const [k0, k1] = secKeys['page-didattica-ambientale']
    const p = client.patch('page-didattica-ambientale')
    setLoc(p, 'hero.text', DIDATTICA_IT, DIDATTICA_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'Per le scuole', 'For schools')
    setLoc(p, `sections[_key=="${k0}"].text`,
      'Percorsi didattici tra bosco, garzaia e risaie per scoprire la biodiversità della tenuta.',
      'Educational trails through wood, heronry and rice fields to discover the estate’s biodiversity.')
    setLoc(p, `sections[_key=="${k1}"].title`, 'Per professionisti e privati', 'For professionals and private individuals')
    setLoc(p, `sections[_key=="${k1}"].text`,
      'Incontri e attività di cultura ambientale promossi dalla Fondazione Darefrutto.',
      'Environmental culture meetings and activities promoted by the Darefrutto Foundation.')
    tx.patch(p)
  }

  // team building
  {
    const [k0, k1] = secKeys['page-team-building']
    const p = client.patch('page-team-building')
    setLoc(p, 'hero.text', TEAMBUILDING_IT, TEAMBUILDING_EN)
    setLoc(p, `sections[_key=="${k0}"].title`, 'Organizza il tuo evento', 'Organise your event')
    setLoc(p, `sections[_key=="${k0}"].text`, TUOEVENTO_IT, TUOEVENTO_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'Team building in natura', 'Team building in nature')
    setLoc(p, `sections[_key=="${k1}"].text`, TEAMBUILDING_IT, TEAMBUILDING_EN)
    tx.patch(p)
  }

  // eventi
  {
    const [k0, k1] = secKeys['page-eventi']
    const p = client.patch('page-eventi')
    setLoc(p, 'hero.text',
      'Matrimoni, pranzi a tema, feste private e aziendali: uno scenario unico e semplicemente autentico.',
      'Weddings, themed lunches, private and corporate parties: a unique, simply authentic setting.')
    setLoc(p, `sections[_key=="${k0}"].title`, 'Il mercato della domenica', 'The Sunday market')
    setLoc(p, `sections[_key=="${k0}"].text`, MERCATO_IT, MERCATO_EN)
    p.set({ [`sections[_key=="${k0}"].cta`]: 'page', [`sections[_key=="${k0}"].page`]: { _type: 'reference', _ref: 'page-il-mercato' } })
    setLoc(p, `sections[_key=="${k1}"].title`, 'Matrimoni e wedding destination', 'Weddings and destination weddings')
    setLoc(p, `sections[_key=="${k1}"].text`, MATRIMONI_IT, MATRIMONI_EN)
    p.insert('after', 'sections[-1]', [
      section('Pranzo a tema con workshop floreale', 'Themed lunch with floral workshop', PRANZO_IT, PRANZO_EN),
      section('Il tuo evento', 'Your event', TUOEVENTO_IT, TUOEVENTO_EN, { cta: 'contatti' }),
    ])
    tx.patch(p)
  }

  // il mercato
  {
    const p = client.patch('page-il-mercato')
    setLoc(p, 'hero.text', MERCATO_IT, MERCATO_EN)
    tx.patch(p)
  }

  // prodotti: riso / miele / spaccio
  {
    const [k0, k1, k2] = secKeys['page-prodotti']
    const p = client.patch('page-prodotti')
    setLoc(p, 'hero.text',
      'Riso, miele e i prodotti della tenuta, coltivati in biodiversità e acquistabili nello spaccio.',
      'Rice, honey and the estate’s produce, grown amid biodiversity and available at the farm shop.')
    setLoc(p, `sections[_key=="${k0}"].title`, 'Il riso', 'The rice')
    setLoc(p, `sections[_key=="${k0}"].text`, PRODOTTI_RISO_IT, PRODOTTI_RISO_EN)
    setLoc(p, `sections[_key=="${k1}"].title`, 'Il miele', 'The honey')
    setLoc(p, `sections[_key=="${k1}"].text`, PRODOTTI_MIELE_IT, PRODOTTI_MIELE_EN)
    setLoc(p, `sections[_key=="${k2}"].title`, 'Lo spaccio', 'The farm shop')
    setLoc(p, `sections[_key=="${k2}"].text`, PRODOTTI_SPACCIO_IT, PRODOTTI_SPACCIO_EN)
    tx.patch(p)
  }

  // fondazione: hero + sezione rigenerazione in coda (Storia/Mission/Sostenitori restano)
  {
    const p = client.patch('page-fondazione')
    setLoc(p, 'hero.text', FONDAZIONE_HERO_IT, FONDAZIONE_HERO_EN)
    p.insert('after', 'sections[-1]', [
      section('La rigenerazione', 'The regeneration', RIGENERAZIONE_IT, RIGENERAZIONE_EN),
    ])
    tx.patch(p)
  }

  // indirizzo in siteSettings (dal doc contatti)
  tx.patch('siteSettings', (p) =>
    p.set({ address: 'Via Cascina San Marzano 5, SP194, 27037 Pieve del Cairo (PV)' })
  )

  await tx.commit()
  console.log('Testi caricati su tutte le pagine.')
}

run()
