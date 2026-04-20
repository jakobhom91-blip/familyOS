# Familie OS — Projekt Specifikation

## Hvad er det?
Et fælles familie-dashboard til Jakob & Camilla. En webapp der samler alle familiens operationelle behov ét sted — kalender, to-do, indkøb, økonomi, processer, husmøde-log, links og kontakter.

## Design
- **Farvepalette (GROW.lab "Systemskiftere")**
  - Deep Petrol: `#013138` — header, primær baggrund
  - Sacred Forest: `#2F5D50` — navigation, knapper
  - Ember Orange: `#F05A28` — accent, aktiv fane, advarsler
  - Turkis: `#5DD3C0` — highlights, positive tal
  - Lys Glød: `#FBE8BE` — baggrund for aftaler, warm accent
  - Koksgrå: `#2D2D2D` — primær tekst
- **Typografi**: DM Serif Display (headings) + DM Sans (body)
- **Ejerskab-farver**:
  - Jakob: Sacred Forest `#2F5D50`
  - Camilla: Ember Orange `#F05A28`
  - Begge: Deep Petrol `#013138`

## Sektioner / Faner

### 1. Overblik (forside)
- **Rollekort** — 3 kolonner, 6 farver, viser domæne + ansvarlig
- **To-do — Jakob** — tjekliste med afkryds + slet
- **To-do — Camilla** — tjekliste med afkryds + slet
- **To-do — Fælles** — tjekliste med afkryds + slet

### 2. Kalender
- **Uge-visning** — dag for dag med farvekodet ejer
- **Måneds-visning** — gridkalender med farveprikker per begivenhed
- Begge kan tilføje begivenheder

### 3. Indkøb
- Delt tjekliste
- Afkryds enkeltvis, ryd alle afkrydsede med ét klik

### 4. Økonomi
- Fælleskonto: fast månedlig indbetalingstotal (redigerbar)
- Faste poster med beløb og procentandel (redigerbare)
- Progressbar: brugt vs. tilbage
- Tilføj/ret poster

### 5. Processer
- To zoner:
  - **"Skal gøres nu"** — automatisk filtreret ud fra frekvens + sidst udført
  - **"Tilbagevendende"** — fuld liste med frekvens, ejer, done-status
- Klik for at markere som gjort → nulstiller timer
- Frekvenser: Ugentlig (7d), Månedlig (30d), Halvårlig (183d), Årlig (365d)

### 6. Husmøde
- **Aktive aftaler** — gul boks øverst, tilføj/slet enkeltvis
- **Mødelogbog** — kronologisk log med dato, noter, aftaler per møde
- Fra log kan aftaler "promoveres" til aktive aftaler
- Formular til nyt møde: titel, noter, aftaler

### 7. Links
- 2-kolonne grid med emoji, navn, beskrivelse
- Klik åbner i ny fane
- Tilføj egne links

### 8. Kontakter
- Liste med emoji-ikon, navn, nummer
- Tilføj egne kontakter

## Teknisk stack (anbefalet)
```
React + Vite
Tailwind CSS (eller plain CSS med CSS variables)
localStorage til state-persistering (ingen backend nødvendig i første version)
Google Calendar API (trin 2 — ikke implementeret endnu)
```

## Filstruktur
```
familie-os/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── data/
│   │   └── defaults.js        ← alle standard-data
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Nav.jsx
│   │   ├── Overblik.jsx
│   │   ├── Kalender.jsx
│   │   ├── Indkoeb.jsx
│   │   ├── Oekonomi.jsx
│   │   ├── Processer.jsx
│   │   ├── Husmøde.jsx
│   │   ├── Links.jsx
│   │   └── Kontakter.jsx
└── public/
    └── favicon.ico
```

## State / localStorage nøgler
```
familie-todos-jakob
familie-todos-camilla
familie-todos-begge
familie-calendar-events
familie-shopping-list
familie-budget-posts
familie-budget-total
familie-processes
familie-agreements
familie-meetings
familie-links
familie-contacts
familie-roles
```

## Næste skridt (trin 2)
- Google Calendar OAuth integration (henter events automatisk)
- Deployment på Vercel/Netlify med delt URL til Jakob + Camilla
- PWA (Progressive Web App) — kan "installeres" på telefon som app
- Push-notifikationer til processer der er forfaldne
