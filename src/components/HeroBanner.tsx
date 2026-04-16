'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { CoverImage } from './CoverImage'
import { ContinueReadingButton } from './ContinueReadingButton'
import type { Novel, Chapter } from '@/types'

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface HeroBannerProps {
  novels: Novel[]
  firstChapters: Record<string, Chapter | undefined>
}

export function HeroBanner({ novels, firstChapters }: HeroBannerProps) {
  const [shuffledNovels, setShuffledNovels] = useState<Novel[]>(() => fisherYatesShuffle([...novels]))
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    const len = shuffledNovels.length
    setActiveIndex(((index % len) + len) % len)
    // Reset timer by incrementing a key tracked via ref restart
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [shuffledNovels.length])

  useEffect(() => {
    if (isPaused || isHovered || shuffledNovels.length < 2) return
    timerRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % shuffledNovels.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, isHovered, shuffledNovels.length, activeIndex])

  // Re-shuffle on mount to ensure randomness after hydration
  useEffect(() => {
    setShuffledNovels(fisherYatesShuffle([...novels]))
    setActiveIndex(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const current = shuffledNovels[activeIndex] ?? novels[0]
  if (!current) return null
  const firstChapter = firstChapters[current.slug]
  const multi = shuffledNovels.length >= 2

  return (
    <section
      className="relative overflow-hidden px-6 py-20"
      style={{ background: 'linear-gradient(135deg, #110806 0%, #2a0f0a 40%, #1a0808 70%, #0d0505 100%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

      {/* Pause/play toggle */}
      {multi && (
        <button
          className="absolute right-6 top-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all"
          onClick={() => setIsPaused(p => !p)}
          aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
        >
          {isPaused ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </button>
      )}

      {/* Left chevron */}
      {multi && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous novel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right chevron */}
      {multi && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/40 hover:text-white transition-all"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next novel"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div key={activeIndex} className="animate-fadein mx-auto flex max-w-7xl items-center gap-16">
        <div className="flex-1 min-w-0">
          {/* Label row */}
          <div className="flex items-center gap-3 mb-7">
            <div className="h-px w-10" style={{ background: 'linear-gradient(to right, #c9a96e, transparent)' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-gold">Featured Novel</span>
          </div>

          <h1 className="font-playfair text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-[3.5rem]">
            {current.title}
          </h1>

          {/* Meta row */}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-white/35 font-semibold">
            {current.genres.map((g, i) => (
              <span key={g} className="flex items-center gap-3">
                {g}
                {i < current.genres.length - 1 && <span className="opacity-40">·</span>}
              </span>
            ))}
            <span className="opacity-30 mx-1">|</span>
            <span className="capitalize">{current.status}</span>
            {current.totalChapters > 0 && (
              <>
                <span className="opacity-30 mx-1">|</span>
                <span>{current.totalChapters} chapters</span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-[500px] text-[14.5px] leading-[1.9] text-white/55">
            {current.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            {firstChapter ? (
              <ContinueReadingButton
                novelSlug={current.slug}
                firstChapterSlug={firstChapter.slug}
                firstChapterNumber={firstChapter.chapter}
              />
            ) : (
              <Link
                href={`/novels/${current.slug}/ch-001`}
                className="group inline-flex items-center gap-2.5 bg-accent px-7 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-white hover:text-accent"
              >
                Start Reading
                <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
            <Link
              href={`/novels/${current.slug}`}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 underline-offset-4 transition-colors hover:text-white/80 hover:underline"
            >
              All chapters
            </Link>
          </div>

          {/* Dot indicators */}
          {multi && (
            <div className="mt-6 flex gap-2">
              {shuffledNovels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 w-6 rounded-full transition-colors ${i === activeIndex ? 'bg-accent-gold' : 'bg-white/15 hover:bg-white/30'}`}
                  aria-label={`Show novel ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block flex-shrink-0">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full opacity-50 blur-3xl" style={{ background: 'radial-gradient(circle, #c0392b 0%, transparent 70%)' }} />
            <CoverImage
              src={current.cover}
              slug={current.slug}
              alt={current.title}
              className="relative h-72 w-48 shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.07]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
