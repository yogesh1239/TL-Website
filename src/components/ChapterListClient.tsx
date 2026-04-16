'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/progress'
import type { Chapter } from '@/types'

export function ChapterListClient({
  novelSlug,
  chapters,
}: {
  novelSlug: string
  chapters: Chapter[]
}) {
  const [sortDesc, setSortDesc] = useState(true)
  const [lastChapter, setLastChapter] = useState<number | null>(null)

  useEffect(() => {
    setLastChapter(getLastChapter(novelSlug))
  }, [novelSlug])

  const sorted = sortDesc ? [...chapters].reverse() : chapters

  return (
    <div>
      {lastChapter !== null && (
        <Link
          href={`/novels/${novelSlug}/ch-${String(lastChapter).padStart(3, '0')}`}
          className="mb-6 flex items-center gap-3 rounded-lg border border-accent bg-accent/5 px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          <span>▶</span>
          <span>Continue Reading — Chapter {lastChapter}</span>
        </Link>
      )}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{chapters.length} chapters</p>
        <button
          onClick={() => setSortDesc(d => !d)}
          className="text-xs text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {sortDesc ? '↓ Newest first' : '↑ Oldest first'}
        </button>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {sorted.map(ch => (
          <Link
            key={ch.slug}
            href={`/novels/${novelSlug}/${ch.slug}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div>
              <span className="text-xs text-muted mr-3">Ch. {ch.chapter}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{ch.title}</span>
            </div>
            <span className="text-xs text-muted">{ch.published}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
