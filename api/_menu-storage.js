import fs from 'node:fs/promises'
import path from 'node:path'
import { isAuthorized } from './_auth.js'

const FALLBACK_FILE_PATH = path.join(process.cwd(), 'content', 'menu-content.json')
const DEFAULT_REPO = 'erickjsl/pool-espana-menu'
const DEFAULT_BRANCH = 'main'
const DEFAULT_CONTENT_PATH = 'content/menu-content.json'

function getStorageConfig() {
  return {
    token: process.env.MENU_CONTENT_GITHUB_TOKEN || process.env.GITHUB_CONTENT_TOKEN || '',
    repo: process.env.MENU_CONTENT_GITHUB_REPO || DEFAULT_REPO,
    branch: process.env.MENU_CONTENT_GITHUB_BRANCH || DEFAULT_BRANCH,
    contentPath: process.env.MENU_CONTENT_GITHUB_PATH || DEFAULT_CONTENT_PATH,
  }
}

async function readFallbackContent() {
  const raw = await fs.readFile(FALLBACK_FILE_PATH, 'utf8')
  return JSON.parse(raw)
}

async function githubRequest(url, options = {}) {
  const { token } = getStorageConfig()
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'pool-espana-menu-admin',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

function buildContentsUrl() {
  const { repo, contentPath, branch } = getStorageConfig()
  return `https://api.github.com/repos/${repo}/contents/${contentPath}?ref=${branch}`
}

export async function readMenuContent() {
  try {
    const response = await githubRequest(buildContentsUrl(), { method: 'GET' })

    if (!response.ok) {
      throw new Error(`GitHub read failed with ${response.status}`)
    }

    const payload = await response.json()
    const decoded = Buffer.from(payload.content, 'base64').toString('utf8')
    return JSON.parse(decoded)
  } catch {
    return readFallbackContent()
  }
}

export async function writeMenuContent(content) {
  const { token, repo, branch, contentPath } = getStorageConfig()

  if (!token) {
    throw new Error('Falta configurar MENU_CONTENT_GITHUB_TOKEN en Vercel.')
  }

  const getResponse = await githubRequest(buildContentsUrl(), { method: 'GET' })

  if (!getResponse.ok) {
    throw new Error('No se pudo leer el archivo actual del menu en GitHub.')
  }

  const currentFile = await getResponse.json()
  const nextContent = JSON.stringify(content, null, 2)

  const putResponse = await githubRequest(`https://api.github.com/repos/${repo}/contents/${contentPath}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'chore: update menu content from admin panel',
      content: Buffer.from(nextContent, 'utf8').toString('base64'),
      sha: currentFile.sha,
      branch,
    }),
  })

  if (!putResponse.ok) {
    const payload = await putResponse.json().catch(() => null)
    throw new Error(payload?.message || 'No se pudo guardar el menu central en GitHub.')
  }

  return content
}

export function ensureAuthorized(req) {
  if (!isAuthorized(req)) {
    const error = new Error('No autorizado.')
    error.statusCode = 401
    throw error
  }
}
