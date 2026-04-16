import Link from 'next/link'
import { SearchDropdown } from './SearchDropdown'
import { ThemeToggle } from './ThemeToggle'
import { getAllNovels, getChapters } from '@/lib/content'
import { buildSearchIndex } from '@/lib/search'

export async function Navbar() {
  const novels = getAllNovels()
  const chaptersMap: Record<string, any[]> = {}
  for (const novel of novels) {
    chaptersMap[novel.slug] = getChapters(novel.slug)
  }
  const index = buildSearchIndex(novels, chaptersMap)

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/85 dark:bg-bg-dark/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-playfair text-[22px] font-black tracking-tight text-gray-900 dark:text-white"
        >
          Lore<span className="text-accent">Press</span>
        </Link>

        <div className="h-4 w-px bg-border mx-0.5" />

        <div className="flex items-center gap-0 text-[11px] font-black uppercase tracking-[0.16em] text-muted">
          <Link href="/novels" className="px-3 py-1 hover:text-gray-900 dark:hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/novels?genre=fantasy" className="px-3 py-1 hover:text-gray-900 dark:hover:text-white transition-colors">
            Genres
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SearchDropdown searchIndex={index} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
