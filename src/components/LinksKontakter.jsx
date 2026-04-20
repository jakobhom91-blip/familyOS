// ============================================================
// Links.jsx
// ============================================================
export function Links({ links, setLinks }) {
  function addLink() {
    const name = window.prompt('Navn på link:'); if (!name) return
    const url  = window.prompt('URL (https://...)'); if (!url) return
    const emoji = window.prompt('Emoji (valgfri):', '🔗') || '🔗'
    setLinks(prev => [...prev, { id: Date.now(), emoji, name, desc: url.replace('https://','').split('/')[0], url }])
  }

  function removeLink(id) {
    if (window.confirm('Fjern dette link?')) setLinks(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Hurtige links</div>
        <button className="section__add-btn" onClick={addLink}>+</button>
      </div>
      <div className="links-grid">
        {links.map(l => (
          <a key={l.id} className="link-item" href={l.url} target="_blank" rel="noopener noreferrer"
            onContextMenu={e => { e.preventDefault(); removeLink(l.id) }}>
            <div className="link-item__emoji">{l.emoji}</div>
            <div>
              <div className="link-item__name">{l.name}</div>
              <div className="link-item__desc">{l.desc}</div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ padding: '8px 16px', fontSize: 10, color: 'var(--muted)' }}>
        Højreklik / langt tryk for at fjerne et link
      </div>
    </div>
  )
}
export default Links


// ============================================================
// Kontakter.jsx
// ============================================================
import { useState } from 'react'

export function Kontakter({ contacts, setContacts }) {
  const [input, setInput] = useState('')

  function add() {
    const val = input.trim(); if (!val) return
    // Format: "Tandlæge — 33 12 XX XX"
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
        <input className="add-bar__input" placeholder="fx 'Tandlæge — 33 12 XX XX'" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="add-bar__btn" onClick={add}>Tilføj</button>
      </div>
    </div>
  )
}
export default Kontakter
