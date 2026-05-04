// Header.jsx
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'

const DAYS = ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag']
const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']

export default function Header({ user, familyId }) {
  const now = new Date()
  const dateStr = `${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const dayStr  = DAYS[now.getDay()]

  async function handleLogOut() {
    await signOut(auth)
  }

  return (
    <header className="app-header">
      <div>
        <div className="app-header__title">♥ Familie OS ♥</div>
        <div className="app-header__sub">
          {familyId ? `Kode: ${familyId}` : 'Jakob & Camilla'}
        </div>
      </div>
      <div className="app-header__date">
        <div>{dateStr}</div>
        <div className="app-header__day">{dayStr}</div>
        {user && (
          <button onClick={handleLogOut} style={logoutStyle}>
            Log ud
          </button>
        )}
      </div>
    </header>
  )
}

const logoutStyle = {
  marginTop: 6,
  padding: '3px 10px',
  fontSize: 12,
  background: 'transparent',
  color: 'inherit',
  border: '1px solid rgba(255,255,255,0.4)',
  borderRadius: 6,
  cursor: 'pointer',
  opacity: 0.8,
}
