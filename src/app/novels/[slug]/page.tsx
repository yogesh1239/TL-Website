import { getAllNovels, getNovel, getChapters } from '@/lib/content'
import { CoverImage } from '@/components/CoverImage'
import { ChapterListClient } from '@/components/ChapterListClient'

interface Props { params: { slug: string } }

export default function NovelPage({ params }: Props) {
  const novel = getNovel(params.slug)
  const chapters = getChapters(params.slug)

  return (
    <div>
      {/* Dark header band */}
      <div className="relative overflow-hidden px-6 py-16" style={{ background: 'linear-gradient(135deg, #110806 0%, #2a0f0a 50%, #0d0505 100%)' }}>
        {/* Radial glow */}
        <div className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }} />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-4 rounded-full opacity-40 blur-3xl" style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }} />
            <CoverImage
              src={novel.cover}
              slug={novel.slug}
              alt={novel.title}
              className="relative h-60 w-40 shadow-[0_32px_64px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.08]"
            />
          </div>
          <div className="flex-1 pb-1">
            <div className="flex flex-wrap gap-2 mb-4">
              {novel.genres.map(g => (
                <span key={g} className="border border-white/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  {g}
                </span>
              ))}
              <span className="border border-green-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-green-400/70 capitalize">
                {novel.status}
              </span>
            </div>
            <h1 className="font-playfair text-3xl font-bold leading-snug text-white md:text-4xl mb-4">
              {novel.title}
            </h1>
            <p className="text-[14px] leading-[1.85] text-white/50 max-w-xl">
              {novel.description}
            </p>
            <p className="mt-5 text-[11px] uppercase tracking-widest text-white/25 font-bold">
              {novel.totalChapters} chapters &nbsp;·&nbsp; Last updated {novel.updatedAt}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <ChapterListClient novelSlug={novel.slug} chapters={chapters} />
      </div>
    </div>
  )
}

export function generateStaticParams() {
  const novels = getAllNovels()
  return novels.map(n => ({ slug: n.slug }))
}
