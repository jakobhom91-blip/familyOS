import { useState, useRef } from 'react'

// ---- Brand farver og favicon ----
const BRAND_COLORS = {
  'netflix.com':      '#E50914',
  'aula.dk':          '#003C8F',
  'google.com':       '#4285F4',
  'youtube.com':      '#FF0000',
  'facebook.com':     '#1877F2',
  'instagram.com':    '#E1306C',
  'disneyplus.com':   '#113CCF',
  'disney.com':       '#113CCF',
  'hbo.com':          '#741DF4',
  'max.com':          '#741DF4',
  'spotify.com':      '#1DB954',
  'apple.com':        '#555555',
  'danskebank.dk':    '#003755',
  'nordea.dk':        '#00005E',
  'mobilepay.dk':     '#5A78FF',
  'nemid.net':        '#0060A0',
  'mitid.dk':         '#0B3D91',
  'mit.dk':           '#0B3D91',
  'sundhed.dk':       '#00786E',
  'skat.dk':          '#003366',
  'e-boks.dk':        '#007BC7',
  'dr.dk':            '#C8002D',
  'tv2.dk':           '#FF6600',
  'viaplay.com':      '#1A1A2E',
  'github.com':       '#24292E',
  'dropbox.com':      '#0061FF',
  'icloud.com':       '#3693F3',
}

const FALLBACK_PALETTE = [
  '#2F5D50','#013138','#5DD3C0','#F05A28',
  '#7B52C8','#D4547A','#1A3A8C','#5A8C30',
]

function getBrandColor(url) {
  if (!url) return FALLBACK_PALETTE[0]
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    if (BRAND_COLORS[domain]) return BRAND_COLORS[domain]
    // Deterministisk fallback fra domain-streng
    let hash = 0
    for (let i = 0; i < domain.length; i++) hash = domain.charCodeAt(i) + ((hash << 5) - hash)
    return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length]
  } catch {
    return FALLBACK_PALETTE[0]
  }
}

function getFaviconUrl(url) {
  if (!url) return null
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  } catch { return null }
}

// ---- Ikoner ----
const EYE_ON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EYE_OFF = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)
const COPY_SVG = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

// ---- PIN Modal ----
function PinModal({ title, onConfirm, onCancel, error }) {
  const [val, setVal] = useState('')
  const inputRef = useRef(null)

  return (
    <div style={pinStyles.overlay}>
      <div style={pinStyles.card}>
        <div style={pinStyles.title}>🔒 {title}</div>
        <p style={pinStyles.sub}>Indtast Vault PIN for at fortsætte</p>
        <input
          ref={inputRef}
          style={pinStyles.input}
          type="password"
          inputMode="numeric"
          maxLength={8}
          placeholder="••••"
          value={val}
          onChange={e => setVal(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => e.key === 'Enter' && val && onConfirm(val)}
          autoFocus
        />
        {error && <p style={pinStyles.error}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={fStyle.btnSave} onClick={() => val && onConfirm(val)} disabled={!val}>
            Bekræft
          </button>
          <button style={fStyle.btnCancel} onClick={onCancel}>
            Annuller
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Opret PIN Modal ----
function CreatePinModal({ onSave, onCancel }) {
  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    if (pin1.length < 4) { setError('PIN skal være mindst 4 cifre'); return }
    if (pin1 !== pin2) { setError('PIN-koderne matcher ikke'); return }
    onSave(pin1)
  }

  return (
    <div style={pinStyles.overlay}>
      <div style={pinStyles.card}>
        <div style={pinStyles.title}>🔒 Opret Vault PIN</div>
        <p style={pinStyles.sub}>Vælg en PIN-kode (4-8 cifre) der beskyttes sletning i Vault</p>
        <input
          style={pinStyles.input}
          type="password"
          inputMode="numeric"
          maxLength={8}
          placeholder="Vælg PIN"
          value={pin1}
          onChange={e => setPin1(e.target.value.replace(/\D/g, ''))}
          autoFocus
        />
        <input
          style={{ ...pinStyles.input, marginTop: 8 }}
          type="password"
          inputMode="numeric"
          maxLength={8}
          placeholder="Gentag PIN"
          value={pin2}
          onChange={e => setPin2(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        {error && <p style={pinStyles.error}>{error}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button style={fStyle.btnSave} onClick={handleSave} disabled={!pin1 || !pin2}>Gem PIN</button>
          <button style={fStyle.btnCancel} onClick={onCancel}>Annuller</button>
        </div>
      </div>
    </div>
  )
}

// ---- Login formular ----
const EMPTY_LOGIN = { name: '', username: '', password: '', url: '', note: '' }

function LoginForm({ initial, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState({ ...EMPTY_LOGIN, ...initial })
  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }
  const color = getBrandColor(form.url)

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {form.url && <img src={getFaviconUrl(form.url)} width={18} height={18} style={{ objectFit: 'contain' }} onError={e => e.target.style.display='none'} />}
        </div>
        <input style={fStyle.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Navn (fx Netflix)" autoFocus />
      </div>
      <input style={fStyle.input} value={form.url} onChange={e => set('url', e.target.value)} placeholder="URL (fx https://netflix.com)" />
      <input style={fStyle.input} value={form.username} onChange={e => set('username', e.target.value)} placeholder="Brugernavn / email" autoComplete="off" />
      <input style={fStyle.input} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Adgangskode" autoComplete="new-password" />
      <textarea style={{ ...fStyle.input, resize: 'vertical', minHeight: 60 }} value={form.note} onChange={e => set('note', e.target.value)} placeholder="Note (valgfri) — fx 'Arthurs profil: PIN 1234'" />
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={fStyle.btnSave} onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Gem</button>
        <button style={fStyle.btnCancel} onClick={onCancel}>Annuller</button>
        {onDelete && <button style={fStyle.btnDelete} onClick={onDelete}>Slet</button>}
      </div>
    </div>
  )
}

// ---- Login kort ----
function LoginCard({ login, onEdit, onDelete }) {
  const [showPw, setShowPw]   = useState(false)
  const [copied, setCopied]   = useState(false)
  const [editing, setEditing] = useState(false)
  const color   = getBrandColor(login.url)
  const favicon = getFaviconUrl(login.url)

  function copyPassword() {
    navigator.clipboard.writeText(login.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (editing) {
    return (
      <LoginForm
        initial={login}
        onSave={form => { onEdit(form); setEditing(false) }}
        onDelete={() => { onDelete(); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Farvet top-bar */}
      <div style={{ background: color, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {favicon && <img src={favicon} width={20} height={20} style={{ objectFit: 'contain' }} onError={e => e.target.style.display='none'} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{login.name}</div>
          {login.url && (
            <a href={login.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
              {login.url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 28)}
            </a>
          )}
        </div>
        <button style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', fontSize: 12, padding: '4px 8px' }} onClick={() => setEditing(true)}>✎</button>
      </div>

      {/* Indhold */}
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {login.username && (
          <div style={cardStyle.row}>
            <span style={cardStyle.label}>Brugernavn</span>
            <span style={cardStyle.value}>{login.username}</span>
          </div>
        )}

        {login.password && (
          <div style={cardStyle.row}>
            <span style={cardStyle.label}>Kode</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <span style={{ ...cardStyle.value, flex: 1 }}>{showPw ? login.password : '••••••••'}</span>
              <button style={cardStyle.iconBtn} onClick={() => setShowPw(v => !v)}>{showPw ? EYE_OFF : EYE_ON}</button>
              <button style={cardStyle.iconBtn} onClick={copyPassword}>
                {copied ? <span style={{ fontSize: 10, color: 'var(--sacred-forest)', whiteSpace: 'nowrap' }}>Kopieret!</span> : COPY_SVG}
              </button>
            </div>
          </div>
        )}

        {login.note && (
          <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5, marginTop: 2, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
            {login.note}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Kategori-kort ----
function CategoryCard({ cat, onUpdateLogins, onRename, onDelete, requestPin }) {
  const [showNew,   setShowNew]   = useState(false)
  const [renaming,  setRenaming]  = useState(false)
  const [nameVal,   setNameVal]   = useState(cat.name)

  function addLogin(form) {
    onUpdateLogins([...cat.logins, { ...form, id: Date.now() }])
    setShowNew(false)
  }

  function editLogin(id, form) {
    onUpdateLogins(cat.logins.map(l => l.id === id ? { ...l, ...form } : l))
  }

  function deleteLogin(id) {
    requestPin(() => onUpdateLogins(cat.logins.filter(l => l.id !== id)))
  }

  function handleDeleteCategory() {
    requestPin(() => onDelete())
  }

  function saveRename() {
    if (nameVal.trim()) onRename(nameVal.trim())
    setRenaming(false)
  }

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Kategori header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {renaming ? (
          <input
            style={{ ...fStyle.input, flex: 1, fontWeight: 700, fontSize: 15 }}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setRenaming(false) }}
            autoFocus
          />
        ) : (
          <h3 style={{ flex: 1, fontSize: 15, fontFamily: 'DM Serif Display, serif', color: 'var(--deep-petrol)', margin: 0 }}>{cat.name}</h3>
        )}
        <button style={catBtn} onClick={() => setRenaming(v => !v)} title="Omdøb">✎</button>
        <button style={{ ...catBtn, color: 'var(--ember)' }} onClick={handleDeleteCategory} title="Slet kategori">×</button>
      </div>

      {/* Login-kort i 2x2 grid */}
      {cat.logins.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {cat.logins.map(l => (
            <LoginCard
              key={l.id}
              login={l}
              onEdit={form => editLogin(l.id, form)}
              onDelete={() => deleteLogin(l.id)}
            />
          ))}
        </div>
      )}

      {/* Tilføj-formular */}
      {showNew ? (
        <LoginForm
          initial={EMPTY_LOGIN}
          onSave={addLogin}
          onCancel={() => setShowNew(false)}
        />
      ) : (
        <button
          style={{ background: 'none', border: '1.5px dashed var(--border)', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', width: '100%', textAlign: 'center', fontFamily: 'DM Sans, sans-serif' }}
          onClick={() => setShowNew(true)}
        >
          + Tilføj login
        </button>
      )}
    </div>
  )
}

// ---- Vault root ----
export default function Vault({ vault, setVault, vaultPin, setVaultPin }) {
  const [showNewCat,    setShowNewCat]    = useState(false)
  const [newCatName,    setNewCatName]    = useState('')
  const [pinModal,      setPinModal]      = useState(null)
  const [showCreatePin, setShowCreatePin] = useState(false)
  const [showResetPin,  setShowResetPin]  = useState(false)
  const pendingAction = useRef(null)

  // Åbn PIN-modal — callback gemmes og køres når PIN er korrekt
  function requestPin(action) {
    if (!vaultPin) {
      // Ingen PIN sat endnu — vis opret-flow
      pendingAction.current = action
      setShowCreatePin(true)
      return
    }
    pendingAction.current = action
    setPinModal({ error: '' })
  }

  function handlePinConfirm(entered) {
    if (entered === vaultPin) {
      setPinModal(null)
      pendingAction.current?.()
      pendingAction.current = null
    } else {
      setPinModal({ error: 'Forkert PIN. Prøv igen.' })
    }
  }

  function handleCreatePin(pin) {
    setVaultPin(pin)
    setShowCreatePin(false)
    // Kør den ventende handling efter PIN er sat
    pendingAction.current?.()
    pendingAction.current = null
  }

  function addCategory() {
    if (!newCatName.trim()) return
    setVault(prev => [...prev, { id: Date.now(), name: newCatName.trim(), logins: [] }])
    setNewCatName('')
    setShowNewCat(false)
  }

  function updateLogins(catId, logins) {
    setVault(prev => prev.map(c => c.id === catId ? { ...c, logins } : c))
  }

  function renameCategory(catId, name) {
    setVault(prev => prev.map(c => c.id === catId ? { ...c, name } : c))
  }

  function deleteCategory(catId) {
    setVault(prev => prev.filter(c => c.id !== catId))
  }

  return (
    <div>
      {/* PIN modals */}
      {pinModal && (
        <PinModal
          title="Bekræft sletning"
          error={pinModal.error}
          onConfirm={handlePinConfirm}
          onCancel={() => { setPinModal(null); pendingAction.current = null }}
        />
      )}
      {showCreatePin && (
        <CreatePinModal
          onSave={handleCreatePin}
          onCancel={() => { setShowCreatePin(false); pendingAction.current = null }}
        />
      )}
      {showResetPin && (
        <PinModal
          title="Indtast nuværende PIN"
          error={showResetPin.error || ''}
          onConfirm={entered => {
            if (entered === vaultPin) {
              setShowResetPin(false)
              setVaultPin('')
              setTimeout(() => setShowCreatePin(true), 100)
            } else {
              setShowResetPin({ error: 'Forkert PIN' })
            }
          }}
          onCancel={() => setShowResetPin(false)}
        />
      )}

      {/* Header */}
      <div className="section" style={{ marginBottom: 0 }}>
        <div className="section__header">
          <div className="section__title">Vault</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
              onClick={() => vaultPin ? setShowResetPin({}) : setShowCreatePin(true)}
              title={vaultPin ? 'Skift PIN' : 'Opret PIN'}
            >
              {vaultPin ? '🔒 Skift PIN' : '🔓 Opret PIN'}
            </button>
            <button className="section__add-btn" onClick={() => setShowNewCat(v => !v)} title="Ny kategori">+</button>
          </div>
        </div>
      </div>

      {/* Ny kategori formular */}
      {showNewCat && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            style={{ ...fStyle.input, flex: 1 }}
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCategory(); if (e.key === 'Escape') setShowNewCat(false) }}
            placeholder="Kategorinavn fx Børn, Bank, Skole..."
            autoFocus
          />
          <button style={fStyle.btnSave} onClick={addCategory} disabled={!newCatName.trim()}>Opret</button>
          <button style={fStyle.btnCancel} onClick={() => { setShowNewCat(false); setNewCatName('') }}>✕</button>
        </div>
      )}

      {/* Kategori-kort i 2-kolonne grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {vault.map(cat => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            onUpdateLogins={logins => updateLogins(cat.id, logins)}
            onRename={name => renameCategory(cat.id, name)}
            onDelete={() => deleteCategory(cat.id)}
            requestPin={requestPin}
          />
        ))}
      </div>
    </div>
  )
}

// ---- Styles ----
const fStyle = {
  input: {
    padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)',
    background: '#fff', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', color: 'var(--koksgraa)', width: '100%', boxSizing: 'border-box',
  },
  btnSave: {
    padding: '7px 18px', borderRadius: 8, background: 'var(--deep-petrol)',
    color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
  },
  btnCancel: {
    padding: '7px 12px', borderRadius: 8, background: '#fff',
    color: 'var(--muted)', border: '1px solid var(--border)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  btnDelete: {
    padding: '7px 14px', borderRadius: 8, background: '#fff',
    color: 'var(--ember)', border: '1px solid var(--ember)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginLeft: 'auto',
  },
}

const cardStyle = {
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  label: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', minWidth: 64, flexShrink: 0 },
  value: { fontSize: 12, color: 'var(--koksgraa)', fontFamily: 'monospace', wordBreak: 'break-all' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 },
}

const catBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--muted)', fontSize: 14, padding: '2px 6px', borderRadius: 5,
}

const pinStyles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: 24,
  },
  card: {
    background: '#fff', borderRadius: 16, padding: '32px 28px',
    maxWidth: 360, width: '100%', display: 'flex', flexDirection: 'column', gap: 12,
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
  },
  title: { fontSize: 18, fontWeight: 700, color: 'var(--deep-petrol)' },
  sub: { fontSize: 14, color: 'var(--muted)', margin: 0, lineHeight: 1.5 },
  input: {
    padding: '12px 14px', borderRadius: 8, border: '1.5px solid var(--border)',
    fontSize: 20, textAlign: 'center', letterSpacing: 6, fontFamily: 'monospace',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  error: { color: 'var(--ember)', fontSize: 13, margin: 0 },
}
