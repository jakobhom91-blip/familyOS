import { useState } from 'react'

// ---- Konstanter ----
const DAYS      = ['man','tir','ons','tor','fre','lor','son']
const DAY_NAMES = ['Man','Tir','Ons','Tor','Fre','Lør','Søn']
const MONTH_NAMES = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december']
const RESPONSIBLE_OPTIONS = ['Jakob','Camilla','Arthur','Ingen']
const OWNER_OPTIONS = ['jakob','camilla','begge']
const now = new Date()

// ---- Hjælpefunktioner ----
function getMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

function weekKey(year, week, recId, day) {
  return `${year}-W${week}-${recId}-${day}`
}

function formatDate(date) {
  return `${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}`
}

// ---- Event Modal (ansvarlig + slet for enkelt events) ----
function EventModal({ event, dayLabel, onClose, onSetResponsible, onDelete, isRecurring }) {
  const [responsible, setResponsible] = useState(event.responsible || 'Ingen')

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <div>
          <div className="event-modal__title">{event.label}</div>
          <div className="event-modal__meta">{dayLabel}{event.time ? ` · ${event.time}` : ''}</div>
        </div>

        <div>
          <div className="event-modal__label">Ansvarlig</div>
          <div className="event-modal__options">
            {RESPONSIBLE_OPTIONS.map(opt => (
              <button
                key={opt}
                style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all .15s',
                  border: '1.5px solid',
                  background: responsible === opt ? 'var(--deep-petrol)' : '#fff',
                  color: responsible === opt ? '#fff' : 'var(--koksgraa)',
                  borderColor: responsible === opt ? 'var(--deep-petrol)' : 'var(--border)',
                }}
                onClick={() => setResponsible(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="event-modal__actions">
          <button
            style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--deep-petrol)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            onClick={() => { onSetResponsible(responsible); onClose() }}
          >
            Gem
          </button>
          <button
            style={{ padding: '8px 14px', borderRadius: 8, background: '#fff', color: 'var(--muted)', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            onClick={onClose}
          >
            Luk
          </button>
          {!isRecurring && onDelete && (
            <button
              style={{ padding: '8px 14px', borderRadius: 8, background: '#fff', color: 'var(--ember)', border: '1px solid var(--ember)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginLeft: 'auto' }}
              onClick={() => { onDelete(); onClose() }}
            >
              Slet
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Tilføj event modal ----
function AddEventModal({ dayLabel, onAdd, onClose }) {
  const [label,  setLabel]  = useState('')
  const [time,   setTime]   = useState('')
  const [owner,  setOwner]  = useState('begge')

  function handleAdd() {
    if (!label.trim()) return
    onAdd({ label: label.trim(), time, owner })
    onClose()
  }

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <div className="event-modal__title">Tilføj — {dayLabel}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div className="event-modal__label">Hvad</div>
            <input
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              value={label}
              onChange={e => setLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="fx Tandlæge Carl"
              autoFocus
            />
          </div>
          <div>
            <div className="event-modal__label">Tidspunkt</div>
            <input
              style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }}
              value={time}
              onChange={e => setTime(e.target.value)}
              placeholder="fx 14:30"
            />
          </div>
          <div>
            <div className="event-modal__label">Hvem</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {OWNER_OPTIONS.map(o => (
                <button
                  key={o}
                  style={{
                    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid', fontFamily: 'DM Sans, sans-serif',
                    background: owner === o ? 'var(--deep-petrol)' : '#fff',
                    color: owner === o ? '#fff' : 'var(--koksgraa)',
                    borderColor: owner === o ? 'var(--deep-petrol)' : 'var(--border)',
                  }}
                  onClick={() => setOwner(o)}
                >
                  {o === 'jakob' ? 'Jakob' : o === 'camilla' ? 'Camilla' : 'Begge'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="event-modal__actions">
          <button
            style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--deep-petrol)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            onClick={handleAdd}
            disabled={!label.trim()}
          >
            Tilføj
          </button>
          <button
            style={{ padding: '8px 14px', borderRadius: 8, background: '#fff', color: 'var(--muted)', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
            onClick={onClose}
          >
            Annuller
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Recurrency Manager ----
const FREQ_LABELS = { man: 'Man', tir: 'Tir', ons: 'Ons', tor: 'Tor', fre: 'Fre', lor: 'Lør', son: 'Søn' }

function RecurrencyForm({ initial, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(initial)
  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function toggleDay(day) {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day]
    }))
  }

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={lbl}>Navn</label>
        <input style={inp} value={form.label} onChange={e => set('label', e.target.value)} placeholder="fx Carl — basket" autoFocus />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={lbl}>Tidspunkt</label>
          <input style={inp} value={form.time} onChange={e => set('time', e.target.value)} placeholder="16:00" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={lbl}>Ansvarlig som standard</label>
          <select style={{ ...inp, cursor: 'pointer' }} value={form.owner} onChange={e => set('owner', e.target.value)}>
            <option value="jakob">Jakob</option>
            <option value="camilla">Camilla</option>
            <option value="begge">Begge</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={lbl}>Hvilke dage</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              style={{
                padding: '5px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid', fontFamily: 'DM Sans, sans-serif',
                background: form.days.includes(day) ? 'var(--sacred-forest)' : '#fff',
                color: form.days.includes(day) ? '#fff' : 'var(--koksgraa)',
                borderColor: form.days.includes(day) ? 'var(--sacred-forest)' : 'var(--border)',
              }}
            >
              {FREQ_LABELS[day]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnSave} onClick={() => form.label.trim() && form.days.length > 0 && onSave(form)} disabled={!form.label.trim() || form.days.length === 0}>Gem</button>
        <button style={btnCancel} onClick={onCancel}>Annuller</button>
        {onDelete && <button style={btnDelete} onClick={onDelete}>Slet</button>}
      </div>
    </div>
  )
}

function RecurrencyManager({ recurrencies, setRecurrencies }) {
  const [editingId, setEditingId] = useState(null)
  const [showNew,   setShowNew]   = useState(false)

  function save(id, form) {
    setRecurrencies(prev => prev.map(r => r.id === id ? { ...r, ...form } : r))
    setEditingId(null)
  }

  function add(form) {
    setRecurrencies(prev => [...prev, { ...form, id: Date.now() }])
    setShowNew(false)
  }

  function remove(id) {
    setRecurrencies(prev => prev.filter(r => r.id !== id))
    setEditingId(null)
  }

  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--deep-petrol)' }}>Tilbagevendende aktiviteter</span>
        <button className="section__add-btn" onClick={() => { setShowNew(true); setEditingId(null) }}>+</button>
      </div>

      {recurrencies.map(r => (
        <div key={r.id}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#fff', borderRadius: 10, border: '1px solid var(--border)', cursor: 'pointer' }}
            onClick={() => { setEditingId(editingId === r.id ? null : r.id); setShowNew(false) }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: 'var(--koksgraa)' }}>↻ {r.label}</span>
            {r.time && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.time}</span>}
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.days.map(d => FREQ_LABELS[d]).join(', ')}</span>
            <span style={{ fontSize: 11, opacity: .5 }}>✎</span>
          </div>
          {editingId === r.id && (
            <div style={{ marginTop: 6 }}>
              <RecurrencyForm
                initial={{ label: r.label, time: r.time, owner: r.owner, days: [...r.days] }}
                onSave={form => save(r.id, form)}
                onDelete={() => remove(r.id)}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}
        </div>
      ))}

      {showNew && (
        <RecurrencyForm
          initial={{ label: '', time: '', owner: 'jakob', days: [] }}
          onSave={add}
          onCancel={() => setShowNew(false)}
        />
      )}
    </div>
  )
}

// ---- Week View ----
function WeekView({ weekEvents, setWeekEvents, recurrencies, weekOverrides, setWeekOverrides }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [modal,      setModal]      = useState(null) // { type: 'event'|'add', ... }

  // Beregn ugens datoer
  const monday = getMonday(new Date())
  monday.setDate(monday.getDate() + weekOffset * 7)
  const weekDates = DAYS.map((_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
  const weekNum  = getWeekNumber(monday)
  const weekYear = monday.getFullYear()

  function getOverrideKey(recId, dayKey) {
    return weekKey(weekYear, weekNum, recId, dayKey)
  }

  function setResponsible(key, responsible) {
    setWeekOverrides(prev => ({ ...prev, [key]: { ...prev[key], responsible } }))
  }

  function getOrderKey(dayKey) {
    return `${weekYear}-W${weekNum}-order-${dayKey}`
  }

  function getOrderedItems(dayKey, dayRecurrencies, dayEvents) {
    const orderKey = getOrderKey(dayKey)
    const savedOrder = weekOverrides[orderKey]?.order
    const recItems  = dayRecurrencies.map(r => ({ kind: 'rec', id: `rec-${r.id}`, data: r }))
    const evtItems  = dayEvents.map(e => ({ kind: 'evt', id: `evt-${e.id}`, data: e }))
    const all       = [...recItems, ...evtItems]
    if (!savedOrder) return all
    const map = Object.fromEntries(all.map(i => [i.id, i]))
    const ordered = savedOrder.map(id => map[id]).filter(Boolean)
    const rest = all.filter(i => !savedOrder.includes(i.id))
    return [...ordered, ...rest]
  }

  function moveItem(dayKey, items, fromIdx, toIdx) {
    if (toIdx < 0 || toIdx >= items.length) return
    const newOrder = items.map(i => i.id)
    const [moved] = newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, moved)
    const orderKey = getOrderKey(dayKey)
    setWeekOverrides(prev => ({ ...prev, [orderKey]: { ...prev[orderKey], order: newOrder } }))
  }

  function addEvent(dayDate, eventData) {
    const dateStr = `${dayDate.getFullYear()}-${dayDate.getMonth() + 1}-${dayDate.getDate()}`
    setWeekEvents(prev => [...prev, { id: Date.now(), date: dateStr, ...eventData }])
  }

  function deleteEvent(id) {
    setWeekEvents(prev => prev.filter(e => e.id !== id))
  }

  // Nav title
  const startLabel = `${monday.getDate()}. ${MONTH_NAMES[monday.getMonth()]}`
  const endDate    = weekDates[6]
  const endLabel   = `${endDate.getDate()}. ${MONTH_NAMES[endDate.getMonth()]} ${endDate.getFullYear()}`

  return (
    <>
      {/* Navigation */}
      <div className="week-nav">
        <button className="week-nav__btn" onClick={() => setWeekOffset(o => o - 1)}>← Forrige</button>
        <div className="week-nav__title">Uge {weekNum} · {startLabel} – {endLabel}</div>
        <button className="week-nav__btn" onClick={() => setWeekOffset(o => o + 1)}>Næste →</button>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--jakob)' }}/> Jakob</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--camilla)' }}/> Camilla</div>
        <div className="legend__item"><div className="legend__dot" style={{ background: 'var(--begge)' }}/> Begge</div>
        <div className="legend__item" style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--muted)' }}>↻ = Tilbagevendende</div>
      </div>

      {/* Uge-grid */}
      <div className="week-grid">
        {DAYS.map((dayKey, idx) => {
          const date    = weekDates[idx]
          const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          const isToday = date.toDateString() === now.toDateString()

          return (
            <div key={dayKey} className="week-col">
              <div className="week-col__head">
                <div className="week-col__day">{DAY_NAMES[idx]}</div>
                <div className={`week-col__date${isToday ? ' week-col__date--today' : ''}`}>
                  {date.getDate()}
                </div>
              </div>

              <div className="week-col__body">
                {(() => {
                  const dayRecurrencies = recurrencies.filter(r => r.days.includes(dayKey))
                  const dayEvents = weekEvents.filter(e => e.date === dateStr)
                  const items = getOrderedItems(dayKey, dayRecurrencies, dayEvents)

                  return items.map((item, itemIdx) => {
                    const isRec = item.kind === 'rec'
                    const rec   = isRec ? item.data : null
                    const ev    = isRec ? null : item.data
                    const ovKey = isRec ? getOverrideKey(rec.id, dayKey) : null
                    const override    = isRec ? weekOverrides[ovKey] : null
                    const responsible = isRec
                      ? (override?.responsible || null)
                      : (ev.responsible || null)
                    const ownerCls = isRec
                      ? `week-event--${rec.owner} week-event--recurring`
                      : `week-event--${ev.owner}`

                    return (
                      <div key={item.id} style={{ position: 'relative' }} className="week-event-wrap">
                        <div
                          className={`week-event ${ownerCls}`}
                          onClick={() => {
                            if (isRec) {
                              setModal({ type: 'event', event: { ...rec, responsible }, ovKey, isRecurring: true, dayLabel: `${DAY_NAMES[idx]} ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}` })
                            } else {
                              setModal({ type: 'event', event: { ...ev, responsible: ev.responsible || 'Ingen' }, isRecurring: false, eventId: ev.id, dayLabel: `${DAY_NAMES[idx]} ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}` })
                            }
                          }}
                          style={{ paddingRight: 20 }}
                        >
                          <div className="week-event__label">{isRec ? `↻ ${rec.label}` : ev.label}</div>
                          {(isRec ? rec.time : ev.time) && (
                            <div className="week-event__time">{isRec ? rec.time : ev.time}</div>
                          )}
                          {responsible && responsible !== 'Ingen' && (
                            <div className="week-event__responsible">→ {responsible}</div>
                          )}
                        </div>
                        {/* Pile-knapper */}
                        <div style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {itemIdx > 0 && (
                            <button
                              style={arrowBtn}
                              onClick={e => { e.stopPropagation(); moveItem(dayKey, items, itemIdx, itemIdx - 1) }}
                              title="Flyt op"
                            >▲</button>
                          )}
                          {itemIdx < items.length - 1 && (
                            <button
                              style={arrowBtn}
                              onClick={e => { e.stopPropagation(); moveItem(dayKey, items, itemIdx, itemIdx + 1) }}
                              title="Flyt ned"
                            >▼</button>
                          )}
                        </div>
                      </div>
                    )
                  })
                })()}

                {/* Tilføj knap */}
                <button
                  className="week-add-btn"
                  onClick={() => setModal({ type: 'add', date, dayLabel: `${DAY_NAMES[idx]} ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]}` })}
                  title={`Tilføj til ${DAY_NAMES[idx]}`}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {modal?.type === 'event' && (
        <EventModal
          event={modal.event}
          dayLabel={modal.dayLabel}
          isRecurring={modal.isRecurring}
          onClose={() => setModal(null)}
          onSetResponsible={responsible => {
            if (modal.isRecurring) {
              setResponsible(modal.ovKey, responsible)
            } else {
              setWeekEvents(prev => prev.map(e => e.id === modal.eventId ? { ...e, responsible } : e))
            }
          }}
          onDelete={modal.isRecurring ? null : () => deleteEvent(modal.eventId)}
        />
      )}
      {modal?.type === 'add' && (
        <AddEventModal
          dayLabel={modal.dayLabel}
          onAdd={data => addEvent(modal.date, data)}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}

// ---- Month View (uændret) ----
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

// ---- Kalender root ----
export function Kalender({ weekEvents, setWeekEvents, monthEvents, setMonthEvents, recurrencies, setRecurrencies, weekOverrides, setWeekOverrides }) {
  const [calTab, setCalTab] = useState('uge')

  return (
    <div className="section">
      <div className="section-tabs">
        <button className={`section-tab${calTab === 'uge'         ? ' active' : ''}`} onClick={() => setCalTab('uge')}>Uge</button>
        <button className={`section-tab${calTab === 'maaned'      ? ' active' : ''}`} onClick={() => setCalTab('maaned')}>Måned</button>
        <button className={`section-tab${calTab === 'tilbageven'  ? ' active' : ''}`} onClick={() => setCalTab('tilbageven')}>Tilbagevendende</button>
      </div>

      {calTab === 'uge' && (
        <WeekView
          weekEvents={weekEvents}
          setWeekEvents={setWeekEvents}
          recurrencies={recurrencies}
          weekOverrides={weekOverrides}
          setWeekOverrides={setWeekOverrides}
        />
      )}
      {calTab === 'maaned' && (
        <MonthView monthEvents={monthEvents} setMonthEvents={setMonthEvents} />
      )}
      {calTab === 'tilbageven' && (
        <RecurrencyManager recurrencies={recurrencies} setRecurrencies={setRecurrencies} />
      )}
    </div>
  )
}

export default Kalender

// ---- Delte styles ----
const lbl = { fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em' }
const inp = { padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', color: 'var(--koksgraa)', width: '100%', boxSizing: 'border-box' }
const btnSave   = { padding: '7px 18px', borderRadius: 8, background: 'var(--deep-petrol)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }
const btnCancel = { padding: '7px 14px', borderRadius: 8, background: '#fff', color: 'var(--muted)', border: '1px solid var(--border)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }
const btnDelete = { padding: '7px 14px', borderRadius: 8, background: '#fff', color: 'var(--ember)', border: '1px solid var(--ember)', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginLeft: 'auto' }
const arrowBtn  = { background: 'rgba(0,0,0,0.12)', border: 'none', borderRadius: 3, cursor: 'pointer', color: '#fff', fontSize: 8, padding: '1px 3px', lineHeight: 1, display: 'block' }
