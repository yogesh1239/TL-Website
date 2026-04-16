const KEY_LAST = (slug: string) => `progress:last:${slug}`
const KEY_READ = (slug: string) => `progress:read:${slug}`

export function getLastChapter(novelSlug: string): number | null {
  if (typeof window === 'undefined') return null
  const v = localStorage.getItem(KEY_LAST(novelSlug))
  return v ? parseInt(v, 10) : null
}

export function markChapterRead(novelSlug: string, chapterNum: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY_LAST(novelSlug), String(chapterNum))
  const existing = getReadChapters(novelSlug)
  existing.add(chapterNum)
  localStorage.setItem(KEY_READ(novelSlug), JSON.stringify([...existing]))
}

export function getReadChapters(novelSlug: string): Set<number> {
  if (typeof window === 'undefined') return new Set()
  const v = localStorage.getItem(KEY_READ(novelSlug))
  return v ? new Set(JSON.parse(v) as number[]) : new Set()
}

export function getReadCount(novelSlug: string): number {
  return getReadChapters(novelSlug).size
}
