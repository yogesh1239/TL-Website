'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CoverImage } from './CoverImage'
import type { Chapter } from '@/types'

interface Props {
  novelSlug: string
  chapters: Chapter[]
  currentChapterNum: number
}

export function SidebarDrawer({ novelSlug, chapters, currentChapterNum }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-sidebar', handler)
    return () => document.removeEventListener('open-sidebar', handler)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-white dark:bg-bg-dark shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-playfair text-sm font-bold text-gray-900 dark:text-white">Chapters</span>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-gray-900 dark:hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <CoverImage
            src=""
            slug={novelSlug}
            alt={novelSlug}
            className="h-14 w-10 flex-shrink-0 rounded shadow"
          />
          <p className="font-playfair text-xs font-semibold text-gray-900 dark:text-white leading-snug capitalize">
            {novelSlug.replace(/-/g, ' ')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chapters.map(ch => (
            <Link
              key={ch.slug}
              href={`/novels/${novelSlug}/${ch.slug}`}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 border-l-2 px-4 py-2.5 transition-colors ${
                ch.chapter === currentChapterNum
                  ? 'border-accent bg-accent/5 text-accent'
                  : 'border-transparent text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-[10px] font-bold w-8 flex-shrink-0 text-center">
                {ch.chapter}
              </span>
              <span className="text-xs leading-snug line-clamp-2">{ch.title}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
