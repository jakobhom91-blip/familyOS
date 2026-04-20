export default function Nav({ tabs, active, onChange }) {
  return (
    <nav className="app-nav">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`app-nav__btn${active === tab ? ' active' : ''}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
