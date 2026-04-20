import { useState } from 'react'
import { FREQ_DAYS } from '../data/defaults.js'

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="checkmark">
    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const REPEAT_SVG = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M17 2l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 11V9a4 4 0 014-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 22l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 13v2a4 4 0 01-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function isDue(p) {
  if (!p.lastDone) return true
  const days = FREQ_DAYS[p.freq] || 999
  const diff = (Date.now() - new Date(p.lastDone).getTime()) / (1000 * 60 * 60 * 24)
  return diff >= days
}

function Badge({ owner }) {
  const cls = owner === 'Jakob' ? 'jakob' : owner === 'Camilla' ? 'camilla' : 'begge'
  return (
    <span className={`badge badge--${cls}`} style={{ fontSize: 10, marginLeft: 4 }}>
      <span className="badge__dot" />{owner}
    </span>
  )
}

function TodoList({ who, items, dueProcesses, setTodos, setProcesses }) {
  const [input, setInput] = useState('')
  const label     = who === 'jakob' ? 'Jakob' : who === 'camilla' ? 'Camilla' : 'Fælles'
  const ownerName = who === 'jakob' ? 'Jakob' : who === 'camilla' ? 'Camilla' : 'Begge'

  function toggle(id) {
    setTodos(prev => ({
      ...prev,
      [who]: prev[who].map(t => t.id === id ? { ...t, done: !t.done } : t)
    }))
  }

  function remove(id) {
    setTodos(prev => ({ ...prev, [who]: prev[who].filter(t => t.id !== id) }))
  }

  function add() {
    const val = input.trim(); if (!val) return
    setTodos(prev => ({
      ...prev,
      [who]: [...prev[who], { id: Date.now(), label: val, done: false }]
    }))
    setInput('')
  }

  function markProcessDone(id) {
    setProcesses(prev => prev.map(p =>
      p.id === id ? { ...p, lastDone: new Date().toISOString() } : p
    ))
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">To-do — {label}</div>
      </div>

      {/* Forfaldne processer øverst */}
      {dueProcesses.map(p => (
        <div
          key={`proc-${p.id}`}
          className="todo-row"
          onClick={() => markProcessDone(p.id)}
          style={{ background: 'var(--rc-glod-bg)', borderLeft: '3px solid var(--rc-glod-text)' }}
        >
          <div className="todo-row__cb" style={{ borderColor: 'var(--rc-glod-text)', color: 'var(--rc-glod-text)' }}>
            {REPEAT_SVG}
          </div>
          <span className="todo-row__label" style={{ color: 'var(--rc-glod-text)' }}>{p.label}</span>
          <span style={{ fontSize: 10, color: 'var(--rc-glod-text)', opacity: 0.7, marginRight: 4 }}>{p.freq}</span>
          <Badge owner={p.owner} />
        </div>
      ))}

      {/* Normale to-do items */}
      {items.map(t => (
        <div key={t.id} className={`todo-row${t.done ? ' done' : ''}`} onClick={() => toggle(t.id)}>
          <div className="todo-row__cb">{t.done && CHECK_SVG}</div>
          <span className="todo-row__label">{t.label}</span>
          <Badge owner={ownerName} />
          <button className="todo-row__del" onClick={e => { e.stopPropagation(); remove(t.id) }}>×</button>
        </div>
      ))}

      <div className="add-bar">
        <input
          className="add-bar__input"
          placeholder={`Tilføj til ${label.toLowerCase()}s liste…`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="add-bar__btn" onClick={add}>+</button>
      </div>
    </div>
  )
}

export default function Overblik({ todos, setTodos, processes, setProcesses }) {
  const dueJakob   = processes.filter(p => isDue(p) && p.owner === 'Jakob')
  const dueCamilla = processes.filter(p => isDue(p) && p.owner === 'Camilla')
  const dueBegge   = processes.filter(p => isDue(p) && p.owner === 'Begge')

  return (
    <>
      {/* Fælles øverst */}
      <TodoList
        who="begge"
        items={todos.begge}
        dueProcesses={dueBegge}
        setTodos={setTodos}
        setProcesses={setProcesses}
      />

      {/* Jakob & Camilla side om side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <TodoList
          who="jakob"
          items={todos.jakob}
          dueProcesses={dueJakob}
          setTodos={setTodos}
          setProcesses={setProcesses}
        />
        <TodoList
          who="camilla"
          items={todos.camilla}
          dueProcesses={dueCamilla}
          setTodos={setTodos}
          setProcesses={setProcesses}
        />
      </div>
    </>
  )
}
