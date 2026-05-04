// ============================================
// FAMILIE OS — Default data
// Rediger her for at ændre startindhold
// ============================================

export const FAMILY_NAMES = {
  person1: 'Jakob',
  person2: 'Camilla',
  family: 'Familie',
}

// ---- Roller & domæner ----
// colors: petrol | forest | ember | turkis | glod | slate
export const DEFAULT_ROLES = [
  { id: 1, label: 'Skole & Aula',          sub: 'Kontakt, beskeder, møder', owner: 'Camilla', color: 'forest' },
  { id: 2, label: 'Bil & praktisk',         sub: 'Service, forsikring',      owner: 'Jakob',   color: 'petrol' },
  { id: 3, label: 'Økonomi & regninger',    sub: 'Overblik & betaling',      owner: 'Jakob',   color: 'turkis' },
  { id: 4, label: 'Madplan & indkøb',       sub: 'Ugentlig plan',            owner: 'Begge',   color: 'glod'   },
  { id: 5, label: 'Fritidsaktiviteter',     sub: 'Tilmelding, transport',    owner: 'Camilla', color: 'ember'  },
  { id: 6, label: 'Husmøde & aftaler',      sub: 'Planlægning & log',        owner: 'Begge',   color: 'slate'  },
]

// ---- To-do lister ----
export const DEFAULT_TODOS = {
  jakob: [
    { id: 1, label: 'Ring til tandlægen ang. Arthur', done: false },
    { id: 2, label: 'Bestil vinterdæk', done: false },
  ],
  camilla: [
    { id: 1, label: 'Tilmeld Carl til svømmekursus', done: false },
    { id: 2, label: 'Svar lærer på Aula', done: false },
  ],
  begge: [
    { id: 1, label: 'Book sommerferie', done: false },
    { id: 2, label: 'Næste husmøde — find dato', done: false },
  ],
}

// ---- Kalender ----
// Ugevisning: dage vises man–søn
// owner: 'jakob' | 'camilla' | 'begge'
export const DEFAULT_WEEK_EVENTS = [
  { id: 1, day: 'Man', date: 21, label: 'Arthur — fodbold',  time: '16:00', owner: 'jakob'   },
  { id: 2, day: 'Tir', date: 22, label: 'Tandlæge Carl',     time: '10:30', owner: 'camilla' },
  { id: 3, day: 'Tir', date: 22, label: 'Møde HGT',          time: '09:00', owner: 'jakob'   },
  { id: 4, day: 'Ons', date: 23, label: 'Carl — svømning',   time: '15:30', owner: 'camilla' },
  { id: 5, day: 'Fre', date: 25, label: 'Familieaften',      time: '18:00', owner: 'begge'   },
]

// Månedsoverblik: key er 'YYYY-M-D' (ingen leading zeros på M og D)
export const DEFAULT_MONTH_EVENTS = {
  '2026-4-21': [{ label: 'Arthur — fodbold',  owner: 'jakob'   }],
  '2026-4-22': [{ label: 'Tandlæge Carl',     owner: 'camilla' }, { label: 'Møde HGT', owner: 'jakob' }],
  '2026-4-23': [{ label: 'Carl — svømning',   owner: 'camilla' }],
  '2026-4-25': [{ label: 'Familieaften',      owner: 'begge'   }],
}

// ---- Indkøb ----
export const DEFAULT_SHOPPING = [
  { id: 1, label: 'Mælk',              qty: '2 liter', done: false },
  { id: 2, label: 'Brød',              qty: '',        done: false },
  { id: 3, label: 'Kylling',           qty: 'til aftensmad', done: false },
  { id: 4, label: 'Frugt til madpakker', qty: '',      done: false },
]

// ---- Økonomi ----
// Rediger budgetTotal for at ændre den månedlige indbetalingstotal
export const DEFAULT_BUDGET_TOTAL = 24000

// Rediger beløb direkte her — eller via "ret"-knappen i appen
// color: hex-kode
export const DEFAULT_BUDGET_POSTS = [
  { id: 1, label: 'Husleje',           amount: 16000, color: '#013138' },
  { id: 2, label: 'Mad & dagligvarer', amount: 6000,  color: '#2F5D50' },
  { id: 3, label: 'Bil',               amount: 2000,  color: '#5DD3C0' },
]

// ---- Processer ----
// freq: 'Ugentlig' | 'Månedlig' | 'Halvårlig' | 'Årlig'
// lastDone: null = aldrig gjort (vises altid i "Skal gøres nu")
//           ISO-datostreng fx '2026-01-15'
export const DEFAULT_PROCESSES = [
  { id: 1, freq: 'Ugentlig',  label: 'Madplan & indkøb',         owner: 'Begge',   lastDone: null },
  { id: 2, freq: 'Ugentlig',  label: 'Støvsugning',              owner: 'Jakob',   lastDone: null },
  { id: 3, freq: 'Månedlig',  label: 'Regninger & økonomi',      owner: 'Jakob',   lastDone: null },
  { id: 4, freq: 'Månedlig',  label: 'Skole-tjek (Aula)',        owner: 'Camilla', lastDone: null },
  { id: 5, freq: 'Halvårlig', label: 'Tandlæge børn',            owner: 'Camilla', lastDone: '2026-01-01' },
  { id: 6, freq: 'Halvårlig', label: 'Vinterdæk / sommerdæk',    owner: 'Jakob',   lastDone: '2025-10-01' },
  { id: 7, freq: 'Årlig',     label: 'Forsikringer gennemgang',  owner: 'Jakob',   lastDone: '2025-06-01' },
  { id: 8, freq: 'Årlig',     label: 'Sommerferie booking',      owner: 'Begge',   lastDone: null },
]

// Frekvens → dage (bruges til at beregne om en proces er forfalden)
export const FREQ_DAYS = {
  'Ugentlig':  7,
  'Månedlig':  30,
  'Halvårlig': 183,
  'Årlig':     365,
}

// ---- Aktive aftaler ----
// owner: 'jakob' | 'camilla' | 'begge'
export const DEFAULT_AGREEMENTS = [
  { id: 1, text: 'Jakob støvsuger hver søndag',        owner: 'jakob'   },
  { id: 2, text: 'Camilla tjekker Aula mandag morgen', owner: 'camilla' },
  { id: 3, text: 'Madplan laves søndag aften',         owner: 'begge'   },
]

// ---- Husmøde-log ----
export const DEFAULT_MEETINGS = [
  {
    id: 1,
    title: 'Husmøde #3',
    date: 'Marts 2026',
    notes: 'Arthur er utilfreds med at han altid skal rydde op efter Carl. Vi talte om en fast spilletid til Carl.',
    aftaler: [
      { id: 1, text: 'Carl må spille spil 30 min efter lektier' },
      { id: 2, text: 'Arthur & Carl skiftes til at rydde op' },
    ],
  },
  {
    id: 2,
    title: 'Husmøde #2',
    date: 'Februar 2026',
    notes: 'Snakkede om ferieønsker til sommer. Børnene vil gerne til stranden.',
    aftaler: [
      { id: 1, text: 'Jakob & Camilla finder 3 ferieforslag til marts-mødet' },
    ],
  },
]

// ---- Links ----
export const DEFAULT_LINKS = [
  { id: 1, emoji: '🏫', name: 'Aula',          desc: 'Skole & beskeder',   url: 'https://www.aula.dk'           },
  { id: 2, emoji: '🛒', name: 'Nemlig',         desc: 'Dagligvarer online', url: 'https://www.nemlig.com'        },
  { id: 3, emoji: '🏥', name: 'Sundhed.dk',     desc: 'Lægekontakt',        url: 'https://www.sundhed.dk'        },
  { id: 4, emoji: '📋', name: 'Skat.dk',        desc: 'Årsopgørelse',       url: 'https://www.skat.dk'           },
  { id: 5, emoji: '📬', name: 'e-Boks',         desc: 'Digital post',       url: 'https://www.e-boks.dk'         },
  { id: 6, emoji: '🔑', name: 'MitID',          desc: 'Digital signatur',   url: 'https://www.mit.dk'            },
  { id: 7, emoji: '📅', name: 'Familiekalender',desc: 'Google Calendar',    url: 'https://calendar.google.com'  },
  { id: 8, emoji: '🚌', name: 'Rejseplanen',    desc: 'Transport',          url: 'https://www.rejseplanen.dk'   },
]

// ---- Kontakter ----
export const DEFAULT_CONTACTS = [
  { id: 1, emoji: '👨‍⚕️', name: 'Familielæge',        sub: 'Indsæt nummer'    },
  { id: 2, emoji: '🦷',   name: 'Tandlæge',            sub: 'Indsæt nummer'    },
  { id: 3, emoji: '🏫',   name: 'Arthurs skole',       sub: 'Indsæt nummer'    },
  { id: 4, emoji: '🏫',   name: 'Carls institution',   sub: 'Indsæt nummer'    },
  { id: 5, emoji: '🚗',   name: 'Vejhjælp — Falck',    sub: '70 10 20 30'      },
]

// ---- Indkøbs-historik ----
// Tæller hvor mange gange en vare er tilføjet — bruges til hurtigtilføj-chips
// Start-værdier sikrer at faste varer vises fra dag 1
export const DEFAULT_SHOPPING_HISTORY = {
  'Havremælk':   5,
  'Spegepølse':  5,
  'Smør':        5,
  'Ost':         5,
  'Bananer':     5,
  'Appelsiner':  5,
  'Vaskepulver': 5,
  'Mælk':        4,
  'Brød':        4,
  'Æg':          3,
  'Yoghurt':     3,
  'Pasta':       3,
  'Tomat':       2,
  'Løg':         2,
  'Kartofler':   2,
}

// ---- Vault PIN ----
export const DEFAULT_VAULT_PIN = ''

// ---- Vault ----
export const DEFAULT_VAULT = [
  {
    id: 1,
    name: 'Skole',
    logins: [
      { id: 1, name: 'Aula', username: '', password: '', url: 'https://www.aula.dk', note: '' },
    ],
  },
  {
    id: 2,
    name: 'Streaming',
    logins: [
      { id: 1, name: 'Netflix', username: '', password: '', url: 'https://www.netflix.com', note: '' },
      { id: 2, name: 'Disney+', username: '', password: '', url: 'https://www.disneyplus.com', note: '' },
    ],
  },
  {
    id: 3,
    name: 'Børn',
    logins: [],
  },
  {
    id: 4,
    name: 'Bank & økonomi',
    logins: [],
  },
]
