import type { ImgHTMLAttributes } from 'react'

type AppImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean
}

export function AppImage({ priority = false, loading, decoding, fetchPriority, ...props }: AppImageProps) {
  return (
    <img
      {...props}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? 'async'}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
    />
  )
}
