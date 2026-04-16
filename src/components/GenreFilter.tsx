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
      <div className="flex flex-wrap gap-2 mb-8">
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setActive(genre)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === genre
                ? 'bg-accent text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map(novel => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </>
  )
}
