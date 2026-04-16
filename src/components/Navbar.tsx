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
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-bg-dark border-border">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-playfair text-xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          LorePress
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium text-muted">
          <Link href="/novels" className="px-3 py-1 rounded hover:text-gray-900 dark:hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/novels?genre=fantasy" className="px-3 py-1 rounded hover:text-gray-900 dark:hover:text-white transition-colors">
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
