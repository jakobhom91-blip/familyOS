import { useState, useEffect } from 'react'
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase.js'

import Domaener from './components/Domaener.jsx'
import Header from './components/Header.jsx'
import Nav from './components/Nav.jsx'
import Overblik from './components/Overblik.jsx'
import Kalender from './components/Kalender.jsx'
import Indkoeb from './components/Indkoeb.jsx'
import Oekonomi from './components/Oekonomi.jsx'
import Processer from './components/Processer.jsx'
import Husmøde from './components/Husmøde.jsx'
import Links from './components/Links.jsx'
import Kontakter from './components/Kontakter.jsx'
import LoginScreen from './components/LoginScreen.jsx'
import FamilySetup from './components/FamilySetup.jsx'

import {
  DEFAULT_ROLES, DEFAULT_TODOS, DEFAULT_WEEK_EVENTS, DEFAULT_MONTH_EVENTS,
  DEFAULT_SHOPPING, DEFAULT_BUDGET_TOTAL, DEFAULT_BUDGET_POSTS,
  DEFAULT_PROCESSES, DEFAULT_AGREEMENTS, DEFAULT_MEETINGS,
  DEFAULT_LINKS, DEFAULT_CONTACTS,
} from './data/defaults.js'

const TABS = ['Overblik','Domæner','Kalender','Indkøb','Økonomi','Processer','Husmøde','Links','Kontakter']

// Debounce hjælper — undgår at skrive til Firestore på hvert enkelt tastetryk
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function App() {
  // --- Auth state ---
  const [user,      setUser]      = useState(undefined)  // undefined = loading, null = ikke logget ind
  const [familyId,  setFamilyId]  = useState(null)
  const [dataReady, setDataReady] = useState(false)

  // --- App state ---
  const [tab,         setTab]         = useState('Overblik')
  const [roles,       setRoles]       = useState(DEFAULT_ROLES)
  const [todos,       setTodos]       = useState(DEFAULT_TODOS)
  const [weekEvents,  setWeekEvents]  = useState(DEFAULT_WEEK_EVENTS)
  const [monthEvents, setMonthEvents] = useState(DEFAULT_MONTH_EVENTS)
  const [shopping,    setShopping]    = useState(DEFAULT_SHOPPING)
  const [budgetTotal, setBudgetTotal] = useState(DEFAULT_BUDGET_TOTAL)
  const [budgetPosts, setBudgetPosts] = useState(DEFAULT_BUDGET_POSTS)
  const [processes,   setProcesses]   = useState(DEFAULT_PROCESSES)
  const [agreements,  setAgreements]  = useState(DEFAULT_AGREEMENTS)
  const [meetings,    setMeetings]    = useState(DEFAULT_MEETINGS)
  const [links,       setLinks]       = useState(DEFAULT_LINKS)
  const [contacts,    setContacts]    = useState(DEFAULT_CONTACTS)

  // --- 1. Håndter redirect-resultat + lyt på auth-tilstand ---
  useEffect(() => {
    // Håndter redirect-login resultat (kører én gang ved page load)
    getRedirectResult(auth).catch(err => console.error('Redirect result fejl:', err))

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setFamilyId(null)
        setDataReady(false)
        return
      }
      setUser(firebaseUser)

      // Tjek om bruger har en familie
      const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userSnap.exists() && userSnap.data().familyId) {
        setFamilyId(userSnap.data().familyId)
      } else {
        setFamilyId(null)
        setDataReady(false)
      }
    })
    return unsub
  }, [])

  // --- 2. Lyt på Firestore data når familyId er klar ---
  useEffect(() => {
    if (!familyId) return
    const ref = doc(db, 'families', familyId, 'data', 'main')
    const unsub = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return
      const d = snap.data()
      setRoles(d.roles             ?? DEFAULT_ROLES)
      setTodos(d.todos             ?? DEFAULT_TODOS)
      setWeekEvents(d.weekEvents   ?? DEFAULT_WEEK_EVENTS)
      setMonthEvents(d.monthEvents ?? DEFAULT_MONTH_EVENTS)
      setShopping(d.shopping       ?? DEFAULT_SHOPPING)
      setBudgetTotal(d.budgetTotal ?? DEFAULT_BUDGET_TOTAL)
      setBudgetPosts(d.budgetPosts ?? DEFAULT_BUDGET_POSTS)
      setProcesses(d.processes     ?? DEFAULT_PROCESSES)
      setAgreements(d.agreements   ?? DEFAULT_AGREEMENTS)
      setMeetings(d.meetings       ?? DEFAULT_MEETINGS)
      setLinks(d.links             ?? DEFAULT_LINKS)
      setContacts(d.contacts       ?? DEFAULT_CONTACTS)
      setDataReady(true)
    })
    return unsub
  }, [familyId])

  // --- 3. Skriv til Firestore ved ændringer (debounced 800ms) ---
  const dRoles       = useDebounce(roles,       800)
  const dTodos       = useDebounce(todos,       800)
  const dWeekEvents  = useDebounce(weekEvents,  800)
  const dMonthEvents = useDebounce(monthEvents, 800)
  const dShopping    = useDebounce(shopping,    800)
  const dBudgetTotal = useDebounce(budgetTotal, 800)
  const dBudgetPosts = useDebounce(budgetPosts, 800)
  const dProcesses   = useDebounce(processes,   800)
  const dAgreements  = useDebounce(agreements,  800)
  const dMeetings    = useDebounce(meetings,    800)
  const dLinks       = useDebounce(links,       800)
  const dContacts    = useDebounce(contacts,    800)

  function saveToFirestore(patch) {
    if (!familyId || !dataReady) return
    setDoc(doc(db, 'families', familyId, 'data', 'main'), patch, { merge: true })
      .catch(err => console.error('Firestore write fejl:', err))
  }

  useEffect(() => { saveToFirestore({ roles:       dRoles       }) }, [dRoles])
  useEffect(() => { saveToFirestore({ todos:       dTodos       }) }, [dTodos])
  useEffect(() => { saveToFirestore({ weekEvents:  dWeekEvents  }) }, [dWeekEvents])
  useEffect(() => { saveToFirestore({ monthEvents: dMonthEvents }) }, [dMonthEvents])
  useEffect(() => { saveToFirestore({ shopping:    dShopping    }) }, [dShopping])
  useEffect(() => { saveToFirestore({ budgetTotal: dBudgetTotal }) }, [dBudgetTotal])
  useEffect(() => { saveToFirestore({ budgetPosts: dBudgetPosts }) }, [dBudgetPosts])
  useEffect(() => { saveToFirestore({ processes:   dProcesses   }) }, [dProcesses])
  useEffect(() => { saveToFirestore({ agreements:  dAgreements  }) }, [dAgreements])
  useEffect(() => { saveToFirestore({ meetings:    dMeetings    }) }, [dMeetings])
  useEffect(() => { saveToFirestore({ links:       dLinks       }) }, [dLinks])
  useEffect(() => { saveToFirestore({ contacts:    dContacts    }) }, [dContacts])

  // --- Render states ---
  if (user === undefined) {
    return <div style={loadingStyle}>Indlæser...</div>
  }

  if (user === null) {
    return <LoginScreen />
  }

  if (!familyId) {
    return <FamilySetup user={user} />
  }

  if (!dataReady) {
    return <div style={loadingStyle}>Henter familiedata...</div>
  }

  return (
    <div>
      <Header user={user} familyId={familyId} />
      <Nav tabs={TABS} active={tab} onChange={setTab} />
      <div className="app-main">
        {tab === 'Overblik'   && <Overblik   todos={todos} setTodos={setTodos} processes={processes} setProcesses={setProcesses} />}
        {tab === 'Domæner'    && <Domaener   roles={roles} />}
        {tab === 'Kalender'   && <Kalender   weekEvents={weekEvents} setWeekEvents={setWeekEvents} monthEvents={monthEvents} setMonthEvents={setMonthEvents} />}
        {tab === 'Indkøb'     && <Indkoeb    shopping={shopping} setShopping={setShopping} />}
        {tab === 'Økonomi'    && <Oekonomi   budgetTotal={budgetTotal} setBudgetTotal={setBudgetTotal} budgetPosts={budgetPosts} setBudgetPosts={setBudgetPosts} />}
        {tab === 'Processer'  && <Processer  processes={processes} setProcesses={setProcesses} />}
        {tab === 'Husmøde'    && <Husmøde    agreements={agreements} setAgreements={setAgreements} meetings={meetings} setMeetings={setMeetings} />}
        {tab === 'Links'      && <Links      links={links} setLinks={setLinks} />}
        {tab === 'Kontakter'  && <Kontakter  contacts={contacts} setContacts={setContacts} />}
      </div>
    </div>
  )
}

const loadingStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 16,
  color: '#666',
}
