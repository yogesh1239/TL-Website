'use client'
import { useState } from 'react'
import { NovelCard } from './NovelCard'
import type { Novel } from '@/types'

export function GenreFilter({ novels }: { novels: Novel[] }) {
  const [active, setActive] = useState('All')

  const allGenres = ['All', ...Array.from(new Set(novels.flatMap(n => n.genres))).sort()]
  const filtered = active === 'All' ? novels : novels.filter(n => n.genres.includes(active))

  return (
    <>
      <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-x-1 mb-10 border-b border-border pb-px">
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setActive(genre)}
            className={`relative px-2 sm:px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all duration-200 flex-shrink-0 ${
              active === genre
                ? 'text-accent dark:text-accent-gold border-b-2 border-accent dark:border-accent-gold -mb-px'
                : 'text-muted hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent -mb-px'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-3">
        {filtered.map(novel => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </>
  )
}
