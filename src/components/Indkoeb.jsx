import { useState } from 'react'

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function parseInput(raw) {
  // "Mælk x2" → { label: 'Mælk', qty: 'x2' }
  // "Mælk 2 liter" → { label: 'Mælk', qty: '2 liter' }
  // "Mælk" → { label: 'Mælk', qty: '' }
  const match = raw.trim().match(/^(.+?)\s+(x\d+|\d+\s*\w*)$/i)
  if (match) return { label: match[1].trim(), qty: match[2].trim() }
  return { label: raw.trim(), qty: '' }
}

function getTopChips(history, shopping, limit = 15) {
  const onList = new Set(shopping.map(i => i.label.toLowerCase()))
  return Object.entries(history)
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label)
    .filter(label => !onList.has(label.toLowerCase()))
    .slice(0, limit)
}

export function Indkoeb({ shopping, setShopping, shoppingHistory, setShoppingHistory }) {
  const [input, setInput] = useState('')

  const notDone = shopping.filter(i => !i.done)
  const done    = shopping.filter(i => i.done)
  const chips   = getTopChips(shoppingHistory || {}, shopping)

  function incrementHistory(label) {
    const key = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
    setShoppingHistory(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }))
  }

  function toggle(id) {
    setShopping(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  function remove(id) {
    setShopping(prev => prev.filter(i => i.id !== id))
  }

  function clearDone() {
    setShopping(prev => prev.filter(i => !i.done))
  }

  function add(rawLabel, rawQty = '') {
    const { label, qty } = rawLabel.includes(' ') || rawQty
      ? { label: rawLabel, qty: rawQty }
      : parseInput(rawLabel)
    if (!label) return
    setShopping(prev => [...prev, { id: Date.now(), label, qty, done: false }])
    incrementHistory(label)
    setInput('')
  }

  function addFromInput() {
    if (!input.trim()) return
    const { label, qty } = parseInput(input)
    add(label, qty)
  }

  function addChip(label) {
    add(label, '')
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Indkøbsliste</div>
        {done.length > 0 && (
          <button className="section__add-btn" onClick={clearDone} title="Ryd afkrydsede">✓</button>
        )}
      </div>

      {/* Hurtigtilføj chips */}
      {chips.length > 0 && (
        <div style={chipStyles.wrapper}>
          <div style={chipStyles.label}>Hurtig tilføj</div>
          <div style={chipStyles.list}>
            {chips.map(chip => (
              <button key={chip} style={chipStyles.chip} onClick={() => addChip(chip)}>
                + {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ikke-købt varer */}
      {notDone.map(item => (
        <div
          key={item.id}
          className="check-row"
          onClick={() => toggle(item.id)}
        >
          <div className="check-row__cb" />
          <span className="check-row__label">{item.label}</span>
          {item.qty && <span className="check-row__qty">{item.qty}</span>}
          <button
            style={deleteStyle}
            onClick={e => { e.stopPropagation(); remove(item.id) }}
          >×</button>
        </div>
      ))}

      {/* Købt-sektion */}
      {done.length > 0 && (
        <>
          <div style={doneHeaderStyle}>
            Købt ({done.length})
          </div>
          {done.map(item => (
            <div
              key={item.id}
              className="check-row done"
              onClick={() => toggle(item.id)}
              style={{ opacity: 0.5 }}
            >
              <div className="check-row__cb">{CHECK_SVG}</div>
              <span className="check-row__label">{item.label}</span>
              {item.qty && <span className="check-row__qty">{item.qty}</span>}
              <button
                style={deleteStyle}
                onClick={e => { e.stopPropagation(); remove(item.id) }}
              >×</button>
            </div>
          ))}
        </>
      )}

      {/* Tilføj bar */}
      <div className="add-bar">
        <input
          className="add-bar__input"
          placeholder="Tilføj vare… fx 'Mælk x2'"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addFromInput()}
        />
        <button className="add-bar__btn" onClick={addFromInput}>+</button>
      </div>
    </div>
  )
}

export default Indkoeb

const chipStyles = {
  wrapper: {
    padding: '10px 16px 8px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    marginBottom: 8,
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    background: '#fff',
    color: 'var(--sacred-forest)',
    border: '1px solid var(--sacred-forest)',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'all .15s',
  },
}

const doneHeaderStyle = {
  padding: '6px 16px',
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  borderTop: '1px solid var(--border)',
  borderBottom: '1px solid var(--border)',
  background: 'var(--bg)',
}

const deleteStyle = {
  background: 'none',
  border: 'none',
  color: 'transparent',
  fontSize: 16,
  cursor: 'pointer',
  padding: '0 2px',
  marginLeft: 4,
  transition: 'color .15s',
}
