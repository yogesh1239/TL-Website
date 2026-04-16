import Link from 'next/link'
import { CoverImage } from './CoverImage'
import type { Novel } from '@/types'

export function HeroBanner({ novel }: { novel: Novel }) {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-red-950 to-accent px-6 py-14">
      <div className="mx-auto flex max-w-7xl items-center gap-12">
        <div className="flex-1">
          <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            ✦ Featured
          </span>
          <h1 className="mt-4 font-playfair text-4xl font-bold leading-tight text-white md:text-5xl">
            {novel.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            {novel.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/novels/${novel.slug}/ch-001`}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors"
            >
              Start Reading
            </Link>
            <Link
              href={`/novels/${novel.slug}`}
              className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              View All Chapters →
            </Link>
          </div>
        </div>
        <CoverImage
          src={novel.cover}
          slug={novel.slug}
          alt={novel.title}
          className="hidden md:block h-56 w-40 flex-shrink-0 rounded-lg shadow-2xl"
        />
      </div>
    </section>
  )
}
