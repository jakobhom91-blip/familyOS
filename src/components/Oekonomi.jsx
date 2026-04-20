import { useState } from 'react'

export default function Oekonomi({ budgetTotal, setBudgetTotal, budgetPosts, setBudgetPosts }) {
  const [input, setInput] = useState('')
  const spent = budgetPosts.reduce((s, p) => s + p.amount, 0)
  const rest = budgetTotal - spent
  const pct = Math.min((spent / budgetTotal) * 100, 100)

  function editPost(id) {
    const post = budgetPosts.find(p => p.id === id)
    const val = window.prompt(`Ret beløb for "${post.label}":`, post.amount)
    if (val === null) return
    const num = parseInt(val.replace(/\D/g, ''))
    if (!isNaN(num)) setBudgetPosts(prev => prev.map(p => p.id === id ? { ...p, amount: num } : p))
  }

  function editTotal() {
    const val = window.prompt('Ret månedlig indbetaling:', budgetTotal)
    if (val === null) return
    const num = parseInt(val.replace(/\D/g, ''))
    if (!isNaN(num)) setBudgetTotal(num)
  }

  function addPost() {
    const val = input.trim(); if (!val) return
    const parts = val.split('—').map(s => s.trim())
    const colors = ['#F05A28', '#FBE8BE', '#7A7060', '#5DD3C0', '#013138', '#2F5D50']
    setBudgetPosts(prev => [...prev, {
      id: Date.now(),
      label: parts[0],
      amount: parseInt((parts[1] || '0').replace(/\D/g, '')) || 0,
      color: colors[prev.length % colors.length],
    }])
    setInput('')
  }

  function removePost(id) {
    setBudgetPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="section">
      <div className="budget-summary">
        <div>
          <div className="budget-summary__label">Fælleskonto — månedligt ind</div>
          <div className="budget-summary__amount" style={{ cursor: 'pointer' }} onClick={editTotal}>
            {budgetTotal.toLocaleString('da-DK')} kr
          </div>
          <div className="budget-summary__sub">Klik for at redigere</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="budget-summary__label" style={{ textAlign: 'right' }}>Tilbage</div>
          <div className={`budget-summary__rest budget-summary__rest--${rest >= 0 ? 'positive' : 'negative'}`}>
            {rest.toLocaleString('da-DK')} kr
          </div>
          <div className="budget-summary__sub">efter faste poster</div>
        </div>
      </div>

      <div className="budget-bar-wrap">
        <div className="budget-bar-track">
          <div className={`budget-bar-fill${rest < 0 ? ' budget-bar-fill--over' : ''}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="budget-bar-labels">
          <span>0</span>
          <span>{(spent / 1000).toFixed(0)}k brugt</span>
          <span>{(budgetTotal / 1000).toFixed(0)}.000 kr</span>
        </div>
      </div>

      {budgetPosts.map(p => (
        <div key={p.id} className="budget-post">
          <div className="budget-post__dot" style={{ background: p.color }} />
          <div className="budget-post__label">{p.label}</div>
          <button className="budget-post__edit" onClick={() => editPost(p.id)}>ret</button>
          <button className="budget-post__edit" onClick={() => removePost(p.id)} style={{ color: 'var(--ember)' }}>slet</button>
          <div className="budget-post__amount">{p.amount.toLocaleString('da-DK')} kr</div>
          <div className="budget-post__pct">{Math.round((p.amount / budgetTotal) * 100)}%</div>
        </div>
      ))}

      <div className="add-bar">
        <input className="add-bar__input" placeholder="Post — fx 'Abonnementer — 500'" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPost()} />
        <button className="add-bar__btn" onClick={addPost}>Tilføj</button>
      </div>
    </div>
  )
}
