import crypto from 'node:crypto'

const COOKIE_NAME = 'pool_espana_admin'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'pool-espana-secret'
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex')
}

export function createSessionToken(username) {
  const payload = {
    username,
    exp: Date.now() + SESSION_DURATION_MS,
  }

  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = sign(encoded)
  return `${encoded}.${signature}`
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) {
    return null
  }

  const [encoded, signature] = token.split('.')

  if (!encoded || !signature) {
    return null
  }

  const expected = sign(encoded)
  const isValid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

  if (!isValid) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))

    if (!payload?.exp || payload.exp < Date.now()) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function getCookieValue(req, cookieName = COOKIE_NAME) {
  const raw = req.headers.cookie || ''
  const parts = raw.split(';').map((part) => part.trim())
  const match = parts.find((part) => part.startsWith(`${cookieName}=`))
  return match ? decodeURIComponent(match.slice(cookieName.length + 1)) : ''
}

export function buildSessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 12}`
}

export function buildClearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`
}

export function isAuthorized(req) {
  const token = getCookieValue(req)
  return Boolean(verifySessionToken(token))
}
