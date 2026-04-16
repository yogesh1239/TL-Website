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
  allChapters: { slug: string; chapter: number; title: string }[]
}

export function ReaderTopBar({ novelSlug, novelTitle, currentChapter, allChapters }: Props) {
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
    'flex h-10 w-10 items-center justify-center rounded border border-border text-muted ' +
    'transition-colors hover:text-gray-900 dark:hover:text-white hover:border-accent'

  return (
    <header className="sticky top-0.5 z-30 border-b border-border bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
      <div className="flex h-12 items-center gap-2 px-4">

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

        {prevChapter ? (
          <Link
            href={`/novels/${novelSlug}/${prevChapter.slug}`}
            className={btnCls}
            title={`← Ch. ${prevChapter.chapter}: ${prevChapter.title}`}
            aria-label={`Previous: ${prevChapter.title}`}
          >
            ‹
          </Link>
        ) : (
          <button className={btnCls} disabled aria-disabled="true" aria-label="No previous chapter" style={{ opacity: 0.3, cursor: 'default' }}>‹</button>
        )}

        <select
          className="w-auto max-w-[260px] min-w-0 rounded border border-border bg-transparent px-2 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
          value={currentChapter.slug}
          onChange={e => router.push(`/novels/${novelSlug}/${e.target.value}`)}
        >
          {allChapters.map(ch => (
            <option key={ch.slug} value={ch.slug}>
              Ch. {ch.chapter} — {ch.title}
            </option>
          ))}
        </select>

        {nextChapter ? (
          <Link
            href={`/novels/${novelSlug}/${nextChapter.slug}`}
            className={btnCls}
            title={`→ Ch. ${nextChapter.chapter}: ${nextChapter.title}`}
            aria-label={`Next: ${nextChapter.title}`}
          >
            ›
          </Link>
        ) : (
          <button className={btnCls} disabled aria-disabled="true" aria-label="No next chapter" style={{ opacity: 0.3, cursor: 'default' }}>›</button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <FontControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
