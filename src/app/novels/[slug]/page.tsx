import { getAllNovels, getNovel, getChapters } from '@/lib/content'
import { CoverImage } from '@/components/CoverImage'
import { ChapterListClient } from '@/components/ChapterListClient'

interface Props { params: { slug: string } }

export default function NovelPage({ params }: Props) {
  const novel = getNovel(params.slug)
  const chapters = getChapters(params.slug)

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-8 md:flex-row md:items-start mb-12">
        <CoverImage
          src={novel.cover}
          slug={novel.slug}
          alt={novel.title}
          className="h-72 w-48 flex-shrink-0 rounded-lg shadow-xl"
        />
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {novel.genres.map(g => (
              <span
                key={g}
                className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent"
              >
                {g}
              </span>
            ))}
            <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400 capitalize">
              {novel.status}
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            {novel.title}
          </h1>
          <p className="text-base leading-relaxed text-muted max-w-2xl">
            {novel.description}
          </p>
          <p className="mt-4 text-xs text-muted">
            {novel.totalChapters} chapters · Last updated {novel.updatedAt}
          </p>
        </div>
      </div>

      <ChapterListClient novelSlug={novel.slug} chapters={chapters} />
    </div>
  )
}

export function generateStaticParams() {
  const novels = getAllNovels()
  return novels.map(n => ({ slug: n.slug }))
}
