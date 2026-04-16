import { getAllNovels } from '@/lib/content'
import { HeroBanner } from '@/components/HeroBanner'
import { GenreFilter } from '@/components/GenreFilter'

export default function HomePage() {
  const novels = getAllNovels()
  const featured = novels[0]

  return (
    <>
      {featured && <HeroBanner novel={featured} />}
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
