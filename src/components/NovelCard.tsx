import Link from 'next/link'
import { CoverImage } from './CoverImage'
import { NovelCardProgress } from './NovelCardProgress'
import type { Novel } from '@/types'

export function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="group block rounded-lg border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow"
    >
      <CoverImage
        src={novel.cover}
        slug={novel.slug}
        alt={novel.title}
        className="aspect-[2/3] w-full"
      />
      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
          {novel.genres[0]}
        </p>
        <h3 className="font-playfair text-sm font-bold leading-snug text-gray-900 dark:text-white line-clamp-2">
          {novel.title}
        </h3>
        <NovelCardProgress novelSlug={novel.slug} totalChapters={novel.totalChapters} />
      </div>
    </Link>
  )
}
