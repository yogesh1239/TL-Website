import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import type { Novel, Chapter, ChapterWithContent } from '@/types'

const DEFAULT_CONTENT_DIR = path.join(process.cwd(), 'content/novels')

function chapterSlug(num: number): string {
  return `ch-${String(num).padStart(3, '0')}`
}

function parseChapterSlug(slug: string): number {
  return parseInt(slug.replace('ch-', ''), 10)
}

function parseNovelMd(slug: string, contentDir: string): Omit<Novel, 'totalChapters' | 'latestChapter' | 'updatedAt'> {
  const filePath = path.join(contentDir, slug, 'novel.md')
  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(fileContents)
  return {
    title: data.title,
    slug,
    cover: data.cover ?? '',
    status: data.status ?? 'ongoing',
    genres: data.genres ?? [],
    description: data.description ?? '',
  }
}

export function getAllNovels(contentDir: string = DEFAULT_CONTENT_DIR): Novel[] {
  const slugs = fs.readdirSync(contentDir).filter(f =>
    fs.statSync(path.join(contentDir, f)).isDirectory()
  )
  return slugs.map(slug => {
    const base = parseNovelMd(slug, contentDir)
    const chapters = getChapters(slug, contentDir)
    const sorted = [...chapters].sort((a, b) => a.chapter - b.chapter)
    return {
      ...base,
      totalChapters: chapters.length,
      latestChapter: sorted[sorted.length - 1]?.chapter ?? 0,
      updatedAt: sorted[sorted.length - 1]?.published ?? '',
    }
  })
}

export function getNovel(slug: string, contentDir: string = DEFAULT_CONTENT_DIR): Novel {
  const base = parseNovelMd(slug, contentDir)
  const chapters = getChapters(slug, contentDir)
  const sorted = [...chapters].sort((a, b) => a.chapter - b.chapter)
  return {
    ...base,
    totalChapters: chapters.length,
    latestChapter: sorted[sorted.length - 1]?.chapter ?? 0,
    updatedAt: sorted[sorted.length - 1]?.published ?? '',
  }
}

export function getChapters(slug: string, contentDir: string = DEFAULT_CONTENT_DIR): Chapter[] {
  const chaptersDir = path.join(contentDir, slug, 'chapters')
  const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md'))
  const chapters: Chapter[] = files.map(file => {
    const filePath = path.join(chaptersDir, file)
    const { data } = matter(fs.readFileSync(filePath, 'utf-8'))
    return {
      title: data.title,
      chapter: data.chapter,
      novel: slug,
      published: data.published instanceof Date
        ? data.published.toISOString().slice(0, 10)
        : (data.published ?? ''),
      slug: chapterSlug(data.chapter),
    }
  })
  return chapters.sort((a, b) => a.chapter - b.chapter)
}

export function getChapter(
  novelSlug: string,
  chapterSlugParam: string,
  contentDir: string = DEFAULT_CONTENT_DIR
): ChapterWithContent {
  const chapterNum = parseChapterSlug(chapterSlugParam)
  const filePath = path.join(contentDir, novelSlug, 'chapters', `${chapterSlugParam}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContents)

  const processedContent = remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .processSync(content)
  const contentHtml = processedContent.toString()

  const allChapters = getChapters(novelSlug, contentDir)
  const idx = allChapters.findIndex(c => c.chapter === chapterNum)
  const prevChapter = idx > 0 ? allChapters[idx - 1] : null
  const nextChapter = idx < allChapters.length - 1 ? allChapters[idx + 1] : null

  return {
    title: data.title,
    chapter: data.chapter,
    novel: novelSlug,
    published: data.published instanceof Date
      ? data.published.toISOString().slice(0, 10)
      : (data.published ?? ''),
    slug: chapterSlugParam,
    contentHtml,
    prevChapter,
    nextChapter,
  }
}
