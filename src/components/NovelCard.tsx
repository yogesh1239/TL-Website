import Link from 'next/link'
import { CoverImage } from './CoverImage'
import { NovelCardProgress } from './NovelCardProgress'
import type { Novel } from '@/types'

export function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link href={`/novels/${novel.slug}`} className="group block">
      {/* Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden shadow-md transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
        <CoverImage
          src={novel.cover}
          slug={novel.slug}
          alt={novel.title}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Description overlay on hover */}
        {novel.description && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="line-clamp-4 text-[11px] leading-snug text-white/80">
              {novel.description}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-2.5 pb-1">
        <p className="mb-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-accent dark:text-accent-gold">
          {novel.genres[0]}
        </p>
        <h3 className="font-playfair text-[13px] font-bold leading-snug text-gray-900 dark:text-white/90 line-clamp-2 transition-colors duration-200 group-hover:text-accent dark:group-hover:text-accent-gold">
          {novel.title}
        </h3>
        <NovelCardProgress novelSlug={novel.slug} totalChapters={novel.totalChapters} />
      </div>
    </Link>
  )
}
