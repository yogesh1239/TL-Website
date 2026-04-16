'use client'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function NavbarShell({ children }: { children: ReactNode }) {
  const path = usePathname()
  // /novels/<slug>/<chapter> has 3 non-empty segments
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 3 && segments[0] === 'novels') return null
  return <>{children}</>
}
