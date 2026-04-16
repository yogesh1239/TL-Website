'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontControls } from './FontControls'
import { ThemeToggle } from './ThemeToggle'
import type { Chapter } from '@/types'

interface Props {
  novelSlug: string
  novelTitle: string
  currentChapter: Chapter
  allChapters: Chapter[]
}

export function ReaderTopBar({ novelSlug, novelTitle, currentChapter, allChapters }: Props) {
  const router = useRouter()

  return (
    <header className="sticky top-0.5 z-30 border-b border-border bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
      <div className="flex h-12 items-center gap-3 px-4">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-sidebar'))}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Open chapter list"
        >
          ☰
        </button>

        <Link
          href={`/novels/${novelSlug}`}
          className="hidden text-xs font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors sm:block truncate max-w-[140px]"
        >
          {novelTitle}
        </Link>

        <select
          className="flex-1 max-w-xs rounded border border-border bg-transparent px-2 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
          value={currentChapter.slug}
          onChange={e => router.push(`/novels/${novelSlug}/${e.target.value}`)}
        >
          {allChapters.map(ch => (
            <option key={ch.slug} value={ch.slug}>
              Ch. {ch.chapter} — {ch.title}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <FontControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
