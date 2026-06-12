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
  const response = await fetch('/api/menu', {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`No se pudo cargar el contenido central. HTTP ${response.status}`)
  }

  const payload = (await response.json()) as {
    content: MenuContent
  }

  saveStoredContent(payload.content)
  return payload.content
}

export async function saveRemoteContent(content: MenuContent) {
  const response = await fetch('/api/menu', {
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
    throw new Error(payload?.message ?? `No se pudo guardar el contenido central. HTTP ${response.status}`)
  }

  saveStoredContent(payload.content)
  return payload.content
}

export async function uploadRemoteImage(file: File) {
  const preparedFile = await prepareImageForUpload(file)
  const dataUrl = await fileToDataUrl(preparedFile)
  const response = await fetch('/api/upload-image', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: preparedFile.name,
      mimeType: preparedFile.type,
      dataUrl,
    }),
  })

  const payload = (await response.json().catch(() => null)) as
    | {
        path?: string
        message?: string
      }
    | null

  if (!response.ok || !payload?.path) {
    throw new Error(payload?.message ?? `No se pudo guardar la imagen. HTTP ${response.status}`)
  }

  return payload.path
}

async function prepareImageForUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen.')
  }

  if (file.type === 'image/gif' || file.type === 'image/webp') {
    return file
  }

  return compressImage(file)
}

function compressImage(file: File) {
  return new Promise<File>((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(url)

      const maxSize = 760
      const ratio = Math.min(1, maxSize / Math.max(image.width, image.height))
      const width = Math.max(1, Math.round(image.width * ratio))
      const height = Math.max(1, Math.round(image.height * ratio))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        reject(new Error('No se pudo preparar la imagen.'))
        return
      }

      canvas.width = width
      canvas.height = height
      context.drawImage(image, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('No se pudo comprimir la imagen.'))
            return
          }

          const name = file.name.replace(/\.[^.]+$/, '') || 'image'
          resolve(new File([blob], `${name}.jpg`, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.76,
      )
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen seleccionada.'))
    }

    image.src = url
  })
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}
