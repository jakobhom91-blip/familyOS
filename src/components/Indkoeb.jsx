// ============================================================
// Indkoeb.jsx
// ============================================================
import { useState } from 'react'

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function Indkoeb({ shopping, setShopping }) {
  const [input, setInput] = useState('')

  function toggle(id) {
    setShopping(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  function clearDone() {
    setShopping(prev => prev.filter(i => !i.done))
  }

  function add() {
    const val = input.trim(); if (!val) return
    setShopping(prev => [...prev, { id: Date.now(), label: val, qty: '', done: false }])
    setInput('')
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Indkøbsliste</div>
        <button className="section__add-btn" onClick={clearDone} title="Ryd afkrydsede">✓</button>
      </div>
      {shopping.map(item => (
        <div key={item.id} className={`check-row${item.done ? ' done' : ''}`} onClick={() => toggle(item.id)}>
          <div className="check-row__cb">{item.done && CHECK_SVG}</div>
          <span className="check-row__label">{item.label}</span>
          {item.qty && <span className="check-row__qty">{item.qty}</span>}
        </div>
      ))}
      <div className="add-bar">
        <input className="add-bar__input" placeholder="Tilføj vare…" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="add-bar__btn" onClick={add}>Tilføj</button>
      </div>
    </div>
  )
}
export default Indkoeb
