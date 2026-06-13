import { useMemo, useState, type ChangeEvent, type DragEvent as ReactDragEvent, type ReactNode } from 'react'
import { type MenuContent, type MenuItem, type MenuSection, type PromoCard } from '../../data/menu'
import {
  clearStoredContent,
  cloneContent,
  cloneDefaultContent,
  saveRemoteContent,
  saveStoredContent,
  uploadRemoteImage,
} from '../../lib/content'
import type { ContentStatus } from '../../types/ui'
import { Field } from '../shared/Field'

const emptyPromo = (): PromoCard => ({
  title: 'Nuevo combo',
  description: 'Descripción breve.',
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

type DraggedItem = {
  sectionIndex: number
  itemIndex: number
}

type DraggedCombo = {
  comboIndex: number
}

type DraggedSection = {
  sectionIndex: number
}

export function AdminPage({
  content,
  onContentChange,
  onLogout,
  contentStatus,
}: {
  content: MenuContent
  onContentChange: (content: MenuContent) => void
  onLogout: () => void
  contentStatus: ContentStatus
}) {
  const [draft, setDraft] = useState<MenuContent>(() => cloneContent(content))
  const [status, setStatus] = useState('Panel listo para editar.')
  const [jsonMode, setJsonMode] = useState(false)
  const [editorValue, setEditorValue] = useState(() => JSON.stringify(content, null, 2))
  const [isSaving, setIsSaving] = useState(false)
  const [lastDraftBeforeReset, setLastDraftBeforeReset] = useState<MenuContent | null>(null)
  const [itemSearch, setItemSearch] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [draggedCombo, setDraggedCombo] = useState<DraggedCombo | null>(null)
  const [draggedSection, setDraggedSection] = useState<DraggedSection | null>(null)

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

  const normalizedItemSearch = normalizeText(itemSearch)

  const filteredSections = useMemo(() => {
    return draft.menuSections
      .map((section, sectionIndex) => {
        const sectionMatchesFilter = sectionFilter === 'all' || section.id === sectionFilter
        const sectionMeta = normalizeText(`${section.id} ${section.eyebrow} ${section.title} ${section.description}`)
        const sectionMatchesSearch = normalizedItemSearch.length === 0 || sectionMeta.includes(normalizedItemSearch)
        const items = section.items
          .map((item, itemIndex) => ({
            item,
            itemIndex,
            matches:
              sectionMatchesSearch ||
              normalizedItemSearch.length === 0 ||
              normalizeText(`${item.name} ${item.description ?? ''} ${item.price} ${item.badge ?? ''}`).includes(
                normalizedItemSearch,
              ),
          }))
          .filter(({ matches }) => matches)

        const isVisible =
          sectionMatchesFilter && (normalizedItemSearch.length === 0 || sectionMatchesSearch || items.length > 0)

        return {
          section,
          sectionIndex,
          items,
          isVisible,
        }
      })
      .filter((sectionEntry) => sectionEntry.isVisible)
  }, [draft.menuSections, normalizedItemSearch, sectionFilter])

  const visibleItemsCount = useMemo(
    () => filteredSections.reduce((total, section) => total + section.items.length, 0),
    [filteredSections],
  )

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

  function duplicateSectionItem(sectionIndex: number, itemIndex: number) {
    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      const items = [...menuSections[sectionIndex].items]
      const duplicatedItem = cloneContent(items[itemIndex])
      items.splice(itemIndex + 1, 0, duplicatedItem)
      menuSections[sectionIndex] = { ...menuSections[sectionIndex], items }
      return { ...current, menuSections }
    })

    setStatus('Ítem duplicado. Ajusta nombre, precio o imagen si es necesario.')
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

  function moveSectionItem(sectionIndex: number, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return
    }

    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      const items = [...menuSections[sectionIndex].items]
      const [movedItem] = items.splice(fromIndex, 1)
      items.splice(toIndex, 0, movedItem)
      menuSections[sectionIndex] = { ...menuSections[sectionIndex], items }
      return { ...current, menuSections }
    })
  }

  function handleItemDragStart(sectionIndex: number, itemIndex: number) {
    setDraggedItem({ sectionIndex, itemIndex })
    setStatus('Arrastrando ítem. Suéltalo sobre otro ítem de la misma categoría para reordenarlo.')
  }

  function handleItemDragOver(event: ReactDragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function handleItemDrop(sectionIndex: number, itemIndex: number) {
    if (!draggedItem) {
      return
    }

    if (draggedItem.sectionIndex !== sectionIndex) {
      setDraggedItem(null)
      setStatus('Por ahora, el arrastre funciona dentro de la misma categoría.')
      return
    }

    moveSectionItem(sectionIndex, draggedItem.itemIndex, itemIndex)
    setDraggedItem(null)
    setStatus('Orden del ítem actualizado en la categoría.')
  }

  function handleItemDragEnd() {
    setDraggedItem(null)
  }

  function addCombo() {
    updateDraft((current) => ({
      ...current,
      comboCards: [...current.comboCards, emptyPromo()],
    }))
  }

  function moveCombo(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return
    }

    updateDraft((current) => {
      const comboCards = [...current.comboCards]
      const [movedCombo] = comboCards.splice(fromIndex, 1)
      comboCards.splice(toIndex, 0, movedCombo)
      return { ...current, comboCards }
    })
  }

  function handleComboDragStart(comboIndex: number) {
    setDraggedCombo({ comboIndex })
    setStatus('Arrastrando combo. Suelta sobre otro combo para reordenar.')
  }

  function handleComboDrop(comboIndex: number) {
    if (!draggedCombo) {
      return
    }

    moveCombo(draggedCombo.comboIndex, comboIndex)
    setDraggedCombo(null)
    setStatus('Orden de combos actualizado.')
  }

  function handleComboDragEnd() {
    setDraggedCombo(null)
  }

  function removeCombo(index: number) {
    updateDraft((current) => ({
      ...current,
      comboCards: current.comboCards.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  function moveSection(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return
    }

    updateDraft((current) => {
      const menuSections = [...current.menuSections]
      const [movedSection] = menuSections.splice(fromIndex, 1)
      menuSections.splice(toIndex, 0, movedSection)
      return { ...current, menuSections }
    })
  }

  function handleSectionDragStart(sectionIndex: number) {
    setDraggedSection({ sectionIndex })
    setStatus('Arrastrando categoría. Suéltala sobre otra categoría para reordenarla.')
  }

  function handleSectionDrop(sectionIndex: number) {
    if (!draggedSection) {
      return
    }

    moveSection(draggedSection.sectionIndex, sectionIndex)
    setDraggedSection(null)
    setStatus('Orden de categorías actualizado.')
  }

  function handleSectionDragEnd() {
    setDraggedSection(null)
  }

  async function updateComboImageFile(index: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus(`Preparando imagen del combo: ${file.name}...`)
      const path = await uploadRemoteImage(file)
      updateCombo(index, 'image', path)
      setStatus('Imagen del combo optimizada y lista. Ahora solo falta guardar para todos.')
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
      setStatus('Imagen del producto optimizada y lista. Ahora solo falta guardar para todos.')
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
      setLastDraftBeforeReset(null)
      setStatus('Cambios guardados para todos los dispositivos.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el contenido central.'
      setStatus(message)
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      'Restaurar el original reemplazará el borrador actual por el contenido predeterminado. Podrás deshacerlo enseguida. ¿Deseas continuar?',
    )

    if (!confirmed) {
      return
    }

    setLastDraftBeforeReset(cloneContent(draft))
    const resetContent = cloneDefaultContent()
    clearStoredContent()
    setDraft(resetContent)
    onContentChange(resetContent)
    setEditorValue(JSON.stringify(resetContent, null, 2))
    setStatus('Contenido original cargado localmente. Si fue por error, usa Deshacer restauración antes de guardar.')
  }

  function handleUndoReset() {
    if (!lastDraftBeforeReset) {
      return
    }

    setDraft(lastDraftBeforeReset)
    onContentChange(lastDraftBeforeReset)
    setEditorValue(JSON.stringify(lastDraftBeforeReset, null, 2))
    setLastDraftBeforeReset(null)
    setStatus('Borrador anterior restaurado en el panel.')
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
      setLastDraftBeforeReset(null)
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
      setLastDraftBeforeReset(null)
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
          <p className="section-kicker">Admin fácil</p>
          <h1>Editar menú sin experiencia</h1>
          <p className="admin-note">
            Cambia textos, precios e imágenes con formularios simples. Cada producto ya puede
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
            No se pudo refrescar el contenido central. Estás editando la última copia disponible.
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
          {lastDraftBeforeReset ? (
            <button type="button" className="admin-button" onClick={handleUndoReset}>
              Deshacer restauración
            </button>
          ) : null}
        </div>

        <p className="admin-status" role="status" aria-live="polite">
          {status}
        </p>

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
                  isDragging={draggedCombo?.comboIndex === index}
                  onFieldChange={(field, value) => updateCombo(index, field, value)}
                  onMoveUp={() => moveCombo(index, Math.max(0, index - 1))}
                  onMoveDown={() => moveCombo(index, Math.min(draft.comboCards.length - 1, index + 1))}
                  onRemove={() => removeCombo(index)}
                  onImageUpload={(event) => updateComboImageFile(index, event)}
                  onDragStart={() => handleComboDragStart(index)}
                  onDragOver={handleItemDragOver}
                  onDrop={() => handleComboDrop(index)}
                  onDragEnd={handleComboDragEnd}
                  disableMoveUp={index === 0}
                  disableMoveDown={index === draft.comboCards.length - 1}
                />
              ))}
            </div>
            <button type="button" className="admin-button add-button" onClick={addCombo}>
              Agregar combo
            </button>
          </AdminCard>

          <AdminCard
            title="Categorías del menú"
            description="Busca, filtra, duplica y reordena ítems sin tocar el JSON."
          >
            <div className="admin-filter-bar">
              <Field
                id="admin-item-search"
                label="Buscar item"
                value={itemSearch}
                onChange={setItemSearch}
                placeholder="Ej.: corona, pizza, whisky..."
              />

              <label className="field">
                <span>Filtrar categoría</span>
                <select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}>
                  <option value="all">Todas las categorías</option>
                  {draft.menuSections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="admin-result-summary">
              {filteredSections.length} {filteredSections.length === 1 ? 'categoría visible' : 'categorías visibles'} ·{' '}
              {visibleItemsCount} {visibleItemsCount === 1 ? 'ítem encontrado' : 'ítems encontrados'}
            </p>

            <div className="stack-list">
              {filteredSections.map(({ section, sectionIndex, items }) => (
                <div
                  className={`editor-card ${draggedSection?.sectionIndex === sectionIndex ? 'dragging' : ''}`}
                  key={section.id}
                  draggable
                  onDragStart={() => handleSectionDragStart(sectionIndex)}
                  onDragOver={handleItemDragOver}
                  onDrop={() => handleSectionDrop(sectionIndex)}
                  onDragEnd={handleSectionDragEnd}
                >
                  <div className="editor-card-header">
                    <div>
                      <h3>{section.title}</h3>
                      <p>
                        {section.id} · {section.items.length} {section.items.length === 1 ? 'ítem' : 'ítems'}
                      </p>
                    </div>
                    <div className="item-actions">
                      <button
                        type="button"
                        className="subtle-action"
                        onClick={() => moveSection(sectionIndex, Math.max(0, sectionIndex - 1))}
                        disabled={sectionIndex === 0}
                        aria-label={`Mover categoría ${section.title} hacia arriba`}
                      >
                        Subir categoría
                      </button>
                      <button
                        type="button"
                        className="subtle-action"
                        onClick={() =>
                          moveSection(sectionIndex, Math.min(draft.menuSections.length - 1, sectionIndex + 1))
                        }
                        disabled={sectionIndex === draft.menuSections.length - 1}
                        aria-label={`Mover categoría ${section.title} hacia abajo`}
                      >
                        Bajar categoría
                      </button>
                      <button
                        type="button"
                        className="subtle-action drag-handle"
                        aria-label={`Arrastrar categoría ${section.title}`}
                      >
                        Arrastrar categoría
                      </button>
                      <button
                        type="button"
                        className="admin-button compact-action"
                        onClick={() => addSectionItem(sectionIndex)}
                      >
                        Agregar item
                      </button>
                    </div>
                  </div>

                  <div className="form-grid two-columns">
                    <Field
                      label="Título"
                      value={section.title}
                      onChange={(value) => updateSectionMeta(sectionIndex, 'title', value)}
                    />
                    <Field
                      label="Subtítulo pequeño"
                      value={section.eyebrow}
                      onChange={(value) => updateSectionMeta(sectionIndex, 'eyebrow', value)}
                    />
                  </div>

                  <Field
                    label="Descripción"
                    value={section.description}
                    onChange={(value) => updateSectionMeta(sectionIndex, 'description', value)}
                    multiline
                  />

                  <div className="stack-list">
                    {items.map(({ item, itemIndex }) => (
                      <div
                        className={`sub-editor-card ${draggedItem?.sectionIndex === sectionIndex && draggedItem?.itemIndex === itemIndex ? 'dragging' : ''}`}
                        key={`${section.id}-${itemIndex}`}
                        draggable
                        onDragStart={() => handleItemDragStart(sectionIndex, itemIndex)}
                        onDragOver={handleItemDragOver}
                        onDrop={() => handleItemDrop(sectionIndex, itemIndex)}
                        onDragEnd={handleItemDragEnd}
                      >
                        <div className="editor-card-header">
                          <strong>Item {itemIndex + 1}</strong>
                          <div className="item-actions">
                            <button
                              type="button"
                              className="subtle-action"
                              onClick={() => moveSectionItem(sectionIndex, itemIndex, Math.max(0, itemIndex - 1))}
                              disabled={itemIndex === 0}
                              aria-label={`Mover ${item.name} hacia arriba`}
                            >
                              Subir
                            </button>
                            <button
                              type="button"
                              className="subtle-action"
                              onClick={() =>
                                moveSectionItem(
                                  sectionIndex,
                                  itemIndex,
                                  Math.min(section.items.length - 1, itemIndex + 1),
                                )
                              }
                              disabled={itemIndex === section.items.length - 1}
                              aria-label={`Mover ${item.name} hacia abajo`}
                            >
                              Bajar
                            </button>
                            <button
                              type="button"
                              className="subtle-action"
                              onClick={() => duplicateSectionItem(sectionIndex, itemIndex)}
                              aria-label={`Duplicar ${item.name}`}
                            >
                              Duplicar
                            </button>
                            <button
                              type="button"
                              className="subtle-action drag-handle"
                              aria-label={`Arrastrar ${item.name}`}
                            >
                              Arrastrar
                            </button>
                            <button
                              type="button"
                              className="remove-link"
                              onClick={() => removeSectionItem(sectionIndex, itemIndex)}
                              aria-label={`Eliminar ${item.name}`}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>

                        <div className="item-admin-grid">
                          <div className="image-preview-frame small-preview">
                            {item.image ? (
                              <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                            ) : (
                              <span>Sin imagen</span>
                            )}
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
                              label="Descripción"
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

                  <button
                    type="button"
                    className="admin-button add-button"
                    onClick={() => addSectionItem(sectionIndex)}
                  >
                    Agregar item a {section.title}
                  </button>
                </div>
              ))}
            </div>
            {filteredSections.length === 0 ? (
              <div className="empty-admin-state">
                <strong>Sin resultados</strong>
                <p>Ajusta la búsqueda o cambia el filtro para volver a ver los ítems del menú.</p>
              </div>
            ) : null}
          </AdminCard>

          <details className="advanced-json">
            <summary>Modo avanzado JSON</summary>
            <p>Solo usa esto si ya sabes lo que estás haciendo.</p>
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
                aria-label="Editor JSON del menú"
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
  isDragging,
  onFieldChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  onImageUpload,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  disableMoveUp,
  disableMoveDown,
}: {
  title: string
  combo: PromoCard
  isDragging: boolean
  onFieldChange: (field: keyof PromoCard, value: string) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onDragStart: () => void
  onDragOver: (event: ReactDragEvent<HTMLDivElement>) => void
  onDrop: () => void
  onDragEnd: () => void
  disableMoveUp: boolean
  disableMoveDown: boolean
}) {
  return (
    <div
      className={`editor-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="editor-card-header">
        <strong>{title}</strong>
        <div className="item-actions">
          <button
            type="button"
            className="subtle-action"
            onClick={onMoveUp}
            disabled={disableMoveUp}
            aria-label={`Mover ${title} hacia arriba`}
          >
            Subir
          </button>
          <button
            type="button"
            className="subtle-action"
            onClick={onMoveDown}
            disabled={disableMoveDown}
            aria-label={`Mover ${title} hacia abajo`}
          >
            Bajar
          </button>
          <button type="button" className="subtle-action drag-handle" aria-label={`Arrastrar ${title}`}>
            Arrastrar
          </button>
          <button type="button" className="remove-link" onClick={onRemove} aria-label={`Eliminar ${title}`}>
            Eliminar
          </button>
        </div>
      </div>

      <div className="item-admin-grid">
        <div className="image-preview-frame small-preview">
          {combo.image ? <img src={combo.image} alt={combo.title} loading="lazy" decoding="async" /> : <span>Sin imagen</span>}
        </div>

        <div className="stack-list tight">
          <div className="form-grid two-columns">
            <Field label="Título" value={combo.title} onChange={(value) => onFieldChange('title', value)} />
            <Field label="Precio" value={combo.price} onChange={(value) => onFieldChange('price', value)} />
          </div>

          <Field
            label="Descripción"
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
          ? 'Imagen configurada y optimizada. Si cambiaste la foto, guarda para todos.'
          : 'La vista previa cambia al elegir el archivo y la imagen se optimiza antes de guardarla.'}
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

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
