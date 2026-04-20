import { useState, useEffect } from 'react'
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

import {
  DEFAULT_ROLES, DEFAULT_TODOS, DEFAULT_WEEK_EVENTS, DEFAULT_MONTH_EVENTS,
  DEFAULT_SHOPPING, DEFAULT_BUDGET_TOTAL, DEFAULT_BUDGET_POSTS,
  DEFAULT_PROCESSES, DEFAULT_AGREEMENTS, DEFAULT_MEETINGS,
  DEFAULT_LINKS, DEFAULT_CONTACTS,
} from './data/defaults.js'

// ---- localStorage helpers ----
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const TABS = ['Overblik','Kalender','Indkøb','Økonomi','Processer','Husmøde','Links','Kontakter']

export default function App() {
  const [tab, setTab] = useState('Overblik')

  // State — alle sektioner
  const [roles,       setRoles]       = useState(() => load('familie-roles',       DEFAULT_ROLES))
  const [todos,       setTodos]       = useState(() => load('familie-todos',        DEFAULT_TODOS))
  const [weekEvents,  setWeekEvents]  = useState(() => load('familie-week-events',  DEFAULT_WEEK_EVENTS))
  const [monthEvents, setMonthEvents] = useState(() => load('familie-month-events', DEFAULT_MONTH_EVENTS))
  const [shopping,    setShopping]    = useState(() => load('familie-shopping',     DEFAULT_SHOPPING))
  const [budgetTotal, setBudgetTotal] = useState(() => load('familie-budget-total', DEFAULT_BUDGET_TOTAL))
  const [budgetPosts, setBudgetPosts] = useState(() => load('familie-budget-posts', DEFAULT_BUDGET_POSTS))
  const [processes,   setProcesses]   = useState(() => load('familie-processes',    DEFAULT_PROCESSES))
  const [agreements,  setAgreements]  = useState(() => load('familie-agreements',   DEFAULT_AGREEMENTS))
  const [meetings,    setMeetings]    = useState(() => load('familie-meetings',     DEFAULT_MEETINGS))
  const [links,       setLinks]       = useState(() => load('familie-links',        DEFAULT_LINKS))
  const [contacts,    setContacts]    = useState(() => load('familie-contacts',     DEFAULT_CONTACTS))

  // Persist to localStorage whenever state changes
  useEffect(() => save('familie-roles',        roles),       [roles])
  useEffect(() => save('familie-todos',        todos),       [todos])
  useEffect(() => save('familie-week-events',  weekEvents),  [weekEvents])
  useEffect(() => save('familie-month-events', monthEvents), [monthEvents])
  useEffect(() => save('familie-shopping',     shopping),    [shopping])
  useEffect(() => save('familie-budget-total', budgetTotal), [budgetTotal])
  useEffect(() => save('familie-budget-posts', budgetPosts), [budgetPosts])
  useEffect(() => save('familie-processes',    processes),   [processes])
  useEffect(() => save('familie-agreements',   agreements),  [agreements])
  useEffect(() => save('familie-meetings',     meetings),    [meetings])
  useEffect(() => save('familie-links',        links),       [links])
  useEffect(() => save('familie-contacts',     contacts),    [contacts])

  return (
    <div>
      <Header />
      <Nav tabs={TABS} active={tab} onChange={setTab} />

      <div className="app-main">
        {tab === 'Overblik'   && <Overblik   roles={roles} setRoles={setRoles} todos={todos} setTodos={setTodos} />}
        {tab === 'Kalender'   && <Kalender   weekEvents={weekEvents} setWeekEvents={setWeekEvents} monthEvents={monthEvents} setMonthEvents={setMonthEvents} />}
        {tab === 'Indkøb'     && <Indkoeb    shopping={shopping} setShopping={setShopping} />}
        {tab === 'Økonomi'    && <Oekonomi   budgetTotal={budgetTotal} setBudgetTotal={setBudgetTotal} budgetPosts={budgetPosts} setBudgetPosts={setBudgetPosts} />}
        {tab === 'Processer'  && <Processer  processes={processes} setProcesses={setProcesses} />}
        {tab === 'Husmøde'    && <Husmøde   agreements={agreements} setAgreements={setAgreements} meetings={meetings} setMeetings={setMeetings} />}
        {tab === 'Links'      && <Links      links={links} setLinks={setLinks} />}
        {tab === 'Kontakter'  && <Kontakter  contacts={contacts} setContacts={setContacts} />}
      </div>
    </div>
  )
}
