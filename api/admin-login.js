import { buildSessionCookie, createSessionToken } from './_auth.js'
import { checkLoginRateLimit, clearFailedLoginAttempts, recordFailedLoginAttempt } from './_rate-limit.js'

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

  const limitStatus = checkLoginRateLimit(req)

  if (!limitStatus.allowed) {
    res.setHeader('Retry-After', String(limitStatus.retryAfterSeconds))
    res.status(429).json({ message: 'Demasiados intentos. Espera un momento e intenta de nuevo.' })
    return
  }

  const { username = '', password = '' } = req.body || {}

  if (username !== expectedUsername || password !== expectedPassword) {
    const failedAttempt = recordFailedLoginAttempt(req)

    if (failedAttempt.retryAfterSeconds) {
      res.setHeader('Retry-After', String(failedAttempt.retryAfterSeconds))
    }

    res.status(401).json({ message: 'Usuario o contrasena incorrectos.' })
    return
  }

  clearFailedLoginAttempts(req)

  const token = createSessionToken(username)
  res.setHeader('Set-Cookie', buildSessionCookie(token))
  res.status(200).json({ ok: true })
}
