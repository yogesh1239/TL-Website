'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/progress'

interface Props {
  novelSlug: string
  firstChapterSlug: string
  firstChapterNumber: number
}

export function ContinueReadingButton({ novelSlug, firstChapterSlug, firstChapterNumber }: Props) {
  const [href, setHref] = useState(`/novels/${novelSlug}/${firstChapterSlug}`)
  const [label, setLabel] = useState('Start Reading')

  useEffect(() => {
    const last = getLastChapter(novelSlug)
    if (last !== null && last > firstChapterNumber) {
      const padded = String(last).padStart(3, '0')
      setHref(`/novels/${novelSlug}/ch-${padded}`)
      setLabel(`Continue from Ch ${last}`)
    }
  }, [novelSlug, firstChapterSlug, firstChapterNumber])

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 bg-accent px-7 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-200 hover:bg-white hover:text-accent"
    >
      {label}
      <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  )
}
