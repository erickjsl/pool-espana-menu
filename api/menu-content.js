import { ensureAuthorized, readMenuContent, writeMenuContent } from './_menu-storage.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const content = await readMenuContent()
      res.status(200).json({ content })
      return
    } catch {
      res.status(500).json({ message: 'No se pudo cargar el menu central.' })
      return
    }
  }

  if (req.method === 'POST') {
    try {
      ensureAuthorized(req)
      const content = req.body?.content

      if (!content) {
        res.status(400).json({ message: 'Contenido invalido.' })
        return
      }

      const savedContent = await writeMenuContent(content)
      res.status(200).json({ content: savedContent })
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el menu central.'
      const statusCode = typeof error === 'object' && error && 'statusCode' in error ? error.statusCode : 500
      res.status(statusCode).json({ message })
      return
    }
  }

  res.status(405).json({ message: 'Metodo no permitido.' })
}
