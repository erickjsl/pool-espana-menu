import { buildClearSessionCookie } from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Metodo no permitido.' })
    return
  }

  res.setHeader('Set-Cookie', buildClearSessionCookie())
  res.status(200).json({ ok: true })
}
