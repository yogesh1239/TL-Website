import Link from 'next/link'
import { CoverImage } from './CoverImage'
import { ContinueReadingButton } from './ContinueReadingButton'
import type { Novel } from '@/types'
import type { Chapter } from '@/types'

interface HeroBannerProps {
  novel: Novel
  firstChapter?: Chapter
}

export function HeroBanner({ novel, firstChapter }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden px-6 py-20" style={{ background: 'linear-gradient(135deg, #110806 0%, #2a0f0a 40%, #1a0808 70%, #0d0505 100%)' }}>
      {/* Radial red glow left */}
      <div className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }} />
      {/* Radial warm glow right */}
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle at top right, #c9a96e 0%, transparent 70%)' }} />
      {/* Decorative corner lines */}
      <div className="pointer-events-none absolute right-0 top-0 opacity-[0.07]">
        <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0" x2="220" y2="0" stroke="#c9a96e" strokeWidth="1"/>
          <line x1="220" y1="0" x2="220" y2="220" stroke="#c9a96e" strokeWidth="1"/>
          <circle cx="220" cy="0" r="80" stroke="#c9a96e" strokeWidth="0.75" fill="none"/>
          <circle cx="220" cy="0" r="140" stroke="#c9a96e" strokeWidth="0.5" fill="none"/>
          <circle cx="220" cy="0" r="200" stroke="#c9a96e" strokeWidth="0.4" fill="none"/>
        </svg>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-16">
        <div className="flex-1 min-w-0">
          {/* Label row */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-10" style={{ background: 'linear-gradient(to right, #c9a96e, transparent)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">Featured Novel</span>
          </div>

          <h1 className="font-playfair text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-[3.5rem]">
            {novel.title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-white/35 font-semibold">
            {novel.genres.map((g, i) => (
              <span key={g} className="flex items-center gap-3">
                {g}
                {i < novel.genres.length - 1 && <span className="opacity-40">·</span>}
              </span>
            ))}
            <span className="opacity-30 mx-1">|</span>
            <span className="capitalize">{novel.status}</span>
            {novel.totalChapters > 0 && (
              <>
                <span className="opacity-30 mx-1">|</span>
                <span>{novel.totalChapters} chapters</span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-[500px] text-[14.5px] leading-[1.9] text-white/55">
            {novel.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            {firstChapter ? (
              <ContinueReadingButton
                novelSlug={novel.slug}
                firstChapterSlug={firstChapter.slug}
                firstChapterNumber={firstChapter.chapter}
              />
            ) : (
              <Link
                href={`/novels/${novel.slug}/ch-001`}
                className="group inline-flex items-center gap-2.5 bg-accent px-7 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-white hover:text-accent"
              >
                Start Reading
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
            <Link
              href={`/novels/${novel.slug}`}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
            >
              All chapters
            </Link>
          </div>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full opacity-50 blur-3xl" style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }} />
            <CoverImage
              src={novel.cover}
              slug={novel.slug}
              alt={novel.title}
              className="relative h-72 w-48 shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.07]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
