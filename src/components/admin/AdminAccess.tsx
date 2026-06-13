import { useEffect, useState } from 'react'
import type { MenuContent } from '../../data/menu'
import type { ContentStatus } from '../../types/ui'
import { AdminLogin } from './AdminLogin'
import { AdminPage } from './AdminPage'

export function AdminAccess({
  content,
  onContentChange,
  contentStatus,
}: {
  content: MenuContent
  onContentChange: (content: MenuContent) => void
  contentStatus: ContentStatus
}) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const response = await fetch('/api/admin-session', {
          method: 'GET',
          credentials: 'include',
        })

        if (!active) {
          return
        }

        setStatus(response.ok ? 'authenticated' : 'unauthenticated')
      } catch {
        if (active) {
          setStatus('unauthenticated')
        }
      }
    }

    void checkSession()

    return () => {
      active = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="admin-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker">Admin protegido</p>
          <h1>Verificando acceso</h1>
          <p className="auth-help">Un momento mientras validamos la sesión.</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <AdminLogin onSuccess={() => setStatus('authenticated')} />
  }

  if (contentStatus === 'loading') {
    return (
      <div className="admin-shell auth-shell">
        <div className="auth-card">
          <p className="section-kicker">Admin protegido</p>
          <h1>Cargando menú central</h1>
          <p className="auth-help">Estamos preparando la última versión antes de editar.</p>
        </div>
      </div>
    )
  }

  return (
    <AdminPage
      content={content}
      onContentChange={onContentChange}
      onLogout={() => setStatus('unauthenticated')}
      contentStatus={contentStatus}
    />
  )
}
