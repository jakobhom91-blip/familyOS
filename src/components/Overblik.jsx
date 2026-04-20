import { useState } from 'react'

const CHECK_SVG = (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="checkmark">
    <path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function Badge({ owner }) {
  const cls = owner === 'Jakob' ? 'jakob' : owner === 'Camilla' ? 'camilla' : 'begge'
  return (
    <span className={`badge badge--${cls}`} style={{fontSize:10,marginLeft:4}}>
      <span className="badge__dot" />{owner}
    </span>
  )
}

function TodoList({ who, items, setTodos }) {
  const [input, setInput] = useState('')
  const label = who === 'jakob' ? 'Jakob' : who === 'camilla' ? 'Camilla' : 'Fælles'
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

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">To-do — {label}</div>
      </div>
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

export default function Overblik({ todos, setTodos }) {
  return (
    <>
      {/* Fælles øverst */}
      <TodoList who="begge"   items={todos.begge}   setTodos={setTodos} />

      {/* Jakob & Camilla side om side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <TodoList who="jakob"   items={todos.jakob}   setTodos={setTodos} />
        <TodoList who="camilla" items={todos.camilla} setTodos={setTodos} />
      </div>
    </>
  )
}
