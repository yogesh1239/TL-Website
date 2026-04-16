import { getAllNovels } from '@/lib/content'
import { GenreFilter } from '@/components/GenreFilter'

export default function NovelsPage() {
  const novels = getAllNovels()
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-2">Library</h1>
      <p className="text-sm text-muted mb-8">All available translations</p>
      <GenreFilter novels={novels} />
    </div>
  )
}
