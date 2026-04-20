import { useState } from 'react'
import { FREQ_DAYS } from '../data/defaults.js'

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

export default function Processer({ processes, setProcesses }) {
  const [input, setInput] = useState('')
  const due = processes.filter(p => isDue(p))

  function markDone(id) {
    setProcesses(prev => prev.map(p =>
      p.id === id ? { ...p, lastDone: new Date().toISOString() } : p
    ))
  }

  function addProcess() {
    const val = input.trim(); if (!val) return
    // Format: "Ugentlig — Vasketøj — Jakob"
    const parts = val.split('—').map(s => s.trim())
    setProcesses(prev => [...prev, {
      id: Date.now(),
      freq:     parts[0] || 'Løbende',
      label:    parts[1] || parts[0],
      owner:    parts[2] || 'Begge',
      lastDone: null,
    }])
    setInput('')
  }

  return (
    <div className="section">
      {/* Due zone */}
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

      {/* Full list */}
      <div className="section__header" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="section__title">Tilbagevendende</div>
      </div>
      {processes.map(p => (
        <div key={p.id} className="process-row">
          <div className="process-row__freq">{p.freq}</div>
          <div className="process-row__label">{p.label}</div>
          <OwnerBadge owner={p.owner} />
          {!isDue(p) && <span className="process-row__done">✓ gjort</span>}
        </div>
      ))}

      <div className="add-bar">
        <input
          className="add-bar__input"
          placeholder="fx 'Ugentlig — Vasketøj — Jakob'"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addProcess()}
        />
        <button className="add-bar__btn" onClick={addProcess}>Tilføj</button>
      </div>
    </div>
  )
}
