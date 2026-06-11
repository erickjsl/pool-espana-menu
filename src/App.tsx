import './App.css'
import {
  comboCards,
  featuredPromos,
  galleryImages,
  menuSections,
  siteData,
} from './data/menu'

const quickLinks = [
  { label: 'Promos', href: '#promos' },
  { label: 'Combos', href: '#combos' },
  { label: 'Menu', href: '#menu' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Reservas', href: '#reservas' },
]

function App() {
  return (
    <div className="page-shell">
      <header className="hero-section">
        <div className="hero-overlay" />
        <img
          className="hero-poster"
          src="/images/promo-copa.jpeg"
          alt="Ambiente y promocion futbolera de Pool Espana."
        />

        <div className="hero-content">
          <nav className="topbar" aria-label="Navegacion principal">
            <div className="brand-lockup">
              <span className="brand-mark">8</span>
              <div>
                <p className="eyebrow">{siteData.displayName}</p>
                <span className="brand-meta">{siteData.city}</span>
              </div>
            </div>

            <a className="whatsapp-pill" href={siteData.whatsappUrl} target="_blank" rel="noreferrer">
              Reservar ahora
            </a>
          </nav>

          <div className="hero-grid">
            <section className="hero-copy">
              <p className="section-kicker">{siteData.hero.eyebrow}</p>
              <h1>{siteData.hero.title}</h1>
              <p className="hero-description">{siteData.hero.description}</p>

              <div className="cta-row">
                <a className="primary-cta" href={siteData.whatsappUrl} target="_blank" rel="noreferrer">
                  Reservar por WhatsApp
                </a>
                <a className="secondary-cta" href="#menu">
                  Ver menu completo
                </a>
              </div>

              <ul className="stats-row" aria-label="Diferenciales del negocio">
                {siteData.hero.stats.map((stat) => (
                  <li key={stat}>{stat}</li>
                ))}
              </ul>
            </section>

            <aside className="hero-panel">
              <p className="panel-title">Accesos rapidos</p>
              <div className="quick-links">
                {quickLinks.map((link) => (
                  <a key={link.href} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="signal-card">
                <p className="signal-eyebrow">Pool Espana</p>
                <strong>{siteData.tagline}</strong>
                <span>Ideal para QR en mesas, flyers, historias y eventos.</span>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <main>
        <section className="highlights-strip" aria-label="Servicios destacados">
          {siteData.serviceHighlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </section>

        <section id="promos" className="content-section">
          <div className="section-heading">
            <p className="section-kicker">Promociones</p>
            <h2>Lo primero que el cliente ve cuando escanea el QR</h2>
            <p>
              El sitio abre con promociones fuertes, contacto directo y una identidad visual
              alineada con el bar.
            </p>
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

        <section id="combos" className="content-section">
          <div className="section-heading">
            <p className="section-kicker">Combos ficha</p>
            <h2>Combos listos para grupos, previa y noches de pool</h2>
            <p>
              Esta seccion convierte muy bien porque presenta precios claros, valor agregado y
              formato facil de comparar.
            </p>
          </div>

          <div className="combo-grid">
            {comboCards.map((combo) => (
              <article className="menu-card combo-card" key={combo.title}>
                <div>
                  <h3>{combo.title}</h3>
                  <p>{combo.description}</p>
                </div>
                <strong>{combo.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="menu" className="content-section">
          <div className="section-heading">
            <p className="section-kicker">Menu completo</p>
            <h2>Todo organizado por categorias para una lectura rapida en celular</h2>
            <p>
              Los datos quedaron estructurados para que puedas editar precios, nombres y promos
              desde un solo archivo.
            </p>
          </div>

          <div className="menu-sections">
            {menuSections.map((section) => (
              <article className="menu-section" key={section.id}>
                <div className="menu-section-head">
                  <p className="section-kicker">{section.eyebrow}</p>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                </div>

                <div className="menu-items">
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

        <section id="galeria" className="content-section">
          <div className="section-heading">
            <p className="section-kicker">Visuales</p>
            <h2>Material promocional reutilizable dentro del sitio</h2>
            <p>
              Tambien deje una galeria con las piezas que mandaste para reforzar identidad,
              campañas y futuras publicaciones.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <figure className="gallery-card" key={image.src}>
                <img src={image.src} alt={image.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer id="reservas" className="footer-cta">
        <div>
          <p className="section-kicker">Reservas</p>
          <h2>Listo para compartir por QR, WhatsApp o bio de Instagram</h2>
          <p>
            El enlace final se puede pegar en cualquier generador de QR apenas publiques en Vercel.
          </p>
        </div>

        <div className="footer-actions">
          <a className="primary-cta" href={siteData.whatsappUrl} target="_blank" rel="noreferrer">
            Hablar con {siteData.whatsappDisplay}
          </a>
          <span className="footer-note">{siteData.city}</span>
        </div>
      </footer>
    </div>
  )
}

export default App
