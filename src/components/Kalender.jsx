// ============================================================
// Kalender.jsx
// ============================================================
import { useState } from 'react'

const MONTH_NAMES = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december']
const now = new Date()

function CalEvent({ event }) {
  const cls = `cal-event cal-event--${event.owner}`
  return (
    <div className={cls}>
      <span className="cal-event__label">{event.label}</span>
      {event.time && <span className="cal-event__time">{event.time}</span>}
    </div>
  )
}

function WeekView({ weekEvents, setWeekEvents }) {
  const [input, setInput] = useState('')
  const days = ['Man','Tir','Ons','Tor','Fre','Lør','Søn']
  const grouped = {}
  days.forEach(d => { grouped[d] = weekEvents.filter(e => e.day === d) })

  function add() {
    const val = input.trim(); if (!val) return
    setWeekEvents(prev => [...prev, { id: Date.now(), day: '—', date: null, label: val, time: '', owner: 'begge' }])
    setInput('')
  }

  return (
    <>
      <div className="legend">
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--jakob)' }}/> Jakob</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--camilla)' }}/> Camilla</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--begge)' }}/> Begge</div>
      </div>
      {days.map(day => {
        const events = grouped[day] || []
        const dateNum = weekEvents.find(e => e.day === day)?.date
        return (
          <div key={day} className="cal-row">
            <div className="cal-date">
              <div className="cal-date__name">{day}</div>
              <div className={`cal-date__num${dateNum === now.getDate() ? ' today' : ''}`}>
                {dateNum || '—'}
              </div>
            </div>
            <div className="cal-events">
              {events.length === 0
                ? <div style={{ fontSize: 11, color: 'var(--muted)', padding: '4px 0' }}>Ingen aftaler</div>
                : events.map(e => <CalEvent key={e.id} event={e} />)
              }
            </div>
          </div>
        )
      })}
      <div className="add-bar">
        <input className="add-bar__input" placeholder="Begivenhed, dag, tid…" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="add-bar__btn" onClick={add}>Tilføj</button>
      </div>
    </>
  )
}

function MonthView({ monthEvents, setMonthEvents }) {
  const [vy, setVy] = useState(now.getFullYear())
  const [vm, setVm] = useState(now.getMonth())
  const [input, setInput] = useState('')

  function changeMonth(dir) {
    let m = vm + dir, y = vy
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setVm(m); setVy(y)
  }

  function addEvent() {
    const val = input.trim(); if (!val) return
    const parts = val.split(' '), day = parseInt(parts[0])
    if (isNaN(day)) return
    const key = `${vy}-${vm + 1}-${day}`
    setMonthEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), { label: parts.slice(1).join(' '), owner: 'begge' }] }))
    setInput('')
  }

  const first = new Date(vy, vm, 1)
  let startDay = first.getDay(); startDay = startDay === 0 ? 6 : startDay - 1
  const dim = new Date(vy, vm + 1, 0).getDate()
  const dip = new Date(vy, vm, 0).getDate()
  let cells = []
  for (let i = startDay - 1; i >= 0; i--) cells.push({ day: dip - i, other: true })
  for (let i = 1; i <= dim; i++) cells.push({ day: i, other: false })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - dim - startDay + 1, other: true })

  return (
    <>
      <div className="month-nav">
        <button className="month-nav__btn" onClick={() => changeMonth(-1)}>← Forrige</button>
        <div className="month-nav__title">{MONTH_NAMES[vm]} {vy}</div>
        <button className="month-nav__btn" onClick={() => changeMonth(1)}>Næste →</button>
      </div>
      <div className="legend">
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--jakob)' }}/> Jakob</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--camilla)' }}/> Camilla</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--begge)' }}/> Begge</div>
      </div>
      <div className="month-grid">
        {['Man','Tir','Ons','Tor','Fre','Lør','Søn'].map(d => (
          <div key={d} className="month-grid__head">{d}</div>
        ))}
        {cells.map((c, i) => {
          const isToday = !c.other && c.day === now.getDate() && vm === now.getMonth() && vy === now.getFullYear()
          const key = `${vy}-${vm + 1}-${c.day}`
          const events = (!c.other && monthEvents[key]) || []
          return (
            <div key={i} className={`month-grid__day${c.other ? ' month-grid__day--other' : ''}${isToday ? ' month-grid__day--today' : ''}`}>
              <div className="month-grid__day-num">{c.day}</div>
              {events.map((e, j) => (
                <div key={j} className={`month-event month-event--${e.owner}`}>{e.label}</div>
              ))}
            </div>
          )
        })}
      </div>
      <div className="add-bar">
        <input className="add-bar__input" placeholder="fx '28 Arthur — turnering'" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEvent()} />
        <button className="add-bar__btn" onClick={addEvent}>Tilføj</button>
      </div>
    </>
  )
}

export function Kalender({ weekEvents, setWeekEvents, monthEvents, setMonthEvents }) {
  const [calTab, setCalTab] = useState('uge')
  return (
    <div className="section">
      <div className="section-tabs">
        <button className={`section-tab${calTab === 'uge' ? ' active' : ''}`} onClick={() => setCalTab('uge')}>Uge</button>
        <button className={`section-tab${calTab === 'maaned' ? ' active' : ''}`} onClick={() => setCalTab('maaned')}>Måned</button>
      </div>
      {calTab === 'uge'    && <WeekView  weekEvents={weekEvents}   setWeekEvents={setWeekEvents} />}
      {calTab === 'maaned' && <MonthView monthEvents={monthEvents} setMonthEvents={setMonthEvents} />}
    </div>
  )
}
export default Kalender


// ============================================================
// NOTE: The remaining components are in separate files below.
// This file exports Kalender only. Copy the others to their own files.
// ============================================================
