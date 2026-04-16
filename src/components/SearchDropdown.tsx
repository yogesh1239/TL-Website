'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { searchIndex } from '@/lib/search'
import type { SearchItem } from '@/types'

export function SearchDropdown({ searchIndex: index }: { searchIndex: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setResults(searchIndex(index, query))
    setOpen(query.length > 0)
  }, [query, index])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-800 px-3 py-1.5 w-48 focus-within:border-accent transition-colors">
        <span className="text-xs text-muted">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-muted outline-none"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {results.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              onClick={() => { setQuery(''); setOpen(false) }}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${
                item.type === 'novel' ? 'text-accent' : 'text-muted'
              }`}>
                {item.type === 'novel' ? 'Novel' : `Ch.${item.title.match(/Ch\.\s*(\d+)/)?.[1] ?? ''}`}
              </span>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white leading-snug">
                  {item.type === 'novel' ? item.title : item.title.replace(/^Ch\.\s*\d+\s*—\s*/, '')}
                </p>
                {item.type === 'chapter' && (
                  <p className="text-[10px] text-muted">{item.novelTitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && results.length === 0 && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl p-4 text-center">
          <p className="text-xs text-muted">No results for "{query}"</p>
        </div>
      )}
    </div>
  )
}
