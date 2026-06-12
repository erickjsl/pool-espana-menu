import { isAuthorized } from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Metodo no permitido.' })
    return
  }

  if (!isAuthorized(req)) {
    res.status(401).json({ authenticated: false })
    return
  }

  res.status(200).json({ authenticated: true })
}
