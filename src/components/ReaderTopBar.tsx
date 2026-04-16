'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontControls } from './FontControls'
import { ThemeToggle } from './ThemeToggle'
import type { ChapterWithContent } from '@/types'

interface Props {
  novelSlug: string
  novelTitle: string
  currentChapter: ChapterWithContent
}

export function ReaderTopBar({ novelSlug, novelTitle, currentChapter }: Props) {
  const router = useRouter()
  const { prevChapter, nextChapter } = currentChapter

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if ((document.activeElement as HTMLElement)?.isContentEditable) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft' && prevChapter) router.push(`/novels/${novelSlug}/${prevChapter.slug}`)
      if (e.key === 'ArrowRight' && nextChapter) router.push(`/novels/${novelSlug}/${nextChapter.slug}`)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [novelSlug, prevChapter, nextChapter, router])

  const btnCls =
    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-border text-muted ' +
    'transition-colors hover:text-gray-900 dark:hover:text-white hover:border-accent'

  return (
    <header className="sticky top-0.5 z-30 border-b border-border bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
      <div className="flex h-12 items-center gap-2 px-3 sm:px-4">

        <Link
          href="/"
          className="font-playfair text-[15px] sm:text-[17px] font-black tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
          aria-label="LorePress home"
        >
          Lore<span className="text-accent dark:text-accent-gold">Press</span>
        </Link>

        <div className="hidden sm:block h-4 w-px bg-border mx-0.5" />

        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-sidebar'))}
          className={btnCls}
          aria-label="Open chapter list"
        >
          ☰
        </button>

        <Link
          href={`/novels/${novelSlug}`}
          className="hidden text-xs font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors sm:block truncate max-w-[120px]"
        >
          {novelTitle}
        </Link>

        <div className="flex-1 min-w-0 px-2 text-center">
          <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
            <span className="text-muted">Ch. {currentChapter.chapter} —</span> {currentChapter.title}
          </p>
        </div>

        <div className="ml-auto hidden sm:flex items-center gap-2">
          <FontControls />
          <ThemeToggle />
        </div>

        {/* Mobile: only theme toggle in top bar; font controls reachable via sidebar */}
        <div className="sm:hidden flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
