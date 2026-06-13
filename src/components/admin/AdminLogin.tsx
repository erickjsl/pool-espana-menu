import { useState, type FormEvent } from 'react'
import { Field } from '../shared/Field'

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        setError(payload?.message ?? 'Usuario o contraseña incorrectos.')
        setLoading(false)
        return
      }

      onSuccess()
    } catch {
      setError('No se pudo iniciar sesión. Intenta de nuevo.')
      setLoading(false)
      return
    }

    setLoading(false)
  }

  return (
    <div className="admin-shell auth-shell">
      <section className="auth-card">
        <p className="section-kicker">Admin protegido</p>
        <h1>Acceso al panel</h1>
        <p className="auth-help">
          Ingresa usuario y contraseña para editar precios, textos e imágenes del menú.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Field label="Usuario" value={username} onChange={setUsername} />
          <Field label="Contraseña" value={password} onChange={setPassword} type="password" />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="admin-button primary auth-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar al admin'}
          </button>
        </form>
      </section>
    </div>
  )
}
