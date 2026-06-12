import { buildSessionCookie, createSessionToken } from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Metodo no permitido.' })
    return
  }

  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD

  if (!expectedUsername || !expectedPassword) {
    res.status(500).json({ message: 'Credenciales del admin no configuradas en Vercel.' })
    return
  }

  const { username = '', password = '' } = req.body || {}

  if (username !== expectedUsername || password !== expectedPassword) {
    res.status(401).json({ message: 'Usuario o contrasena incorrectos.' })
    return
  }

  const token = createSessionToken(username)
  res.setHeader('Set-Cookie', buildSessionCookie(token))
  res.status(200).json({ ok: true })
}
