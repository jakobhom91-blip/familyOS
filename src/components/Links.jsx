export default function Links({ links, setLinks }) {
  function addLink() {
    const name = window.prompt('Navn på link:'); if (!name) return
    const url  = window.prompt('URL (https://...)'); if (!url) return
    const emoji = window.prompt('Emoji (valgfri):', '🔗') || '🔗'
    setLinks(prev => [...prev, {
      id: Date.now(), emoji, name,
      desc: url.replace('https://','').split('/')[0], url
    }])
  }

  function removeLink(id) {
    if (window.confirm('Fjern dette link?')) setLinks(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">Hurtige links</div>
        <button className="section__add-btn" onClick={addLink}>+</button>
      </div>
      <div className="links-grid">
        {links.map(l => (
          <a key={l.id} className="link-item" href={l.url} target="_blank" rel="noopener noreferrer"
            onContextMenu={e => { e.preventDefault(); removeLink(l.id) }}>
            <div className="link-item__emoji">{l.emoji}</div>
            <div>
              <div className="link-item__name">{l.name}</div>
              <div className="link-item__desc">{l.desc}</div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ padding: '8px 16px', fontSize: 10, color: 'var(--muted)' }}>
        Højreklik / langt tryk for at fjerne et link
      </div>
    </div>
  )
}
