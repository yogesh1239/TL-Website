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

/**
 * Remove a leading heading line that duplicates the chapter title.
 * Handles:
 *   - ATX headings:    "# Chapter 1: Title"  /  "# Title"
 *   - Setext headings: "Chapter 1: Title\n========"
 *   - Plain repeated line: "Chapter 1: Title"
 * Followed setext underline (=== or ---) is also consumed.
 */
function stripLeadingDuplicateTitle(content: string, chapterNum: number, title: string): string {
  const lines = content.split(/\r?\n/)
  // Skip leading blank lines
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  if (i >= lines.length) return content

  const first = lines[i].replace(/^#+\s*/, '').trim()
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  const target1 = normalize(`chapter ${chapterNum} ${title}`)
  const target2 = normalize(title)
  const target3 = normalize(`chapter ${chapterNum}`)
  const firstNorm = normalize(first)

  const isDuplicate =
    firstNorm === target1 ||
    firstNorm === target2 ||
    (firstNorm.startsWith(target3) && firstNorm.includes(normalize(title)))

  if (!isDuplicate) return content

  // Drop the heading line
  lines.splice(i, 1)
  // If next line is a setext underline (=== or ---), drop it too
  if (i < lines.length && /^[=-]{3,}\s*$/.test(lines[i])) {
    lines.splice(i, 1)
  }
  return lines.join('\n')
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
    ...(data.author ? { author: data.author } : {}),
    ...(data.translator ? { translator: data.translator } : {}),
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

  const cleanedContent = stripLeadingDuplicateTitle(content, data.chapter, data.title)

  const processedContent = remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .processSync(cleanedContent)
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
