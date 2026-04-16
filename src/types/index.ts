export interface Novel {
  title: string
  slug: string
  cover: string          // path like /covers/slug.jpg — may not exist
  status: 'ongoing' | 'completed' | 'hiatus'
  genres: string[]
  description: string
  totalChapters: number  // populated by content.ts
  latestChapter: number  // populated by content.ts
  updatedAt: string      // ISO date of newest chapter
}

export interface Chapter {
  title: string
  chapter: number
  novel: string          // novel slug
  published: string      // ISO date string
  slug: string           // e.g. "ch-103"
}

export interface ChapterWithContent extends Chapter {
  contentHtml: string    // rendered HTML from Markdown
  prevChapter: Chapter | null
  nextChapter: Chapter | null
}

export interface SearchItem {
  type: 'novel' | 'chapter'
  novelSlug: string
  novelTitle: string
  title: string
  url: string
}
