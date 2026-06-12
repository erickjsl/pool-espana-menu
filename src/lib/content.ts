import { defaultMenuContent, menuContentStorageKey, type MenuContent } from '../data/menu'

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultMenuContent)) as MenuContent
}

export function cloneContent<T>(value: T) {
  return JSON.parse(JSON.stringify(value)) as T
}

export function readStoredContent() {
  if (typeof window === 'undefined') {
    return cloneDefaultContent()
  }

  const raw = window.localStorage.getItem(menuContentStorageKey)

  if (!raw) {
    return cloneDefaultContent()
  }

  try {
    return JSON.parse(raw) as MenuContent
  } catch {
    return cloneDefaultContent()
  }
}

export function saveStoredContent(content: MenuContent) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(menuContentStorageKey, JSON.stringify(content))
}

export function clearStoredContent() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(menuContentStorageKey)
}

export async function fetchRemoteContent() {
  const response = await fetch('/api/menu-content', {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('No se pudo cargar el contenido central.')
  }

  const payload = (await response.json()) as {
    content: MenuContent
  }

  saveStoredContent(payload.content)
  return payload.content
}

export async function saveRemoteContent(content: MenuContent) {
  const response = await fetch('/api/menu-content', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })

  const payload = (await response.json().catch(() => null)) as
    | {
        content?: MenuContent
        message?: string
      }
    | null

  if (!response.ok || !payload?.content) {
    throw new Error(payload?.message ?? 'No se pudo guardar el contenido central.')
  }

  saveStoredContent(payload.content)
  return payload.content
}
