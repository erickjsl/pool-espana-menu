import type { MenuContent } from '../../data/menu'
import type { ContentStatus } from '../../types/ui'
import { useActiveCategory } from '../../hooks/useActiveCategory'
import { AppImage } from '../shared/AppImage'
import { ProductRow } from './ProductRow'

const quickLinks = [
  { label: 'Bebidas', href: '#menu' },
  { label: 'Tragos', href: '#tragos' },
  { label: 'Combos', href: '#combos' },
  { label: 'Comidas', href: '#comidas' },
]

export function PublicPage({ content, contentStatus }: { content: MenuContent; contentStatus: ContentStatus }) {
  const { siteData, comboCards, menuSections } = content
  const { activeCategory, setActiveCategory } = useActiveCategory(quickLinks)
  const bebidasSections = menuSections.filter((section) =>
    ['chopp', 'cervezas', 'gaseosas', 'whisky'].includes(section.id),
  )
  const tragosSection = menuSections.find((section) => section.id === 'tragos')
  const comidasSection = menuSections.find((section) => section.id === 'comidas')

  return (
    <div className="page-shell">
      <header className="menu-hero">
        <div className="hero-overlay" />
        <AppImage
          className="hero-poster"
          src="/images/promo-copa.jpeg"
          alt="Ambiente y promocion futbolera de Pool Espana."
          priority
          width={1600}
          height={900}
          sizes="100vw"
        />

        <div className="menu-hero-content">
          <div className="brand-lockup">
            <AppImage
              className="brand-logo"
              src="/images/logo.jpeg"
              alt="Logo Pool Espana"
              priority
              width={260}
              height={260}
              sizes="(max-width: 640px) 132px, (max-width: 420px) 120px, 260px"
            />
            <div>
              <p className="eyebrow">{siteData.displayName}</p>
              <span className="brand-meta">Bar | Pool | Asuncion</span>
            </div>
          </div>

          <div className="hero-copy">
            <p className="hero-slogan">Disfruta | Brinda | Juga</p>
            <h1>Menu</h1>
            <p className="hero-subtitle">Carta digital de bebidas, tragos, combos y comidas para disfrutar la noche.</p>
          </div>
        </div>
      </header>

      <nav className="category-nav" aria-label="Navegacion de categorias">
        {quickLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={activeCategory === link.href ? 'active' : undefined}
            aria-current={activeCategory === link.href ? 'true' : undefined}
            onClick={() => setActiveCategory(link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <main className="menu-main">
        {contentStatus === 'error' ? (
          <div className="sync-banner">
            No se pudo actualizar el menu central. Se muestra la ultima version disponible.
          </div>
        ) : null}

        <section id="menu" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Bebidas</p>
              <h2>Bebidas</h2>
            </div>
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
                    <ProductRow
                      key={`${section.id}-${item.name}`}
                      item={item}
                      imageTone={section.id === 'tragos' ? 'cocktail' : section.id === 'comidas' ? 'food' : 'bottle'}
                    />
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
          </div>

          {tragosSection ? (
            <article className="menu-section">
              <div className="menu-items">
                {tragosSection.items.map((item) => (
                  <ProductRow key={`${tragosSection.id}-${item.name}`} item={item} imageTone="cocktail" />
                ))}
              </div>
            </article>
          ) : null}
        </section>

        <section id="combos" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Combos</p>
              <h2>Combos ficha</h2>
            </div>
          </div>

          <div className="combo-grid">
            {comboCards.map((combo) => (
              <article className="menu-card combo-card" key={combo.title}>
                {combo.image ? (
                  <div className="combo-image">
                    <AppImage
                      src={combo.image}
                      alt={combo.title}
                      width={720}
                      height={540}
                      sizes="(max-width: 900px) 100vw, 33vw"
                    />
                  </div>
                ) : null}
                <div>
                  <h3>{combo.title}</h3>
                  <p>{combo.description}</p>
                </div>
                <strong className="card-price">{combo.price}</strong>
              </article>
            ))}
          </div>
        </section>

        <section id="comidas" className="menu-block">
          <div className="block-heading">
            <div>
              <p className="section-kicker">Cocina</p>
              <h2>Comidas</h2>
            </div>
          </div>

          {comidasSection ? (
            <article className="menu-section">
              <div className="menu-items">
                {comidasSection.items.map((item) => (
                  <ProductRow key={`${comidasSection.id}-${item.name}`} item={item} imageTone="food" />
                ))}
              </div>
            </article>
          ) : null}
        </section>
      </main>

      <footer className="simple-footer">
        <p>{siteData.displayName}</p>
        <span>Bar | Pool | Asuncion</span>
      </footer>
    </div>
  )
}
