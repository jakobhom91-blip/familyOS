import { useState } from 'react'

const MONTH_NAMES = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december']

function OwnerDot({ owner }) {
  const color = owner === 'jakob' ? 'var(--jakob)' : owner === 'camilla' ? 'var(--camilla)' : 'var(--begge)'
  return <div className="agreement-chip__dot" style={{ background: color }} />
}

export default function Husmøde({ agreements, setAgreements, meetings, setMeetings }) {
  const [aftaleInput, setAftaleInput] = useState('')
  const [meetTitle, setMeetTitle] = useState('')
  const [meetNotes, setMeetNotes] = useState('')
  const [meetAftale, setMeetAftale] = useState('')
  const [pendingAftaler, setPendingAftaler] = useState([])

  function addAgreement() {
    const val = aftaleInput.trim(); if (!val) return
    setAgreements(prev => [...prev, { id: Date.now(), text: val, owner: 'begge' }])
    setAftaleInput('')
  }

  function removeAgreement(id) {
    setAgreements(prev => prev.filter(a => a.id !== id))
  }

  function addPending() {
    const val = meetAftale.trim(); if (!val) return
    setPendingAftaler(prev => [...prev, val])
    setMeetAftale('')
  }

  function saveMeeting() {
    if (!meetTitle.trim() && !meetNotes.trim()) return
    const allAftaler = meetAftale.trim()
      ? [...pendingAftaler, meetAftale.trim()]
      : pendingAftaler
    const d = new Date()
    setMeetings(prev => [{
      id: Date.now(),
      title: meetTitle || 'Husmøde',
      date: `${MONTH_NAMES[d.getMonth()].charAt(0).toUpperCase() + MONTH_NAMES[d.getMonth()].slice(1)} ${d.getFullYear()}`,
      notes: meetNotes,
      aftaler: allAftaler.map((t, i) => ({ id: i + 1, text: t })),
    }, ...prev])
    setMeetTitle(''); setMeetNotes(''); setMeetAftale(''); setPendingAftaler([])
  }

  function promoteAftale(text) {
    setAgreements(prev => [...prev, { id: Date.now(), text, owner: 'begge' }])
  }

  return (
    <>
      {/* Aktive aftaler */}
      <div className="section">
        <div className="agreements-block">
          <div className="agreements-title">Aktive aftaler</div>
          <div className="agreements-list">
            {agreements.map(a => (
              <div key={a.id} className="agreement-chip">
                <OwnerDot owner={a.owner} />
                <span className="agreement-chip__text">{a.text}</span>
                <span className="agreement-chip__who">
                  {a.owner === 'jakob' ? 'Jakob' : a.owner === 'camilla' ? 'Camilla' : 'Begge'}
                </span>
                <button className="agreement-chip__del" onClick={() => removeAgreement(a.id)}>×</button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <input className="add-bar__input" style={{ fontSize: 12, padding: '5px 9px' }}
              placeholder="Tilføj ny aftale…" value={aftaleInput}
              onChange={e => setAftaleInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addAgreement()} />
            <button className="add-bar__btn" style={{ fontSize: 11, padding: '5px 12px' }} onClick={addAgreement}>Tilføj</button>
          </div>
        </div>
      </div>

      {/* Mødelogbog */}
      <div className="section">
        <div className="section__header">
          <div className="section__title">Mødelogbog</div>
        </div>

        {meetings.map(m => (
          <div key={m.id} className="meeting-entry">
            <div className="meeting-entry__date">
              <span>{m.date}</span>
              <span style={{ color: 'var(--turkis)', fontSize: 10 }}>Hele familien</span>
            </div>
            <div className="meeting-entry__title">{m.title}</div>
            <div className="meeting-entry__notes">{m.notes}</div>
            {m.aftaler && m.aftaler.length > 0 && (
              <div className="meeting-entry__aftaler">
                {m.aftaler.map(a => (
                  <div key={a.id} className="meeting-entry__aftale">
                    <span>→</span>
                    <span>{a.text}</span>
                    <button className="meeting-entry__promote" onClick={() => promoteAftale(a.text)}>
                      + aktiv aftale
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Nyt møde formular */}
        <div className="new-meeting">
          <div className="new-meeting__label">Nyt husmøde</div>
          <input className="new-meeting__input" style={{ height: 36 }}
            placeholder="Titel, fx 'Husmøde #4 — april 2026'"
            value={meetTitle} onChange={e => setMeetTitle(e.target.value)} />
          <textarea className="new-meeting__input" rows={3}
            placeholder="Noter fra mødet…"
            value={meetNotes} onChange={e => setMeetNotes(e.target.value)} />
          <input className="new-meeting__input" style={{ height: 36 }}
            placeholder={pendingAftaler.length > 0 ? `${pendingAftaler.length} aftale(r) klar — tilføj flere` : 'Aftale (tilføj én ad gangen)'}
            value={meetAftale}
            onChange={e => setMeetAftale(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addPending()} />
          <div className="new-meeting__actions">
            <button className="new-meeting__btn new-meeting__btn--secondary" onClick={addPending}>+ Aftale</button>
            <button className="new-meeting__btn" style={{ marginLeft: 'auto' }} onClick={saveMeeting}>Gem møde</button>
          </div>
        </div>
      </div>
    </>
  )
}
