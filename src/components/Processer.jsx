import { useState } from 'react'
import { FREQ_DAYS } from '../data/defaults.js'

const FREQS = ['Ugentlig', 'Månedlig', 'Halvårlig', 'Årlig']
const OWNERS = ['Jakob', 'Camilla', 'Begge']

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function isDue(p) {
  if (!p.lastDone) return true
  const days = FREQ_DAYS[p.freq] || 999
  const diff = (Date.now() - new Date(p.lastDone).getTime()) / (1000 * 60 * 60 * 24)
  return diff >= days
}

function OwnerBadge({ owner }) {
  const cls = owner === 'Jakob' ? 'jakob' : owner === 'Camilla' ? 'camilla' : 'begge'
  return (
    <span className={`badge badge--${cls}`}>
      <span className="badge__dot" />{owner}
    </span>
  )
}

function ProcessForm({ initial, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(initial)
  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  return (
    <div style={formStyles.wrapper}>
      <div style={formStyles.field}>
        <label style={formStyles.label}>Navn</label>
        <input
          style={formStyles.input}
          value={form.label}
          onChange={e => set('label', e.target.value)}
          placeholder="fx Støvsugning"
          autoFocus
        />
      </div>

      <div style={formStyles.field}>
        <label style={formStyles.label}>Frekvens</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FREQS.map(f => (
            <button
              key={f}
              onClick={() => set('freq', f)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                background: form.freq === f ? 'var(--deep-petrol)' : '#fff',
                color: form.freq === f ? '#fff' : 'var(--deep-petrol)',
                borderColor: 'var(--deep-petrol)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={formStyles.field}>
        <label style={formStyles.label}>Ejer</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {OWNERS.map(o => (
            <button
              key={o}
              onClick={() => set('owner', o)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                background: form.owner === o ? 'var(--sacred-forest)' : '#fff',
                color: form.owner === o ? '#fff' : 'var(--sacred-forest)',
                borderColor: 'var(--sacred-forest)',
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button
          style={formStyles.btnSave}
          onClick={() => form.label.trim() && onSave(form)}
          disabled={!form.label.trim()}
        >
          Gem
        </button>
        <button style={formStyles.btnCancel} onClick={onCancel}>
          Annuller
        </button>
        {onDelete && (
          <button style={formStyles.btnDelete} onClick={onDelete}>
            Slet
          </button>
        )}
      </div>
    </div>
  )
}

export default function Processer({ processes, setProcesses }) {
  const [editingId, setEditingId] = useState(null)
  const [showNew,   setShowNew]   = useState(false)
  const due = processes.filter(p => isDue(p))

  function markDone(id) {
    setProcesses(prev => prev.map(p =>
      p.id === id ? { ...p, lastDone: new Date().toISOString() } : p
    ))
  }

  function saveEdit(id, form) {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, ...form } : p))
    setEditingId(null)
  }

  function deleteProcess(id) {
    setProcesses(prev => prev.filter(p => p.id !== id))
    setEditingId(null)
  }

  function addProcess(form) {
    setProcesses(prev => [...prev, { ...form, id: Date.now(), lastDone: null }])
    setShowNew(false)
  }

  return (
    <div className="section">

      {/* Skal gøres nu */}
      {due.length > 0 && (
        <div className="process-due-section">
          <div className="process-due-header">
            <div className="process-due-title">Skal gøres nu</div>
            <div className="process-due-count">{due.length} opgave{due.length !== 1 ? 'r' : ''}</div>
          </div>
          {due.map(p => (
            <div key={p.id} className="process-due-row" onClick={() => markDone(p.id)}>
              <div className="process-due-row__cb">{CHECK_SVG}</div>
              <span className="process-due-row__label">{p.label}</span>
              <span className="process-due-row__freq">{p.freq}</span>
              <OwnerBadge owner={p.owner} />
            </div>
          ))}
        </div>
      )}

      {/* Tilbagevendende liste */}
      <div className="section__header" style={{ borderTop: due.length > 0 ? '1px solid var(--border)' : 'none' }}>
        <div className="section__title">Tilbagevendende</div>
        <button
          className="section__add-btn"
          onClick={() => { setShowNew(true); setEditingId(null) }}
          title="Tilføj proces"
        >
          +
        </button>
      </div>

      {processes.map(p => (
        <div key={p.id}>
          <div
            className="process-row"
            onClick={() => { setEditingId(editingId === p.id ? null : p.id); setShowNew(false) }}
            style={{ cursor: 'pointer' }}
          >
            <div className="process-row__freq">{p.freq}</div>
            <div className="process-row__label">{p.label}</div>
            <OwnerBadge owner={p.owner} />
            {!isDue(p) && <span className="process-row__done">✓ gjort</span>}
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 6, opacity: 0.5 }}>✎</span>
          </div>

          {editingId === p.id && (
            <div style={{ padding: '0 16px 12px' }}>
              <ProcessForm
                initial={{ label: p.label, freq: p.freq, owner: p.owner }}
                onSave={form => saveEdit(p.id, form)}
                onDelete={() => deleteProcess(p.id)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}
        </div>
      ))}

      {/* Tilføj ny formular */}
      {showNew && (
        <div style={{ padding: '0 16px 16px' }}>
          <ProcessForm
            initial={{ label: '', freq: 'Ugentlig', owner: 'Begge' }}
            onSave={addProcess}
            onCancel={() => setShowNew(false)}
          />
        </div>
      )}

    </div>
  )
}

const formStyles = {
  wrapper: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
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
