import { getAllNovels, getChapters } from '@/lib/content'
import { HeroBanner } from '@/components/HeroBanner'
import { GenreFilter } from '@/components/GenreFilter'
import type { Chapter } from '@/types'

export default function HomePage() {
  const novels = getAllNovels()
  const firstChapters: Record<string, Chapter> = {}
  for (const novel of novels) {
    const ch = getChapters(novel.slug)[0]
    if (ch) firstChapters[novel.slug] = ch
  }

  return (
    <>
      {novels.length > 0 && <HeroBanner novels={novels} firstChapters={firstChapters} />}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-playfair text-[11px] font-bold uppercase tracking-[0.35em] text-muted whitespace-nowrap">
            ✦ &nbsp;Library
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <GenreFilter novels={novels} />
      </section>
    </>
  )
}
