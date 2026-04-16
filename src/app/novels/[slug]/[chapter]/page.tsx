import Link from 'next/link'
import { getAllNovels, getChapters, getChapter } from '@/lib/content'
import { ReaderTopBar } from '@/components/ReaderTopBar'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { SidebarDrawer } from '@/components/SidebarDrawer'
import { ReadingTracker } from '@/components/ReadingTracker'

interface Props { params: { slug: string; chapter: string } }

export default function ChapterPage({ params }: Props) {
  const chapter = getChapter(params.slug, params.chapter)
  const allChapters = getChapters(params.slug)

  return (
    <div data-font-size="default">
      <ReadingProgressBar />
      <ReadingTracker novelSlug={params.slug} chapterNum={chapter.chapter} />

      <ReaderTopBar
        novelSlug={params.slug}
        novelTitle={`← ${params.slug.replace(/-/g, ' ')}`}
        currentChapter={chapter}
        allChapters={allChapters}
      />

      <SidebarDrawer
        novelSlug={params.slug}
        chapters={allChapters}
        currentChapterNum={chapter.chapter}
      />

      <article className="mx-auto max-w-reader px-6 py-12">
        <p className="font-inter text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
          {params.slug.replace(/-/g, ' ')}
        </p>
        <h1 className="font-playfair text-3xl font-bold leading-snug text-gray-900 dark:text-white mb-2">
          {chapter.title}
        </h1>
        <p className="font-inter text-xs text-muted mb-10 pb-8 border-b border-border">
          Chapter {chapter.chapter} · {chapter.published}
        </p>

        <div
          className="prose-reader"
          dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
        />

        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-border pt-10">
          <div>
            {chapter.prevChapter && (
              <Link
                href={`/novels/${params.slug}/${chapter.prevChapter.slug}`}
                className="block rounded-lg border border-border bg-gray-50 dark:bg-gray-800 p-4 hover:border-accent transition-colors"
              >
                <p className="font-inter text-[10px] uppercase tracking-widest text-muted mb-1">← Previous</p>
                <p className="font-playfair text-sm font-semibold text-gray-900 dark:text-white">
                  {chapter.prevChapter.title}
                </p>
              </Link>
            )}
          </div>
          <div>
            {chapter.nextChapter && (
              <Link
                href={`/novels/${params.slug}/${chapter.nextChapter.slug}`}
                className="block rounded-lg bg-accent p-4 text-right hover:bg-accent/90 transition-colors"
              >
                <p className="font-inter text-[10px] uppercase tracking-widest text-white/70 mb-1">Next →</p>
                <p className="font-playfair text-sm font-semibold text-white">
                  {chapter.nextChapter.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export function generateStaticParams() {
  const novels = getAllNovels()
  const params: { slug: string; chapter: string }[] = []
  for (const novel of novels) {
    const chapters = getChapters(novel.slug)
    for (const ch of chapters) {
      params.push({ slug: novel.slug, chapter: ch.slug })
    }
  }
  return params
}
