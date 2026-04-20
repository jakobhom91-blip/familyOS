export default function Domaener({ roles }) {
  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Domæner</div>
      </div>
      <div className="role-grid">
        {roles.map(r => (
          <div key={r.id} className={`role-card role-card--${r.color}`}>
            <div className="role-card__label">{r.label}</div>
            <div className="role-card__sub">{r.sub}</div>
            <div className="role-card__badge">{r.owner}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
