const attemptsStore = globalThis.__poolEspanaLoginAttempts || new Map()
globalThis.__poolEspanaLoginAttempts = attemptsStore

function readPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function getRateLimitConfig() {
  return {
    maxAttempts: readPositiveInt(process.env.ADMIN_LOGIN_MAX_ATTEMPTS, 5),
    windowMs: readPositiveInt(process.env.ADMIN_LOGIN_WINDOW_MS, 10 * 60 * 1000),
    blockMs: readPositiveInt(process.env.ADMIN_LOGIN_BLOCK_MS, 15 * 60 * 1000),
  }
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for']

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim()
  }

  if (Array.isArray(forwardedFor) && forwardedFor[0]) {
    return forwardedFor[0]
  }

  return req.socket?.remoteAddress || 'unknown'
}

function getAttemptBucket(ipAddress) {
  const now = Date.now()
  const bucket = attemptsStore.get(ipAddress)

  if (!bucket) {
    return { attempts: [], blockedUntil: 0, updatedAt: now }
  }

  return {
    attempts: bucket.attempts.filter((timestamp) => now - timestamp <= getRateLimitConfig().windowMs),
    blockedUntil: bucket.blockedUntil,
    updatedAt: now,
  }
}

function saveAttemptBucket(ipAddress, bucket) {
  attemptsStore.set(ipAddress, bucket)
}

export function checkLoginRateLimit(req) {
  const { blockMs } = getRateLimitConfig()
  const ipAddress = getClientIp(req)
  const bucket = getAttemptBucket(ipAddress)
  const now = Date.now()

  if (bucket.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.blockedUntil - now) / 1000)),
    }
  }

  if (bucket.blockedUntil && bucket.blockedUntil <= now) {
    saveAttemptBucket(ipAddress, { attempts: bucket.attempts, blockedUntil: 0, updatedAt: now })
  }

  return {
    allowed: true,
    retryAfterSeconds: Math.max(1, Math.ceil(blockMs / 1000)),
  }
}

export function recordFailedLoginAttempt(req) {
  const { maxAttempts, blockMs, windowMs } = getRateLimitConfig()
  const ipAddress = getClientIp(req)
  const now = Date.now()
  const bucket = getAttemptBucket(ipAddress)
  const attempts = bucket.attempts.filter((timestamp) => now - timestamp <= windowMs)
  attempts.push(now)

  const blockedUntil = attempts.length >= maxAttempts ? now + blockMs : 0

  saveAttemptBucket(ipAddress, {
    attempts,
    blockedUntil,
    updatedAt: now,
  })

  return {
    blockedUntil,
    retryAfterSeconds: blockedUntil ? Math.max(1, Math.ceil((blockedUntil - now) / 1000)) : 0,
  }
}

export function clearFailedLoginAttempts(req) {
  attemptsStore.delete(getClientIp(req))
}
