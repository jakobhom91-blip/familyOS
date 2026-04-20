import { useState } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'
import {
  DEFAULT_ROLES, DEFAULT_TODOS, DEFAULT_WEEK_EVENTS, DEFAULT_MONTH_EVENTS,
  DEFAULT_SHOPPING, DEFAULT_BUDGET_TOTAL, DEFAULT_BUDGET_POSTS,
  DEFAULT_PROCESSES, DEFAULT_AGREEMENTS, DEFAULT_MEETINGS,
  DEFAULT_LINKS, DEFAULT_CONTACTS,
} from '../data/defaults.js'

export default function FamilySetup({ user }) {
  const [mode, setMode]       = useState(null)   // 'opret' | 'tilslut'
  const [kode, setKode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [fejl, setFejl]       = useState('')

  // Generer familiekode ud fra brugerens fornavn + tilfældigt tal
  function genererKode() {
    const navn = (user.displayName || 'FAMILIE').split(' ')[0].toUpperCase().slice(0, 8)
    const tal  = Math.floor(1000 + Math.random() * 9000)
    return `${navn}-${tal}`
  }

  async function opretFamilie() {
    setLoading(true)
    setFejl('')
    try {
      const familyId = genererKode()

      // Opret familie-dokument med default data
      await setDoc(doc(db, 'families', familyId), {
        createdBy: user.uid,
        members: [user.uid],
        createdAt: new Date().toISOString(),
      })

      // Opret data-dokument med alle defaults
      await setDoc(doc(db, 'families', familyId, 'data', 'main'), {
        roles:       DEFAULT_ROLES,
        todos:       DEFAULT_TODOS,
        weekEvents:  DEFAULT_WEEK_EVENTS,
        monthEvents: DEFAULT_MONTH_EVENTS,
        shopping:    DEFAULT_SHOPPING,
        budgetTotal: DEFAULT_BUDGET_TOTAL,
        budgetPosts: DEFAULT_BUDGET_POSTS,
        processes:   DEFAULT_PROCESSES,
        agreements:  DEFAULT_AGREEMENTS,
        meetings:    DEFAULT_MEETINGS,
        links:       DEFAULT_LINKS,
        contacts:    DEFAULT_CONTACTS,
      })

      // Gem familyId på bruger-profilen
      await setDoc(doc(db, 'users', user.uid), {
        familyId,
        displayName: user.displayName,
        email: user.email,
        joinedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error(err)
      setFejl('Noget gik galt. Prøv igen.')
    }
    setLoading(false)
  }

  async function tilslutFamilie() {
    setLoading(true)
    setFejl('')
    try {
      const familyId = kode.trim().toUpperCase()
      const familySnap = await getDoc(doc(db, 'families', familyId))

      if (!familySnap.exists()) {
        setFejl('Familiekoden findes ikke. Tjek koden og prøv igen.')
        setLoading(false)
        return
      }

      // Tilføj bruger til familie
      const existing = familySnap.data().members || []
      await setDoc(doc(db, 'families', familyId), {
        members: [...new Set([...existing, user.uid])],
      }, { merge: true })

      // Gem familyId på bruger-profilen
      await setDoc(doc(db, 'users', user.uid), {
        familyId,
        displayName: user.displayName,
        email: user.email,
        joinedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error(err)
      setFejl('Noget gik galt. Prøv igen.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>👨‍👩‍👧‍👦</div>
        <h1 style={styles.title}>Velkommen, {user.displayName?.split(' ')[0]}</h1>
        <p style={styles.sub}>Opret en ny familie eller tilslut dig en eksisterende med en familiekode</p>

        {!mode && (
          <div style={styles.btnGroup}>
            <button style={styles.btnPrimary} onClick={() => setMode('opret')}>
              Opret ny familie
            </button>
            <button style={styles.btnSecondary} onClick={() => setMode('tilslut')}>
              Tilslut med kode
            </button>
          </div>
        )}

        {mode === 'opret' && (
          <div style={styles.section}>
            <p style={styles.info}>
              Vi opretter din familie og giver dig en unik kode.<br />
              Del koden med din partner så de kan tilslutte sig.
            </p>
            {fejl && <p style={styles.fejl}>{fejl}</p>}
            <button style={styles.btnPrimary} onClick={opretFamilie} disabled={loading}>
              {loading ? 'Opretter...' : 'Opret familie'}
            </button>
            <button style={styles.btnLink} onClick={() => { setMode(null); setFejl('') }}>
              Tilbage
            </button>
          </div>
        )}

        {mode === 'tilslut' && (
          <div style={styles.section}>
            <p style={styles.info}>Indtast familiekoden du har fået fra din partner</p>
            <input
              style={styles.input}
              placeholder="F.eks. JAKOB-4821"
              value={kode}
              onChange={e => setKode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && tilslutFamilie()}
            />
            {fejl && <p style={styles.fejl}>{fejl}</p>}
            <button
              style={styles.btnPrimary}
              onClick={tilslutFamilie}
              disabled={loading || !kode.trim()}
            >
              {loading ? 'Tilslutter...' : 'Tilslut familie'}
            </button>
            <button style={styles.btnLink} onClick={() => { setMode(null); setFejl(''); setKode('') }}>
              Tilbage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f3',
    padding: 24,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '48px 40px',
    maxWidth: 420,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 700, margin: '0 0 8px', color: '#1a1a1a' },
  sub: { fontSize: 15, color: '#666', margin: '0 0 32px', lineHeight: 1.5 },
  btnGroup: { display: 'flex', flexDirection: 'column', gap: 12 },
  btnPrimary: {
    width: '100%', padding: '12px 20px', fontSize: 15, fontWeight: 600,
    background: '#013138', color: '#fff', border: 'none',
    borderRadius: 8, cursor: 'pointer',
  },
  btnSecondary: {
    width: '100%', padding: '12px 20px', fontSize: 15, fontWeight: 600,
    background: '#fff', color: '#013138', border: '1.5px solid #013138',
    borderRadius: 8, cursor: 'pointer',
  },
  btnLink: {
    background: 'none', border: 'none', color: '#888',
    fontSize: 14, cursor: 'pointer', marginTop: 8, textDecoration: 'underline',
  },
  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  info: { fontSize: 14, color: '#666', lineHeight: 1.6, margin: 0 },
  input: {
    width: '100%', padding: '12px 14px', fontSize: 16, fontWeight: 600,
    border: '1.5px solid #ddd', borderRadius: 8, textAlign: 'center',
    letterSpacing: 2, boxSizing: 'border-box',
  },
  fejl: { color: '#c0392b', fontSize: 14, margin: 0 },
}
