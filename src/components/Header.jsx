// Header.jsx
const DAYS = ['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag']
const MONTHS = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']

export default function Header() {
  const now = new Date()
  const dateStr = `${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
  const dayStr  = DAYS[now.getDay()]

  return (
    <header className="app-header">
      <div>
        <div className="app-header__title">Familie OS</div>
        <div className="app-header__sub">Jakob & Camilla</div>
      </div>
      <div className="app-header__date">
        <div>{dateStr}</div>
        <div className="app-header__day">{dayStr}</div>
      </div>
    </header>
  )
}
