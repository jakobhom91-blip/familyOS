import { useState } from 'react'

const COLORS = [
  'petrol', 'forest', 'ember', 'turkis', 'glod', 'slate',
  'rose', 'navy', 'sand', 'lavender', 'moss', 'coral',
]

const COLOR_HEX = {
  petrol:   '#013138', forest: '#2F5D50', ember:    '#F05A28',
  turkis:   '#5DD3C0', glod:   '#F5C842', slate:    '#888480',
  rose:     '#D4547A', navy:   '#1A3A8C', sand:     '#C4A060',
  lavender: '#7B52C8', moss:   '#5A8C30', coral:    '#D45A30',
}

const OWNERS = ['Jakob', 'Camilla', 'Begge']

const EMPTY = { label: '', sub: '', owner: 'Begge', color: 'petrol' }

function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
      {COLORS.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          title={c}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: COLOR_HEX[c],
            border: value === c ? '3px solid #1a1a1a' : '2px solid transparent',
            outline: value === c ? '2px solid #fff' : 'none',
            cursor: 'pointer', padding: 0, flexShrink: 0,
            boxShadow: value === c ? '0 0 0 3px ' + COLOR_HEX[c] + '66' : 'none',
          }}
        />
      ))}
    </div>
  )
}

function RoleForm({ initial, onSave, onDelete, onCancel }) {
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
          placeholder="fx Skole & Aula"
        />
      </div>
      <div style={formStyles.field}>
        <label style={formStyles.label}>Beskrivelse</label>
        <input
          style={formStyles.input}
          value={form.sub}
          onChange={e => set('sub', e.target.value)}
          placeholder="fx Kontakt, beskeder, møder"
        />
      </div>
      <div style={formStyles.field}>
        <label style={formStyles.label}>Ejer</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {OWNERS.map(o => (
            <button
              key={o}
              onClick={() => set('owner', o)}
              style={{
                padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                background: form.owner === o ? 'var(--deep-petrol)' : '#fff',
                color: form.owner === o ? '#fff' : 'var(--deep-petrol)',
                borderColor: 'var(--deep-petrol)',
              }}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div style={formStyles.field}>
        <label style={formStyles.label}>Farve</label>
        <ColorPicker value={form.color} onChange={v => set('color', v)} />
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

export default function Domaener({ roles, setRoles }) {
  const [editingId, setEditingId] = useState(null)
  const [showNew,   setShowNew]   = useState(false)

  function saveEdit(id, form) {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...form } : r))
    setEditingId(null)
  }

  function deleteRole(id) {
    setRoles(prev => prev.filter(r => r.id !== id))
    setEditingId(null)
  }

  function addRole(form) {
    setRoles(prev => [...prev, { ...form, id: Date.now() }])
    setShowNew(false)
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Domæner</div>
        <button
          className="section__add-btn"
          onClick={() => { setShowNew(true); setEditingId(null) }}
          title="Tilføj domæne"
        >
          +
        </button>
      </div>

      <div className="role-grid">
        {roles.map(r => (
          <div key={r.id}>
            <div
              className={`role-card role-card--${r.color}`}
              onClick={() => { setEditingId(editingId === r.id ? null : r.id); setShowNew(false) }}
              style={{ cursor: 'pointer', transition: 'opacity .15s', opacity: editingId && editingId !== r.id ? 0.6 : 1 }}
            >
              <div className="role-card__label">{r.label}</div>
              <div className="role-card__sub">{r.sub}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div className="role-card__badge">{r.owner}</div>
                <span style={{ fontSize: 10, opacity: 0.5 }}>✎</span>
              </div>
            </div>

            {editingId === r.id && (
              <RoleForm
                initial={{ label: r.label, sub: r.sub, owner: r.owner, color: r.color }}
                onSave={form => saveEdit(r.id, form)}
                onDelete={() => deleteRole(r.id)}
                onCancel={() => setEditingId(null)}
              />
            )}
          </div>
        ))}
      </div>

      {showNew && (
        <div style={{ padding: '0 12px 12px' }}>
          <RoleForm
            initial={EMPTY}
            onSave={addRole}
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
    marginTop: 8,
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
