import { type ChangeEvent, useMemo, useState } from 'react'
import './App.css'
import { type MenuContent } from './data/menu'
import { clearStoredContent, cloneDefaultContent, readStoredContent, saveStoredContent } from './lib/content'

const quickLinks = [
  { label: 'Promos', href: '#promos' },
  { label: 'Bebidas', href: '#menu' },
  { label: 'Tragos', href: '#tragos' },
  { label: 'Combos', href: '#combos' },
  { label: 'Fast Food', href: '#galeria' },
  { label: 'Posters', href: '#posters' },
]

function App() {
  const isAdminRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/+$/, '') === '/admin'

  const [content, setContent] = useState<MenuContent>(() => readStoredContent())

  if (isAdminRoute) {
    return <AdminPage content={content} onContentChange={setContent} />
  }

  return <PublicPage content={content} />
}

function PublicPage({ content }: { content: MenuContent }) {
  const { siteData, featuredPromos, comboCards, menuSections, galleryImages } = content
  const bebidasSections = menuSections.filter((section) =>
    ['chopp', 'cervezas', 'gaseosas', 'whisky'].includes(section.id),
  )
  const tragosSection = menuSections.find((section) => section.id === 'tragos')
  const comidasSection = menuSections.find((section) => section.id === 'comidas')

  const posterLinks = {
    bebidas: galleryImages.find((image) => image.src.includes('menu-bebidas')),
    tragos: galleryImages.find((image) => image.src.includes('tragos-poster')),
    combos: galleryImages.find((image) => image.src.includes('combos-ficha')),
    comidas: galleryImages.find((image) => image.src.includes('menu-fast-food')),
  }

  return (
    <div className="page-shell">
      <header className="menu-hero">
        <div className="hero-overlay" />
        <img
          className="hero-poster"
          src="/images/promo-copa.jpeg"
          alt="Ambiente y promocion futbolera de Pool Espana."
        />

        <div className="menu-hero-content">
          <div className="brand-lockup">
            <img className="brand-logo" src="/images/logo.jpeg" alt="Logo Pool Espana" />
            <div>
              <p className="eyebrow">{siteData.displayName}</p>
              <span className="brand-meta">Bar | Pool | Asuncion</span>
            </div>
          </div>

          <p className="hero-slogan">Disfruta | Brinda | Juga</p>
          <h1>Menu</h1>
          <p className="hero-subtitle">Todo el menu en un solo lugar, rapido y claro para celular.</p>
        </div>
      </header>

      <nav className="category-nav" aria-label="Navegacion de categorias">
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>

      <main className="menu-main">
        <section id="promos" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Destacados</p>
              <h2>Promos de la casa</h2>
            </div>
          </div>

          <div className="promo-grid">
            {featuredPromos.map((promo) => (
              <article className="promo-card" key={promo.title}>
                {promo.badge ? <span className="badge">{promo.badge}</span> : null}
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                <strong>{promo.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="menu" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Menu</p>
              <h2>Bebidas</h2>
            </div>
            {posterLinks.bebidas ? (
              <a className="poster-link" href={posterLinks.bebidas.src} target="_blank" rel="noreferrer">
                Ver poster original
              </a>
            ) : null}
          </div>

          <div className="menu-subsections">
            {bebidasSections.map((section) => (
              <article className="menu-section" key={section.id}>
                <div className="menu-section-head">
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>

                <div className="menu-items single-column">
                  {section.items.map((item) => (
                    <div className="menu-item" key={`${section.id}-${item.name}`}>
                      <div className="item-copy">
                        <div className="item-title-row">
                          <h4>{item.name}</h4>
                          {item.badge ? <span className="item-badge">{item.badge}</span> : null}
                        </div>
                        {item.description ? <p>{item.description}</p> : null}
                      </div>
                      <strong>{item.price}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="tragos" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Barra</p>
              <h2>Tragos</h2>
            </div>
            {posterLinks.tragos ? (
              <a className="poster-link" href={posterLinks.tragos.src} target="_blank" rel="noreferrer">
                Ver poster original
              </a>
            ) : null}
          </div>

          {tragosSection ? (
            <article className="menu-section">
              <div className="menu-items">
                {tragosSection.items.map((item) => (
                  <div className="menu-item" key={`${tragosSection.id}-${item.name}`}>
                    <div className="item-copy">
                      <div className="item-title-row">
                        <h4>{item.name}</h4>
                      </div>
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                    <strong>{item.price}</strong>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <section id="combos" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Promo</p>
              <h2>Combos ficha</h2>
            </div>
            {posterLinks.combos ? (
              <a className="poster-link" href={posterLinks.combos.src} target="_blank" rel="noreferrer">
                Ver poster original
              </a>
            ) : null}
          </div>

          <div className="combo-grid">
            {comboCards.map((combo) => (
              <article className="menu-card" key={combo.title}>
                <div>
                  <h3>{combo.title}</h3>
                  <p>{combo.description}</p>
                </div>
                <strong>{combo.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="galeria" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Cocina</p>
              <h2>Fast food</h2>
            </div>
            {posterLinks.comidas ? (
              <a className="poster-link" href={posterLinks.comidas.src} target="_blank" rel="noreferrer">
                Ver poster original
              </a>
            ) : null}
          </div>

          {comidasSection ? (
            <article className="menu-section">
              <div className="menu-items">
                {comidasSection.items.map((item) => (
                  <div className="menu-item" key={`${comidasSection.id}-${item.name}`}>
                    <div className="item-copy">
                      <div className="item-title-row">
                        <h4>{item.name}</h4>
                        {item.badge ? <span className="item-badge">{item.badge}</span> : null}
                      </div>
                      {item.description ? <p>{item.description}</p> : null}
                    </div>
                    <strong>{item.price}</strong>
                  </div>
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <section id="posters" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Visual</p>
              <h2>Posters</h2>
            </div>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <a className="gallery-card" key={image.src} href={image.src} target="_blank" rel="noreferrer">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="simple-footer">
        <p>{siteData.displayName}</p>
        <span>Bar | Pool | Asuncion</span>
      </footer>
    </div>
  )
}

function AdminPage({
  content,
  onContentChange,
}: {
  content: MenuContent
  onContentChange: (content: MenuContent) => void
}) {
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(content, null, 2))
  const [status, setStatus] = useState('Editor listo.')

  const stats = useMemo(() => {
    const itemsCount = content.menuSections.reduce((total, section) => total + section.items.length, 0)

    return [
      { label: 'Promos', value: content.featuredPromos.length },
      { label: 'Combos', value: content.comboCards.length },
      { label: 'Categorias', value: content.menuSections.length },
      { label: 'Items', value: itemsCount },
    ]
  }, [content])

  const handleSave = () => {
    try {
      const parsed = JSON.parse(editorValue) as MenuContent
      saveStoredContent(parsed)
      onContentChange(parsed)
      setStatus('Cambios guardados en este navegador.')
    } catch {
      setStatus('JSON invalido. Revisa comas, llaves y comillas.')
    }
  }

  const handleReset = () => {
    const resetContent = cloneDefaultContent()
    clearStoredContent()
    onContentChange(resetContent)
    setEditorValue(JSON.stringify(resetContent, null, 2))
    setStatus('Contenido restaurado al original del proyecto.')
  }

  const handleDownload = () => {
    const file = new Blob([editorValue], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pool-espana-menu-content.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Archivo JSON descargado.')
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(editorValue)
      setEditorValue(JSON.stringify(parsed, null, 2))
      setStatus('JSON formateado.')
    } catch {
      setStatus('No se pudo formatear porque el JSON es invalido.')
    }
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const text = await file.text()
    setEditorValue(text)
    setStatus(`Archivo cargado: ${file.name}. Revisa y guarda.`)
    event.target.value = ''
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Admin</p>
          <h1>Editor de contenido de Pool Espana</h1>
          <p className="admin-note">
            Este panel guarda cambios en el navegador actual. Para hacerlos publicos para todos,
            exporta el JSON y actualiza el proyecto con un nuevo deploy.
          </p>
        </div>

        <div className="admin-header-actions">
          <a className="secondary-cta" href="/">
            Ver sitio
          </a>
          <a className="primary-cta" href={content.siteData.whatsappUrl} target="_blank" rel="noreferrer">
            Probar WhatsApp
          </a>
        </div>
      </header>

      <section className="admin-overview">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-toolbar">
          <button type="button" className="admin-button primary" onClick={handleSave}>
            Guardar en navegador
          </button>
          <button type="button" className="admin-button" onClick={handleFormat}>
            Formatear JSON
          </button>
          <button type="button" className="admin-button" onClick={handleDownload}>
            Descargar JSON
          </button>
          <label className="admin-button file-button">
            Importar JSON
            <input type="file" accept="application/json" onChange={handleImport} />
          </label>
          <button type="button" className="admin-button danger" onClick={handleReset}>
            Restaurar original
          </button>
        </div>

        <p className="admin-status">{status}</p>

        <textarea
          className="admin-editor"
          value={editorValue}
          onChange={(event) => setEditorValue(event.target.value)}
          spellCheck={false}
          aria-label="Editor JSON del menu"
        />
      </section>
    </div>
  )
}

export default App
