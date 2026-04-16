'use client'
import { useEffect, useState } from 'react'
import { getReadCount } from '@/lib/progress'

export function NovelCardProgress({
  novelSlug,
  totalChapters,
}: {
  novelSlug: string
  totalChapters: number
}) {
  const [readCount, setReadCount] = useState(0)

  useEffect(() => {
    setReadCount(getReadCount(novelSlug))
  }, [novelSlug])

  const pct = totalChapters > 0 ? (readCount / totalChapters) * 100 : 0

  return (
    <>
      <p className="mt-1 text-[10px] text-muted">
        {readCount > 0 ? `${readCount}/${totalChapters} chapters read` : `${totalChapters} chapters`}
      </p>
      <div className="mt-2 h-0.5 rounded bg-border">
        <div
          className="h-full rounded bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </>
  )
}
