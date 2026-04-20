import { useState } from 'react'

export default function Kontakter({ contacts, setContacts }) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim(); if (!val) return
    const parts = val.split('—').map(s => s.trim())
    setContacts(prev => [...prev, {
      id: Date.now(),
      emoji: '📞',
      name: parts[0],
      sub: parts[1] || '',
    }])
    setInput('')
  }

  function remove(id) {
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Vigtige kontakter</div>
      </div>
      {contacts.map(c => (
        <div key={c.id} className="row">
          <div style={{ fontSize: 15, width: 22, textAlign: 'center' }}>{c.emoji}</div>
          <div className="row__content">
            <div className="row__label">{c.name}</div>
            {c.sub && <div className="row__sub">{c.sub}</div>}
          </div>
          <button
            onClick={() => remove(c.id)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14 }}
          >×</button>
        </div>
      ))}
      <div className="add-bar">
        <input
          className="add-bar__input"
          placeholder="fx 'Tandlæge — 33 12 XX XX'"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="add-bar__btn" onClick={add}>Tilføj</button>
      </div>
    </div>
  )
}
