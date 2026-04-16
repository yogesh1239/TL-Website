'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { searchIndex } from '@/lib/search'
import type { SearchItem } from '@/types'

export function SearchDropdown({ searchIndex: index }: { searchIndex: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setResults(searchIndex(index, query))
    setOpen(query.length > 0)
  }, [query, index])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (mobileOpen) mobileInputRef.current?.focus()
  }, [mobileOpen])

  const resultsList = (extraCls = '') => (
    <>
      {open && results.length > 0 && (
        <div className={`absolute right-0 top-10 z-50 w-72 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl overflow-hidden ${extraCls}`}>
          {results.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              onClick={() => { setQuery(''); setOpen(false); setMobileOpen(false) }}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${
                item.type === 'novel' ? 'text-accent dark:text-accent-gold' : 'text-muted'
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
        <div className={`absolute right-0 top-10 z-50 w-56 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl p-4 text-center ${extraCls}`}>
          <p className="text-xs text-muted">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </>
  )

  return (
    <div ref={ref} className="relative">
      {/* Desktop / >= sm: inline search field */}
      <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-800 px-3 py-1.5 w-48 focus-within:border-accent transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-muted outline-none"
        />
      </div>

      {/* Mobile: icon button that toggles a search field */}
      <button
        type="button"
        onClick={() => setMobileOpen(o => !o)}
        className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
        aria-label="Toggle search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>

      {mobileOpen && (
        <div className="sm:hidden absolute right-0 top-10 z-50 w-64 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl p-2">
          <div className="flex items-center gap-2 rounded border border-border bg-gray-50 dark:bg-gray-800 px-3 py-1.5 focus-within:border-accent transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-muted outline-none"
            />
          </div>
        </div>
      )}

      {resultsList()}
    </div>
  )
}
