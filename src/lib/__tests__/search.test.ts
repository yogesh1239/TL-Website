import { buildSearchIndex, searchIndex } from '../search'
import type { Novel, Chapter } from '@/types'

const novels: Novel[] = [{
  title: 'Slime Reincarnation', slug: 'slime-reincarnation',
  cover: '', status: 'ongoing', genres: ['Fantasy'],
  description: '', totalChapters: 2, latestChapter: 2, updatedAt: '2026-01-01',
}]

const chapters: Record<string, Chapter[]> = {
  'slime-reincarnation': [
    { title: 'The Beginning', chapter: 1, novel: 'slime-reincarnation', published: '2026-01-01', slug: 'ch-001' },
    { title: 'Divine Skill', chapter: 2, novel: 'slime-reincarnation', published: '2026-01-08', slug: 'ch-002' },
  ],
}

describe('buildSearchIndex', () => {
  it('includes novels and chapters', () => {
    const index = buildSearchIndex(novels, chapters)
    expect(index).toHaveLength(3) // 1 novel + 2 chapters
    expect(index[0].type).toBe('novel')
    expect(index[1].type).toBe('chapter')
  })

  it('sets correct URLs', () => {
    const index = buildSearchIndex(novels, chapters)
    expect(index[0].url).toBe('/novels/slime-reincarnation')
    expect(index[1].url).toBe('/novels/slime-reincarnation/ch-001')
  })
})

describe('searchIndex', () => {
  it('finds novels by title', () => {
    const index = buildSearchIndex(novels, chapters)
    const results = searchIndex(index, 'slime')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].novelSlug).toBe('slime-reincarnation')
  })

  it('finds chapters by title', () => {
    const index = buildSearchIndex(novels, chapters)
    const results = searchIndex(index, 'divine')
    expect(results[0].title).toContain('Divine')
  })

  it('returns empty array for empty query', () => {
    const index = buildSearchIndex(novels, chapters)
    expect(searchIndex(index, '')).toHaveLength(0)
  })

  it('caps results at 8', () => {
    const bigIndex = Array.from({ length: 20 }, (_, i) => ({
      type: 'chapter' as const,
      novelSlug: 'test', novelTitle: 'test', title: 'chapter test',
      url: `/ch-${i}`,
    }))
    expect(searchIndex(bigIndex, 'test')).toHaveLength(8)
  })
})
