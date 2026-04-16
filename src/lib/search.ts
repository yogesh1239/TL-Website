import type { Novel, Chapter, SearchItem } from '@/types'

export function buildSearchIndex(
  novels: Novel[],
  chapters: Record<string, Chapter[]>
): SearchItem[] {
  const items: SearchItem[] = []
  for (const novel of novels) {
    items.push({
      type: 'novel',
      novelSlug: novel.slug,
      novelTitle: novel.title,
      title: novel.title,
      url: `/novels/${novel.slug}`,
    })
    for (const ch of chapters[novel.slug] ?? []) {
      items.push({
        type: 'chapter',
        novelSlug: novel.slug,
        novelTitle: novel.title,
        title: `Ch. ${ch.chapter} — ${ch.title}`,
        url: `/novels/${novel.slug}/${ch.slug}`,
      })
    }
  }
  return items
}

export function searchIndex(items: SearchItem[], query: string): SearchItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return items
    .filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.novelTitle.toLowerCase().includes(q)
    )
    .slice(0, 8)
}
