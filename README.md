# Familie OS

Et fælles familie-dashboard til Jakob & Camilla.

## Kom i gang

```bash
# 1. Installer afhængigheder
npm install

# 2. Start lokal udviklingsserver
npm run dev

# 3. Åbn i browser
# http://localhost:5173
```

## Byg til produktion

```bash
npm run build
# Output i /dist — kan uploades til Vercel, Netlify eller Cloudflare Pages
```

## Hvor redigerer jeg indholdet?

**Alt startindhold** — navne, roller, processer, links, kontakter, budget — ligger i én fil:

```
src/data/defaults.js
```

Åbn den fil og rediger direkte. Eksempler:

```js
// Skift navne
export const FAMILY_NAMES = {
  person1: 'Jakob',
  person2: 'Camilla',
}

// Ret månedlig indbetaling
export const DEFAULT_BUDGET_TOTAL = 24000

// Tilføj en ny proces
{ id: 9, freq: 'Månedlig', label: 'Vasketøj', owner: 'Begge', lastDone: null },

// Tilføj et link
{ id: 9, emoji: '📱', name: 'MobilePay', desc: 'Betaling', url: 'https://www.mobilepay.dk' },
```

## Ryd localStorage (nulstil til defaults)

Åbn browser-konsollen og kør:
```js
Object.keys(localStorage).filter(k => k.startsWith('familie-')).forEach(k => localStorage.removeItem(k))
location.reload()
```

## Filstruktur

```
familie-os/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx              ← entry point
│   ├── App.jsx               ← app shell, routing, localStorage
│   ├── styles/
│   │   └── globals.css       ← alle farver og styles (GROW-palette)
│   ├── data/
│   │   └── defaults.js       ← AL redigerbar data samlet ét sted
│   └── components/
│       ├── Header.jsx
│       ├── Nav.jsx
│       ├── Overblik.jsx      ← rollekort + to-do lister
│       ├── Kalender.jsx      ← uge + månedsoverblik
│       ├── Indkoeb.jsx       ← delt indkøbsliste
│       ├── Oekonomi.jsx      ← fælleskonto + budgetposter
│       ├── Processer.jsx     ← tilbagevendende + forfaldne
│       ├── Husmøde.jsx       ← aktive aftaler + mødelogbog
│       ├── Links.jsx         ← hurtige links
│       └── Kontakter.jsx     ← vigtige numre
```

## Farvepalette (GROW.lab "Systemskiftere")

Alle farver er CSS-variabler i `globals.css`:

| Navn           | Hex       | Bruges til               |
|----------------|-----------|--------------------------|
| Deep Petrol    | `#013138` | Header, primær           |
| Sacred Forest  | `#2F5D50` | Navigation, knapper      |
| Ember Orange   | `#F05A28` | Accent, Camilla, forfald |
| Turkis         | `#5DD3C0` | Highlights, positive tal |
| Lys Glød       | `#FBE8BE` | Aftaler, varm accent     |
| Koksgrå        | `#2D2D2D` | Primær tekst             |

## Næste skridt (trin 2)

- [ ] Google Calendar OAuth — automatisk hent af begivenheder
- [ ] Deploy på Vercel med delt URL
- [ ] PWA — installerbar som app på telefon
- [ ] Push-notifikationer til forfaldne processer
- [ ] Delt real-time state (Firebase / Supabase)
