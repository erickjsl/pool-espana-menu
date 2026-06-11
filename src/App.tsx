import { type ChangeEvent, type ReactNode, useMemo, useState } from 'react'
import './App.css'
import { type GalleryImage, type MenuContent, type MenuItem, type MenuSection, type PromoCard } from './data/menu'
import { clearStoredContent, cloneDefaultContent, readStoredContent, saveStoredContent } from './lib/content'

const quickLinks = [
  { label: 'Promos', href: '#promos' },
  { label: 'Bebidas', href: '#menu' },
  { label: 'Tragos', href: '#tragos' },
  { label: 'Combos', href: '#combos' },
  { label: 'Fast Food', href: '#galeria' },
  { label: 'Posters', href: '#posters' },
]

const emptyPromo = (): PromoCard => ({
  title: 'Nueva promo',
  description: 'Descripcion corta.',
  price: '0 Gs',
  badge: '',
})

const emptyItem = (): MenuItem => ({
  name: 'Nuevo item',
  description: '',
  price: '0 Gs',
  badge: '',
})

const emptyImage = (): GalleryImage => ({
  src: '',
  alt: 'Nueva imagen',
})

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
  const [draft, setDraft] = useState<MenuContent>(() => cloneDefault(content))
  const [status, setStatus] = useState('Panel listo para editar.')
  const [jsonMode, setJsonMode] = useState(false)
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(content, null, 2))

  const stats = useMemo(() => {
    const itemsCount = draft.menuSections.reduce((total, section) => total + section.items.length, 0)

    return [
      { label: 'Promos', value: draft.featuredPromos.length },
      { label: 'Combos', value: draft.comboCards.length },
      { label: 'Categorias', value: draft.menuSections.length },
      { label: 'Items', value: itemsCount },
    ]
  }, [draft])

  function updateDraft(updater: (current: MenuContent) => MenuContent) {
    setDraft((current) => {
      const next = updater(current)
      setEditorValue(JSON.stringify(next, null, 2))
      return next
    })
  }

  function updatePromoCard(type: 'featuredPromos' | 'comboCards', index: number, field: keyof PromoCard, value: string) {
    updateDraft((current) => {
      const list = [...current[type]]
      list[index] = { ...list[index], [field]: value }
      return { ...current, [type]: list }
    })
  }

  function updateSectionMeta(index: number, field: keyof MenuSection, value: string) {
    updateDraft((current) => {
      const sections = [...current.menuSections]
      sections[index] = { ...sections[index], [field]: value }
      return { ...current, menuSections: sections }
    })
  }

  function updateSectionItem(sectionIndex: number, itemIndex: number, field: keyof MenuItem, value: string) {
    updateDraft((current) => {
      const sections = [...current.menuSections]
      const items = [...sections[sectionIndex].items]
      items[itemIndex] = { ...items[itemIndex], [field]: value }
      sections[sectionIndex] = { ...sections[sectionIndex], items }
      return { ...current, menuSections: sections }
    })
  }

  function addSectionItem(sectionIndex: number) {
    updateDraft((current) => {
      const sections = [...current.menuSections]
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: [...sections[sectionIndex].items, emptyItem()],
      }
      return { ...current, menuSections: sections }
    })
  }

  function removeSectionItem(sectionIndex: number, itemIndex: number) {
    updateDraft((current) => {
      const sections = [...current.menuSections]
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: sections[sectionIndex].items.filter((_, index) => index !== itemIndex),
      }
      return { ...current, menuSections: sections }
    })
  }

  function addPromo(type: 'featuredPromos' | 'comboCards') {
    updateDraft((current) => ({
      ...current,
      [type]: [...current[type], emptyPromo()],
    }))
  }

  function removePromo(type: 'featuredPromos' | 'comboCards', index: number) {
    updateDraft((current) => ({
      ...current,
      [type]: current[type].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function updateImage(index: number, field: keyof GalleryImage, value: string) {
    updateDraft((current) => {
      const images = [...current.galleryImages]
      images[index] = { ...images[index], [field]: value }
      return { ...current, galleryImages: images }
    })
  }

  async function updateImageFile(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const base64 = await fileToBase64(file)
    updateImage(index, 'src', base64)
    setStatus(`Imagen cargada: ${file.name}`)
    event.target.value = ''
  }

  function addImage() {
    updateDraft((current) => ({
      ...current,
      galleryImages: [...current.galleryImages, emptyImage()],
    }))
  }

  function removeImage(index: number) {
    updateDraft((current) => ({
      ...current,
      galleryImages: current.galleryImages.filter((_, imageIndex) => imageIndex !== index),
    }))
  }

  function handleSave() {
    saveStoredContent(draft)
    onContentChange(draft)
    setStatus('Cambios guardados en este navegador.')
  }

  function handleReset() {
    const resetContent = cloneDefaultContent()
    clearStoredContent()
    setDraft(resetContent)
    onContentChange(resetContent)
    setEditorValue(JSON.stringify(resetContent, null, 2))
    setStatus('Contenido restaurado al original del proyecto.')
  }

  function handleDownload() {
    const file = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pool-espana-menu-content.json'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('Archivo JSON descargado.')
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const text = await file.text()

    try {
      const parsed = JSON.parse(text) as MenuContent
      setDraft(parsed)
      setEditorValue(JSON.stringify(parsed, null, 2))
      setStatus(`Archivo cargado: ${file.name}`)
    } catch {
      setStatus('No se pudo importar el archivo.')
    }

    event.target.value = ''
  }

  function handleJsonApply() {
    try {
      const parsed = JSON.parse(editorValue) as MenuContent
      setDraft(parsed)
      setStatus('JSON aplicado al panel visual.')
    } catch {
      setStatus('JSON invalido. Revisa comas, llaves y comillas.')
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Admin facil</p>
          <h1>Editar menu sin experiencia</h1>
          <p className="admin-note">
            Cambia textos, precios e imagenes con formularios simples. Guarda al final para que
            este navegador recuerde los cambios.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="admin-button primary" onClick={handleSave}>
            Guardar cambios
          </button>
          <a className="secondary-cta" href="/">
            Ver sitio
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
          <button type="button" className="admin-button" onClick={handleDownload}>
            Descargar respaldo
          </button>
          <label className="admin-button file-button">
            Importar respaldo
            <input type="file" accept="application/json" onChange={handleImport} />
          </label>
          <button type="button" className="admin-button danger" onClick={handleReset}>
            Restaurar original
          </button>
        </div>

        <p className="admin-status">{status}</p>

        <div className="admin-sections">
          <AdminCard title="Datos principales" description="Nombre visible y textos del encabezado.">
            <div className="form-grid two-columns">
              <Field
                label="Nombre grande"
                value={draft.siteData.displayName}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    siteData: { ...current.siteData, displayName: value },
                  }))
                }
              />
              <Field
                label="Ciudad"
                value={draft.siteData.city}
                onChange={(value) =>
                  updateDraft((current) => ({
                    ...current,
                    siteData: { ...current.siteData, city: value },
                  }))
                }
              />
            </div>
          </AdminCard>

          <AdminCard title="Promos destacadas" description="Cambia las promos de la parte superior.">
            <div className="stack-list">
              {draft.featuredPromos.map((promo, index) => (
                <EditablePromoCard
                  key={`featured-${index}`}
                  title={`Promo ${index + 1}`}
                  promo={promo}
                  onFieldChange={(field, value) => updatePromoCard('featuredPromos', index, field, value)}
                  onRemove={() => removePromo('featuredPromos', index)}
                />
              ))}
            </div>
            <button type="button" className="admin-button add-button" onClick={() => addPromo('featuredPromos')}>
              Agregar promo
            </button>
          </AdminCard>

          <AdminCard title="Combos" description="Agrega, quita o cambia combos con ficha.">
            <div className="stack-list">
              {draft.comboCards.map((combo, index) => (
                <EditablePromoCard
                  key={`combo-${index}`}
                  title={`Combo ${index + 1}`}
                  promo={combo}
                  onFieldChange={(field, value) => updatePromoCard('comboCards', index, field, value)}
                  onRemove={() => removePromo('comboCards', index)}
                />
              ))}
            </div>
            <button type="button" className="admin-button add-button" onClick={() => addPromo('comboCards')}>
              Agregar combo
            </button>
          </AdminCard>

          <AdminCard title="Categorias del menu" description="Aqui cambias nombres, precios y descripciones.">
            <div className="stack-list">
              {draft.menuSections.map((section, sectionIndex) => (
                <div className="editor-card" key={section.id}>
                  <div className="editor-card-header">
                    <div>
                      <h3>{section.title}</h3>
                      <p>{section.id}</p>
                    </div>
                  </div>

                  <div className="form-grid two-columns">
                    <Field
                      label="Titulo"
                      value={section.title}
                      onChange={(value) => updateSectionMeta(sectionIndex, 'title', value)}
                    />
                    <Field
                      label="Subtitulo pequeno"
                      value={section.eyebrow}
                      onChange={(value) => updateSectionMeta(sectionIndex, 'eyebrow', value)}
                    />
                  </div>

                  <Field
                    label="Descripcion"
                    value={section.description}
                    onChange={(value) => updateSectionMeta(sectionIndex, 'description', value)}
                    multiline
                  />

                  <div className="stack-list">
                    {section.items.map((item, itemIndex) => (
                      <div className="sub-editor-card" key={`${section.id}-${itemIndex}`}>
                        <div className="editor-card-header">
                          <strong>Item {itemIndex + 1}</strong>
                          <button
                            type="button"
                            className="remove-link"
                            onClick={() => removeSectionItem(sectionIndex, itemIndex)}
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="form-grid two-columns">
                          <Field
                            label="Nombre"
                            value={item.name}
                            onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'name', value)}
                          />
                          <Field
                            label="Precio"
                            value={item.price}
                            onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'price', value)}
                          />
                        </div>

                        <Field
                          label="Descripcion"
                          value={item.description ?? ''}
                          onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'description', value)}
                          multiline
                        />

                        <Field
                          label="Etiqueta opcional"
                          value={item.badge ?? ''}
                          onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'badge', value)}
                        />
                      </div>
                    ))}
                  </div>

                  <button type="button" className="admin-button add-button" onClick={() => addSectionItem(sectionIndex)}>
                    Agregar item a {section.title}
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Imagenes / posters" description="Puedes subir imagenes nuevas o pegar un link.">
            <div className="stack-list">
              {draft.galleryImages.map((image, index) => (
                <div className="editor-card" key={`image-${index}`}>
                  <div className="editor-card-header">
                    <strong>Imagen {index + 1}</strong>
                    <button type="button" className="remove-link" onClick={() => removeImage(index)}>
                      Eliminar
                    </button>
                  </div>

                  <div className="image-editor-grid">
                    <div className="image-preview-frame">
                      {image.src ? <img src={image.src} alt={image.alt} /> : <span>Sin imagen</span>}
                    </div>

                    <div className="stack-list tight">
                      <Field
                        label="Texto alternativo"
                        value={image.alt}
                        onChange={(value) => updateImage(index, 'alt', value)}
                      />
                      <Field
                        label="Link de imagen"
                        value={image.src}
                        onChange={(value) => updateImage(index, 'src', value)}
                      />
                      <label className="upload-box">
                        Subir imagen desde el celular o PC
                        <input type="file" accept="image/*" onChange={(event) => updateImageFile(index, event)} />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="admin-button add-button" onClick={addImage}>
              Agregar imagen
            </button>
          </AdminCard>

          <details className="advanced-json">
            <summary>Modo avanzado JSON</summary>
            <p>Solo usa esto si ya sabes lo que estas haciendo.</p>
            <div className="admin-toolbar compact-toolbar">
              <button type="button" className="admin-button" onClick={() => setJsonMode((current) => !current)}>
                {jsonMode ? 'Ocultar JSON' : 'Mostrar JSON'}
              </button>
              <button type="button" className="admin-button" onClick={handleJsonApply}>
                Aplicar JSON al panel
              </button>
            </div>
            {jsonMode ? (
              <textarea
                className="admin-editor"
                value={editorValue}
                onChange={(event) => setEditorValue(event.target.value)}
                spellCheck={false}
                aria-label="Editor JSON del menu"
              />
            ) : null}
          </details>
        </div>
      </section>
    </div>
  )
}

function EditablePromoCard({
  title,
  promo,
  onFieldChange,
  onRemove,
}: {
  title: string
  promo: PromoCard
  onFieldChange: (field: keyof PromoCard, value: string) => void
  onRemove: () => void
}) {
  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <strong>{title}</strong>
        <button type="button" className="remove-link" onClick={onRemove}>
          Eliminar
        </button>
      </div>

      <div className="form-grid two-columns">
        <Field label="Titulo" value={promo.title} onChange={(value) => onFieldChange('title', value)} />
        <Field label="Precio" value={promo.price} onChange={(value) => onFieldChange('price', value)} />
      </div>

      <Field
        label="Descripcion"
        value={promo.description}
        onChange={(value) => onFieldChange('description', value)}
        multiline
      />

      <Field label="Etiqueta" value={promo.badge ?? ''} onChange={(value) => onFieldChange('badge', value)} />
    </div>
  )
}

function AdminCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <article className="admin-block">
      <div className="admin-block-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </article>
  )
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

function cloneDefault<T>(value: T) {
  return JSON.parse(JSON.stringify(value)) as T
}

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

export default App
