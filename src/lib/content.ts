import { defaultMenuContent, menuContentStorageKey, type MenuContent } from '../data/menu'

export function cloneDefaultContent() {
  return JSON.parse(JSON.stringify(defaultMenuContent)) as MenuContent
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
    const parsed = JSON.parse(raw) as MenuContent
    return parsed
  } catch {
    return cloneDefaultContent()
  }
}

export function saveStoredContent(content: MenuContent) {
  window.localStorage.setItem(menuContentStorageKey, JSON.stringify(content))
}

export function clearStoredContent() {
  window.localStorage.removeItem(menuContentStorageKey)
}
