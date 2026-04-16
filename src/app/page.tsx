import { getAllNovels } from '@/lib/content'
import { HeroBanner } from '@/components/HeroBanner'
import { GenreFilter } from '@/components/GenreFilter'

export default function HomePage() {
  const novels = getAllNovels()
  const featured = novels[0]

  return (
    <>
      {featured && <HeroBanner novel={featured} />}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-muted mb-6">
          All Novels
        </h2>
        <GenreFilter novels={novels} />
      </section>
    </>
  )
}
