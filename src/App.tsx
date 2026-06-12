import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react'
import './App.css'
import { type MenuContent, type MenuItem, type MenuSection, type PromoCard } from './data/menu'
import {
  clearStoredContent,
  cloneContent,
  cloneDefaultContent,
  fetchRemoteContent,
  readStoredContent,
  saveRemoteContent,
  saveStoredContent,
  uploadRemoteImage,
} from './lib/content'

const quickLinks = [
  { label: 'Bebidas', href: '#menu' },
  { label: 'Tragos', href: '#tragos' },
  { label: 'Combos', href: '#combos' },
  { label: 'Comidas', href: '#comidas' },
]

const emptyPromo = (): PromoCard => ({
  title: 'Nuevo combo',
  description: 'Descripcion corta.',
  price: '0 Gs',
  badge: '',
  image: '',
})

const emptyItem = (): MenuItem => ({
  name: 'Nuevo item',
  description: '',
  price: '0 Gs',
  badge: '',
  image: '',
})

function App() {
  const isAdminRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/+$/, '') === '/admin'

  const [content, setContent] = useState<MenuContent>(() => readStoredContent())
  const [contentStatus, setContentStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    let active = true

    async function syncContent() {
      setContentStatus('loading')

      try {
        const remoteContent = await fetchRemoteContent()

        if (!active) {
          return
        }

        setContent(remoteContent)
        setContentStatus('idle')
      } catch {
        if (active) {
          setContentStatus('error')
        }
      }
    }

    void syncContent()

    return () => {
      active = false
    }
  }, [])

  if (isAdminRoute) {
    return <AdminAccess content={content} onContentChange={setContent} contentStatus={contentStatus} />
  }

  return <PublicPage content={content} contentStatus={contentStatus} />
}

function AdminAccess({
  content,
  onContentChange,
  contentStatus,
}: {
  content: MenuContent
  onContentChange: (content: MenuContent) => void
  contentStatus: 'idle' | 'loading' | 'error'
}) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const response = await fetch('/api/admin-session', {
          method: 'GET',
          credentials: 'include',
        })

        if (!active) {
          return
        }

        setStatus(response.ok ? 'authenticated' : 'unauthenticated')
      } catch {
        if (active) {
          setStatus('unauthenticated')
        }
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="admin-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker">Admin protegido</p>
          <h1>Verificando acceso</h1>
          <p className="auth-help">Un momento mientras validamos la sesion.</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <AdminLogin onSuccess={() => setStatus('authenticated')} />
  }

  if (contentStatus === 'loading') {
    return (
      <div className="admin-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker">Admin protegido</p>
          <h1>Cargando menu central</h1>
          <p className="auth-help">Estamos preparando la ultima version antes de editar.</p>
        </div>
      </div>
    )
  }

  return (
    <AdminPage
      content={content}
      onContentChange={onContentChange}
      onLogout={() => setStatus('unauthenticated')}
      contentStatus={contentStatus}
    />
  )
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        setError(payload?.message ?? 'Usuario o contrasena incorrectos.')
        setLoading(false)
        return
      }

      onSuccess()
    } catch {
      setError('No se pudo iniciar sesion. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <div className="admin-shell auth-shell">
      <section className="auth-card">
        <p className="section-kicker">Admin protegido</p>
        <h1>Acceso al panel</h1>
        <p className="auth-help">
          Ingresa usuario y contrasena para editar precios, textos e imagenes del menu.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Field label="Usuario" value={username} onChange={setUsername} />
          <Field label="Contrasena" value={password} onChange={setPassword} type="password" />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="admin-button primary auth-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar al admin'}
          </button>
        </form>
      </section>
    </div>
  )
}

function PublicPage({
  content,
  contentStatus,
}: {
  content: MenuContent
  contentStatus: 'idle' | 'loading' | 'error'
}) {
  const { siteData, comboCards, menuSections } = content
  const bebidasSections = menuSections.filter((section) =>
    ['chopp', 'cervezas', 'gaseosas', 'whisky'].includes(section.id),
  )
  const tragosSection = menuSections.find((section) => section.id === 'tragos')
  const comidasSection = menuSections.find((section) => section.id === 'comidas')

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
                    <ProductRow key={`${section.id}-${item.name}`} item={item} />
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
                  <ProductRow key={`${tragosSection.id}-${item.name}`} item={item} />
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
                    <img src={combo.image} alt={combo.title} loading="lazy" />
                  </div>
                ) : null}
                <div>
                  <h3>{combo.title}</h3>
                  <p>{combo.description}</p>
                </div>
                <strong>{combo.price}</strong>
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
                  <ProductRow key={`${comidasSection.id}-${item.name}`} item={item} />
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

function ProductRow({ item }: { item: MenuItem }) {
  return (
    <div className="menu-item product-row">
      {item.image ? (
        <div className="product-thumb">
          <img src={item.image} alt={item.name} loading="lazy" />
        </div>
      ) : null}
      <div className="item-copy">
        <div className="item-title-row">
          <h4>{item.name}</h4>
          {item.badge ? <span className="item-badge">{item.badge}</span> : null}
        </div>
        {item.description ? <p>{item.description}</p> : null}
      </div>
      <strong>{item.price}</strong>
    </div>
  )
}

function AdminPage({
  content,
  onContentChange,
  onLogout,
  contentStatus,
}: {
  content: MenuContent
  onContentChange: (content: MenuContent) => void
  onLogout: () => void
  contentStatus: 'idle' | 'loading' | 'error'
}) {
  const [draft, setDraft] = useState<MenuContent>(() => cloneContent(content))
  const [status, setStatus] = useState('Panel listo para editar.')
  const [jsonMode, setJsonMode] = useState(false)
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(content, null, 2))
  const [isSaving, setIsSaving] = useState(false)

  const stats = useMemo(() => {
    const itemsCount = draft.menuSections.reduce((total, section) => total + section.items.length, 0)
    const itemsWithImages = draft.menuSections.reduce(
      (total, section) => total + section.items.filter((item) => item.image).length,
      0,
    )

    return [
      { label: 'Combos', value: draft.comboCards.length },
      { label: 'Categorias', value: draft.menuSections.length },
      { label: 'Items', value: itemsCount },
      { label: 'Imgs cargadas', value: itemsWithImages + draft.comboCards.filter((item) => item.image).length },
    ]
  }, [draft])

  function updateDraft(updater: (current: MenuContent) => MenuContent) {
    setDraft((current) => {
      const next = updater(current)
      setEditorValue(JSON.stringify(next, null, 2))
      return next
    })
  }

  function updateCombo(index: number, field: keyof PromoCard, value: string) {
    updateDraft((current) => {
      const comboCards = [...current.comboCards]
      comboCards[index] = { ...comboCards[index], [field]: value }
      return { ...current, comboCards }
    })
  }

  function updateSectionMeta(index: number, field: keyof MenuSection, value: string) {
    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      menuSections[index] = { ...menuSections[index], [field]: value }
      return { ...current, menuSections }
    })
  }

  function updateSectionItem(sectionIndex: number, itemIndex: number, field: keyof MenuItem, value: string) {
    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      const items = [...menuSections[sectionIndex].items]
      items[itemIndex] = { ...items[itemIndex], [field]: value }
      menuSections[sectionIndex] = { ...menuSections[sectionIndex], items }
      return { ...current, menuSections }
    })
  }

  function addSectionItem(sectionIndex: number) {
    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      menuSections[sectionIndex] = {
        ...menuSections[sectionIndex],
        items: [...menuSections[sectionIndex].items, emptyItem()],
      }
      return { ...current, menuSections }
    })
  }

  function removeSectionItem(sectionIndex: number, itemIndex: number) {
    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      menuSections[sectionIndex] = {
        ...menuSections[sectionIndex],
        items: menuSections[sectionIndex].items.filter((_, index) => index !== itemIndex),
      }
      return { ...current, menuSections }
    })
  }

  function addCombo() {
    updateDraft((current) => ({
      ...current,
      comboCards: [...current.comboCards, emptyPromo()],
    }))
  }

  function removeCombo(index: number) {
    updateDraft((current) => ({
      ...current,
      comboCards: current.comboCards.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function updateComboImageFile(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus(`Preparando imagen del combo: ${file.name}...`)
      const path = await uploadRemoteImage(file)
      updateCombo(index, 'image', path)
      setStatus('Imagen del combo lista. Ahora toca Guardar para todos.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen del combo.'
      setStatus(message)
    } finally {
      event.target.value = ''
    }
  }

  async function updateItemImageFile(sectionIndex: number, itemIndex: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus(`Preparando imagen del producto: ${file.name}...`)
      const path = await uploadRemoteImage(file)
      updateSectionItem(sectionIndex, itemIndex, 'image', path)
      setStatus('Imagen del producto lista. Ahora toca Guardar para todos.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo subir la imagen del producto.'
      setStatus(message)
    } finally {
      event.target.value = ''
    }
  }

  async function handleSave() {
    setIsSaving(true)
    saveStoredContent(draft)

    try {
      const savedContent = await saveRemoteContent(draft)
      onContentChange(savedContent)
      setDraft(cloneContent(savedContent))
      setEditorValue(JSON.stringify(savedContent, null, 2))
      setStatus('Cambios guardados para todos los dispositivos.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el contenido central.'
      setStatus(message)
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    const resetContent = cloneDefaultContent()
    clearStoredContent()
    setDraft(resetContent)
    onContentChange(resetContent)
    setEditorValue(JSON.stringify(resetContent, null, 2))
    setStatus('Contenido restaurado localmente. Guarda para publicarlo a todos.')
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
    if (!file) return
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

  async function handleLogout() {
    try {
      await fetch('/api/admin-logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignored on purpose. We still return to login screen locally.
    }

    onLogout()
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="section-kicker">Admin facil</p>
          <h1>Editar menu sin experiencia</h1>
          <p className="admin-note">
            Cambia textos, precios e imagenes con formularios simples. Cada producto ya puede
            tener su propia foto.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="admin-button primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <a className="secondary-cta" href="/">
            Ver sitio
          </a>
          <button type="button" className="admin-button" onClick={handleLogout}>
            Salir
          </button>
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
        {contentStatus === 'error' ? (
          <p className="admin-status warning-status">
            No se pudo refrescar el contenido central. Editas la ultima copia disponible.
          </p>
        ) : null}

        <div className="admin-toolbar">
          <button type="button" className="admin-button primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar para todos'}
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
          <AdminCard title="Datos principales" description="Nombre visible del sitio.">
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

          <AdminCard title="Combos" description="Cada combo puede tener su foto propia.">
            <div className="stack-list">
              {draft.comboCards.map((combo, index) => (
                <EditableComboCard
                  key={`combo-${index}`}
                  title={`Combo ${index + 1}`}
                  combo={combo}
                  onFieldChange={(field, value) => updateCombo(index, field, value)}
                  onRemove={() => removeCombo(index)}
                  onImageUpload={(event) => updateComboImageFile(index, event)}
                />
              ))}
            </div>
            <button type="button" className="admin-button add-button" onClick={addCombo}>
              Agregar combo
            </button>
          </AdminCard>

          <AdminCard title="Categorias del menu" description="Cada producto puede tener foto, precio y descripcion.">
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

                        <div className="item-admin-grid">
                          <div className="image-preview-frame small-preview">
                            {item.image ? <img src={item.image} alt={item.name} /> : <span>Sin imagen</span>}
                          </div>

                          <div className="stack-list tight">
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
                              onChange={(value) =>
                                updateSectionItem(sectionIndex, itemIndex, 'description', value)
                              }
                              multiline
                            />

                            <Field
                              label="Etiqueta opcional"
                              value={item.badge ?? ''}
                              onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'badge', value)}
                            />

                            <Field
                              label="Link de imagen"
                              value={item.image ?? ''}
                              onChange={(value) => updateSectionItem(sectionIndex, itemIndex, 'image', value)}
                            />

                            <ImageUploadField
                              title="Imagen del producto"
                              image={item.image ?? ''}
                              onChange={(event) => updateItemImageFile(sectionIndex, itemIndex, event)}
                            />
                          </div>
                        </div>
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

function EditableComboCard({
  title,
  combo,
  onFieldChange,
  onRemove,
  onImageUpload,
}: {
  title: string
  combo: PromoCard
  onFieldChange: (field: keyof PromoCard, value: string) => void
  onRemove: () => void
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="editor-card">
      <div className="editor-card-header">
        <strong>{title}</strong>
        <button type="button" className="remove-link" onClick={onRemove}>
          Eliminar
        </button>
      </div>

      <div className="item-admin-grid">
        <div className="image-preview-frame small-preview">
          {combo.image ? <img src={combo.image} alt={combo.title} /> : <span>Sin imagen</span>}
        </div>

        <div className="stack-list tight">
          <div className="form-grid two-columns">
            <Field label="Titulo" value={combo.title} onChange={(value) => onFieldChange('title', value)} />
            <Field label="Precio" value={combo.price} onChange={(value) => onFieldChange('price', value)} />
          </div>

          <Field
            label="Descripcion"
            value={combo.description}
            onChange={(value) => onFieldChange('description', value)}
            multiline
          />

          <Field label="Etiqueta" value={combo.badge ?? ''} onChange={(value) => onFieldChange('badge', value)} />
          <Field label="Link de imagen" value={combo.image ?? ''} onChange={(value) => onFieldChange('image', value)} />
          <ImageUploadField title="Imagen del combo" image={combo.image ?? ''} onChange={onImageUpload} />
        </div>
      </div>
    </div>
  )
}

function ImageUploadField({
  title,
  image,
  onChange,
}: {
  title: string
  image: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  const hasPreparedImage = Boolean(image)

  return (
    <label className="upload-box">
      <span className="upload-title">{title}</span>
      <span className="upload-action">Elegir imagen</span>
      <input type="file" accept="image/*" onChange={onChange} />
      <span className={hasPreparedImage ? 'upload-success' : undefined}>
        {hasPreparedImage
          ? 'Imagen configurada. Si cambiaste la foto, guarda para todos.'
          : 'La vista previa cambia al elegir el archivo.'}
      </span>
    </label>
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
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  type?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  )
}

export default App
