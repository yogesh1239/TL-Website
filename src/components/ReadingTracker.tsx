'use client'
import { useEffect } from 'react'
import { markChapterRead } from '@/lib/progress'

export function ReadingTracker({ novelSlug, chapterNum }: { novelSlug: string; chapterNum: number }) {
  useEffect(() => {
    markChapterRead(novelSlug, chapterNum)
  }, [novelSlug, chapterNum])
  return null
}
