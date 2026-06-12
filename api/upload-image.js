import crypto from 'node:crypto'
import { ensureAuthorized, uploadRepositoryFile } from './_menu-storage.js'

function getExtension(fileName = '', mimeType = '') {
  const lowerName = fileName.toLowerCase()

  if (lowerName.endsWith('.png') || mimeType.includes('png')) return 'png'
  if (lowerName.endsWith('.webp') || mimeType.includes('webp')) return 'webp'
  if (lowerName.endsWith('.gif') || mimeType.includes('gif')) return 'gif'
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || mimeType.includes('jpeg')) return 'jpg'

  return 'png'
}

function stripDataUrl(dataUrl) {
  return dataUrl.replace(/^data:[^;]+;base64,/, '')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Metodo no permitido.' })
    return
  }

  try {
    ensureAuthorized(req)

    const { fileName = 'image.png', mimeType = 'image/png', dataUrl = '' } = req.body || {}

    if (!dataUrl) {
      res.status(400).json({ message: 'Imagen invalida.' })
      return
    }

    const extension = getExtension(fileName, mimeType)
    const safeName = fileName.replace(/[^a-z0-9._-]/gi, '-').replace(/-+/g, '-').toLowerCase()
    const baseName = safeName.replace(/\.[^.]+$/, '')
    const uniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${baseName || 'image'}.${extension}`
    const filePath = `public/uploads/${uniqueName}`
    const content = stripDataUrl(dataUrl)

    await uploadRepositoryFile({
      filePath,
      content,
      message: `chore: upload menu image ${uniqueName}`,
    })

    res.status(200).json({ path: `/uploads/${uniqueName}` })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.'
    const statusCode = typeof error === 'object' && error && 'statusCode' in error ? error.statusCode : 500
    res.status(statusCode).json({ message })
  }
}
