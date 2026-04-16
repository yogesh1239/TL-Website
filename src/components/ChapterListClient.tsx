'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/progress'
import type { Chapter } from '@/types'

const PER_PAGE_OPTIONS = [25, 50, 75, 100] as const
type PerPage = typeof PER_PAGE_OPTIONS[number]

export function ChapterListClient({
  novelSlug,
  chapters,
}: {
  novelSlug: string
  chapters: Chapter[]
}) {
  const [sortDesc, setSortDesc] = useState(true)
  const [lastChapter, setLastChapter] = useState<number | null>(null)
  const [perPage, setPerPage] = useState<PerPage>(50)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLastChapter(getLastChapter(novelSlug))
  }, [novelSlug])

  // Reset to page 1 when sort or perPage changes
  useEffect(() => { setPage(1) }, [sortDesc, perPage])

  const sorted = sortDesc ? [...chapters].reverse() : chapters
  const totalPages = Math.ceil(sorted.length / perPage)
  const pageChapters = sorted.slice((page - 1) * perPage, page * perPage)

  const pageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (page <= 4) return [1, 2, 3, 4, 5, '…', totalPages]
    if (page >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '…', page - 1, page, page + 1, '…', totalPages]
  }

  return (
    <div>
      {lastChapter !== null && (
        <Link
          href={`/novels/${novelSlug}/ch-${String(lastChapter).padStart(3, '0')}`}
          className="mb-6 flex items-center gap-3 border border-accent bg-accent/5 px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          <span>▶</span>
          <span>Continue Reading — Chapter {lastChapter}</span>
        </Link>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted">
          {chapters.length} chapters
        </p>
        <div className="flex items-center gap-4">
          {/* Per-page selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Show</span>
            {PER_PAGE_OPTIONS.map(n => (
              <button
                key={n}
                onClick={() => setPerPage(n)}
                className={`px-2 py-0.5 text-[11px] font-bold transition-colors ${
                  perPage === n
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {/* Sort toggle */}
          <button
            onClick={() => setSortDesc(d => !d)}
            className="text-[11px] font-bold text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {sortDesc ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>

      {/* Chapter rows */}
      <div className="divide-y divide-border border border-border overflow-hidden">
        {pageChapters.map(ch => (
          <Link
            key={ch.slug}
            href={`/novels/${novelSlug}/${ch.slug}`}
            className="group flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
          >
            <span className="w-10 flex-shrink-0 text-center text-[11px] font-black tracking-widest text-muted group-hover:text-accent transition-colors">
              {String(ch.chapter).padStart(3, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate group-hover:text-accent transition-colors">
                {ch.title}
              </p>
            </div>
            <span className="flex-shrink-0 text-[11px] text-muted">{ch.published}</span>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-[11px] font-bold text-muted hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          {pageNumbers().map((n, i) =>
            n === '…' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-muted text-[11px]">…</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n as number)}
                className={`min-w-[32px] px-2 py-1.5 text-[11px] font-bold transition-colors ${
                  page === n
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {n}
              </button>
            )
          )}

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-[11px] font-bold text-muted hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
