import { useEffect, useState } from 'react'
import './App.css'
import type { MenuContent } from './data/menu'
import { fetchRemoteContent, readStoredContent } from './lib/content'
import type { ContentStatus } from './types/ui'
import { PublicPage } from './components/public/PublicPage'
import { AdminAccess } from './components/admin/AdminAccess'

function App() {
  const isAdminRoute =
    typeof window !== 'undefined' &&
    window.location.pathname.replace(/\/+$/, '') === '/admin'

  const [content, setContent] = useState<MenuContent>(() => readStoredContent())
  const [contentStatus, setContentStatus] = useState<ContentStatus>('idle')

  useEffect(() => {
    let active = true

    async function syncContent() {
      setContentStatus('loading')

      try {
        const remoteContent = await fetchRemoteContent()

        if (!active) {
          return
        }

        setContent(remoteContent)
        setContentStatus('idle')
      } catch {
        if (active) {
          setContentStatus('error')
        }
      }
    }

    void syncContent()

    return () => {
      active = false
    }
  }, [])

  if (isAdminRoute) {
    return <AdminAccess content={content} onContentChange={setContent} contentStatus={contentStatus} />
  }

  return <PublicPage content={content} contentStatus={contentStatus} />
}

export default App
