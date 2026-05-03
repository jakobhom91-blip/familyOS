import { useState } from 'react'

const EYE_ON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EYE_OFF = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const COPY_SVG = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

const EMPTY_LOGIN = { name: '', username: '', password: '', url: '' }

function LoginForm({ initial, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(initial)
  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <div style={formStyles.wrapper}>
      <div style={formStyles.row}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Navn</label>
          <input style={formStyles.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="fx Netflix" autoFocus />
        </div>
      </div>
      <div style={formStyles.row}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Brugernavn / Email</label>
          <input style={formStyles.input} value={form.username} onChange={e => set('username', e.target.value)} placeholder="jakob@gmail.com" autoComplete="off" />
        </div>
      </div>
      <div style={formStyles.row}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Adgangskode</label>
          <input style={formStyles.input} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" autoComplete="new-password" />
        </div>
      </div>
      <div style={formStyles.row}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>URL (valgfri)</label>
          <input style={formStyles.input} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button style={formStyles.btnSave} onClick={() => form.name.trim() && onSave(form)} disabled={!form.name.trim()}>Gem</button>
        <button style={formStyles.btnCancel} onClick={onCancel}>Annuller</button>
        {onDelete && <button style={formStyles.btnDelete} onClick={onDelete}>Slet</button>}
      </div>
    </div>
  )
}

function LoginCard({ login, onEdit, onDelete }) {
  const [showPw, setShowPw]     = useState(false)
  const [copied, setCopied]     = useState(false)
  const [editing, setEditing]   = useState(false)

  function copyPassword() {
    navigator.clipboard.writeText(login.password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (editing) {
    return (
      <LoginForm
        initial={{ name: login.name, username: login.username, password: login.password, url: login.url }}
        onSave={form => { onEdit(form); setEditing(false) }}
        onDelete={() => { onDelete(); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div style={cardStyles.wrapper}>
      <div style={cardStyles.top}>
        <span style={cardStyles.name}>{login.name}</span>
        <div style={cardStyles.actions}>
          <button style={cardStyles.btn} onClick={copyPassword} title="Kopier adgangskode">
            {copied ? <span style={{ fontSize: 11, color: 'var(--sacred-forest)' }}>Kopieret!</span> : COPY_SVG}
          </button>
          <button style={cardStyles.btn} onClick={() => setEditing(true)} title="Rediger">✎</button>
        </div>
      </div>

      {login.username && (
        <div style={cardStyles.field}>
          <span style={cardStyles.fieldLabel}>Brugernavn</span>
          <span style={cardStyles.fieldValue}>{login.username}</span>
        </div>
      )}

      {login.password && (
        <div style={cardStyles.field}>
          <span style={cardStyles.fieldLabel}>Adgangskode</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={cardStyles.fieldValue}>
              {showPw ? login.password : '••••••••'}
            </span>
            <button style={cardStyles.eyeBtn} onClick={() => setShowPw(v => !v)}>
              {showPw ? EYE_OFF : EYE_ON}
            </button>
          </div>
        </div>
      )}

      {login.url && (
        <div style={cardStyles.field}>
          <a href={login.url} target="_blank" rel="noreferrer" style={cardStyles.link}>
            {login.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        </div>
      )}
    </div>
  )
}

function Category({ cat, onUpdateLogins, onRename, onDelete }) {
  const [open, setOpen]         = useState(true)
  const [showNew, setShowNew]   = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [nameVal, setNameVal]   = useState(cat.name)

  function addLogin(form) {
    onUpdateLogins([...cat.logins, { ...form, id: Date.now() }])
    setShowNew(false)
  }

  function editLogin(id, form) {
    onUpdateLogins(cat.logins.map(l => l.id === id ? { ...l, ...form } : l))
  }

  function deleteLogin(id) {
    onUpdateLogins(cat.logins.filter(l => l.id !== id))
  }

  function saveRename() {
    if (nameVal.trim()) onRename(nameVal.trim())
    setRenaming(false)
  }

  return (
    <div style={catStyles.wrapper}>
      <div style={catStyles.header}>
        <button style={catStyles.toggle} onClick={() => setOpen(v => !v)}>
          <span style={{ fontSize: 10, marginRight: 6, opacity: 0.5 }}>{open ? '▼' : '▶'}</span>
          {renaming ? (
            <input
              style={{ ...formStyles.input, padding: '2px 8px', fontSize: 13, fontWeight: 600 }}
              value={nameVal}
              onChange={e => setNameVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setRenaming(false) }}
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span style={catStyles.name}>{cat.name}</span>
          )}
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          {renaming ? (
            <button style={catStyles.actionBtn} onClick={saveRename}>Gem</button>
          ) : (
            <button style={catStyles.actionBtn} onClick={() => setRenaming(true)} title="Omdøb kategori">✎</button>
          )}
          <button style={{ ...catStyles.actionBtn, color: 'var(--ember)' }} onClick={onDelete} title="Slet kategori">×</button>
          <button style={catStyles.actionBtn} onClick={() => { setShowNew(true); setOpen(true) }} title="Tilføj login">+</button>
        </div>
      </div>

      {open && (
        <div style={catStyles.body}>
          {cat.logins.map(l => (
            <LoginCard
              key={l.id}
              login={l}
              onEdit={form => editLogin(l.id, form)}
              onDelete={() => deleteLogin(l.id)}
            />
          ))}
          {showNew && (
            <LoginForm
              initial={EMPTY_LOGIN}
              onSave={addLogin}
              onCancel={() => setShowNew(false)}
            />
          )}
          {!showNew && (
            <button style={catStyles.addLoginBtn} onClick={() => setShowNew(true)}>
              + Tilføj login
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Vault({ vault, setVault }) {
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')

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
      <div className="section" style={{ marginBottom: 0 }}>
        <div className="section__header">
          <div className="section__title">Vault</div>
          <button className="section__add-btn" onClick={() => setShowNewCat(true)} title="Ny kategori">+</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
        {vault.map(cat => (
          <Category
            key={cat.id}
            cat={cat}
            onUpdateLogins={logins => updateLogins(cat.id, logins)}
            onRename={name => renameCategory(cat.id, name)}
            onDelete={() => deleteCategory(cat.id)}
          />
        ))}
      </div>

      {showNewCat && (
        <div style={{ ...formStyles.wrapper, marginTop: 12 }}>
          <div style={formStyles.field}>
            <label style={formStyles.label}>Kategorinavn</label>
            <input
              style={formStyles.input}
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCategory(); if (e.key === 'Escape') setShowNewCat(false) }}
              placeholder="fx Børn, Bank, Skole..."
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={formStyles.btnSave} onClick={addCategory} disabled={!newCatName.trim()}>Opret</button>
            <button style={formStyles.btnCancel} onClick={() => { setShowNewCat(false); setNewCatName('') }}>Annuller</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---- Styles ----

const formStyles = {
  wrapper: {
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 14,
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  row: { display: 'flex', gap: 10 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  label: { fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' },
  input: {
    padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)',
    background: '#fff', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
    outline: 'none', color: 'var(--koksgraa)',
  },
  btnSave: {
    padding: '7px 18px', borderRadius: 8, background: 'var(--deep-petrol)',
    color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  btnCancel: {
    padding: '7px 14px', borderRadius: 8, background: '#fff',
    color: 'var(--muted)', border: '1px solid var(--border)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
  },
  btnDelete: {
    padding: '7px 14px', borderRadius: 8, background: '#fff',
    color: 'var(--ember)', border: '1px solid var(--ember)',
    fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
    marginLeft: 'auto',
  },
}

const catStyles = {
  wrapper: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 16px', borderBottom: '1px solid var(--border)',
    background: 'var(--card)',
  },
  toggle: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', flex: 1, textAlign: 'left',
  },
  name: { fontSize: 14, fontWeight: 600, color: 'var(--deep-petrol)', fontFamily: 'DM Serif Display, serif' },
  actionBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--muted)', fontSize: 14, padding: '2px 6px',
    borderRadius: 5, fontFamily: 'DM Sans, sans-serif',
  },
  body: { padding: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  addLoginBtn: {
    background: 'none', border: '1px dashed var(--border)', borderRadius: 8,
    padding: '8px 14px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer',
    width: '100%', textAlign: 'left', fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color .15s, color .15s',
  },
}

const cardStyles = {
  wrapper: {
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 13, fontWeight: 600, color: 'var(--koksgraa)' },
  actions: { display: 'flex', gap: 4 },
  btn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--muted)', fontSize: 13, padding: '2px 6px',
    borderRadius: 5, display: 'flex', alignItems: 'center',
  },
  field: { display: 'flex', alignItems: 'center', gap: 10 },
  fieldLabel: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', minWidth: 80 },
  fieldValue: { fontSize: 13, color: 'var(--koksgraa)', fontFamily: 'monospace' },
  eyeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--muted)', padding: 0, display: 'flex', alignItems: 'center',
  },
  link: { fontSize: 12, color: 'var(--sacred-forest)', textDecoration: 'none' },
}
