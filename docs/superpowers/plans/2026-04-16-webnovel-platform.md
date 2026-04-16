# Webnovel Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully static reading platform for webnovels using Next.js 14, with a literary aesthetic, Markdown-based content, and reader features (dark mode, font controls, progress tracking, search).

**Architecture:** Next.js 14 App Router with `output: 'export'` for fully static deployment on Vercel. All content is read from Markdown files at build time via `lib/content.ts`. Client-side features (dark mode, reading progress, search, sidebar) use `'use client'` components with localStorage persistence.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3, gray-matter, remark + remark-html + remark-gfm, next-themes, Jest + @testing-library/react

---

## File Map

```
src/
  types/index.ts                          ← Novel, Chapter, ChapterWithContent, SearchItem
  lib/
    content.ts                            ← getAllNovels, getNovel, getChapters, getChapter
    progress.ts                           ← localStorage: getLastChapter, markChapterRead, getReadChapters
    search.ts                             ← buildSearchIndex, searchIndex
    __tests__/
      fixtures/novels/test-novel/
        novel.md                          ← test fixture
        chapters/ch-001.md               ← test fixture
      content.test.ts
      search.test.ts
      progress.test.ts
  app/
    globals.css                           ← CSS custom properties for light/dark tokens
    layout.tsx                            ← root layout: fonts, ThemeProvider, Navbar, Footer
    page.tsx                              ← homepage (server)
    novels/
      page.tsx                            ← /novels listing (server)
      [slug]/
        page.tsx                          ← novel detail (server)
        [chapter]/
          page.tsx                        ← chapter reader (server)
  components/
    Navbar.tsx                            ← server: logo, nav links, SearchDropdown shell
    Footer.tsx                            ← server: logo, tagline, links
    HeroBanner.tsx                        ← server: hero section
    NovelCard.tsx                         ← server: cover, title, genre, chapter count
    CoverImage.tsx                        ← server: <img> with CSS gradient fallback
    GenreFilter.tsx                       ← CLIENT: filter pills
    NovelCardProgress.tsx                 ← CLIENT: reads localStorage, renders progress bar
    ChapterListClient.tsx                 ← CLIENT: sort toggle + chapter rows + Continue CTA
    ReaderTopBar.tsx                      ← CLIENT: back link, chapter dropdown, controls, ☰
    SidebarDrawer.tsx                     ← CLIENT: slide-in chapter list overlay
    ReadingProgressBar.tsx                ← CLIENT: scroll-position bar across top
    FontControls.tsx                      ← CLIENT: Compact/Default/Relaxed presets
    ThemeToggle.tsx                       ← CLIENT: light/dark toggle
    SearchDropdown.tsx                    ← CLIENT: search input + results dropdown
    ReadingTracker.tsx                    ← CLIENT: marks chapter read in localStorage on mount
content/
  novels/
    slime-reincarnation/
      novel.md
      chapters/
        ch-001.md  …  ch-103.md
scripts/
  convert-chapters.js                     ← one-time: converts Slime .txt → .md
next.config.ts
tailwind.config.ts
jest.config.ts
jest.setup.ts
```

---

### Task 1: Project Initialization

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `jest.config.ts`, `jest.setup.ts`

- [ ] **Step 1: Scaffold Next.js project**

Run from `F:\TL Website`:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```
Expected: Next.js project created with `src/app/`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Install content and theme dependencies**

```bash
npm install gray-matter remark remark-html remark-gfm next-themes
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-jest @types/jest
```

- [ ] **Step 3: Configure Next.js for static export**

Replace `next.config.ts` with:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
```

- [ ] **Step 4: Configure Jest**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Verify Next.js dev server starts**

```bash
npm run dev
```
Expected: Server starts at http://localhost:3000, default Next.js page loads.

- [ ] **Step 6: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with TypeScript, Tailwind, and Jest"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Configure Tailwind with design tokens**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: '#c0392b',
        'accent-gold': '#c9a96e',
        'bg-reader': '#faf7f2',
        'bg-dark': '#0f0d0b',
        border: '#e0d8ce',
        muted: '#8a8078',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        lora: ['var(--font-lora)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        reader: '680px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Set up CSS custom properties for theming**

Replace `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #ffffff;
  --bg-reader: #faf7f2;
  --text: #2c2c2c;
  --text-muted: #8a8078;
  --border: #e0d8ce;
  --accent: #c0392b;
  --accent-gold: #c9a96e;
}

.dark {
  --bg: #0f0d0b;
  --bg-reader: #0f0d0b;
  --text: #c0b090;
  --text-muted: #5a5040;
  --border: #1e1a16;
  --accent: #c9a96e;
  --accent-gold: #c9a96e;
}

body {
  background-color: var(--bg);
  color: var(--text);
  transition: background-color 0.2s, color 0.2s;
}

/* Reader prose styles */
.prose-reader p {
  font-family: var(--font-lora), Georgia, serif;
  font-size: 17.5px;
  line-height: 1.9;
  color: var(--text);
  margin-bottom: 1.25rem;
}

.prose-reader p em {
  font-style: italic;
}

.prose-reader hr {
  border: none;
  text-align: center;
  color: var(--text-muted);
  letter-spacing: 0.5em;
  margin: 1.75rem 0;
}

.prose-reader hr::after {
  content: '· · ·';
}

/* Font size presets applied via data attribute */
[data-font-size='compact'] .prose-reader p { font-size: 16px; line-height: 1.7; }
[data-font-size='default'] .prose-reader p { font-size: 17.5px; line-height: 1.9; }
[data-font-size='relaxed'] .prose-reader p { font-size: 19px; line-height: 2.1; }
```

- [ ] **Step 3: Verify styles compile**

```bash
npm run dev
```
Expected: No Tailwind errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: add design tokens, CSS custom properties for light/dark theming"
```

---

### Task 3: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types**

Create `src/types/index.ts`:
```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types for Novel, Chapter, and SearchItem"
```

---

### Task 4: Content Library

**Files:**
- Create: `src/lib/content.ts`
- Create: `src/lib/__tests__/fixtures/novels/test-novel/novel.md`
- Create: `src/lib/__tests__/fixtures/novels/test-novel/chapters/ch-001.md`
- Create: `src/lib/__tests__/fixtures/novels/test-novel/chapters/ch-002.md`
- Create: `src/lib/__tests__/content.test.ts`

- [ ] **Step 1: Create test fixtures**

Create `src/lib/__tests__/fixtures/novels/test-novel/novel.md`:
```markdown
---
title: "Test Novel"
slug: test-novel
cover: /covers/test-novel.jpg
status: ongoing
genres: [Fantasy, Action]
description: "A test novel for unit tests."
---
```

Create `src/lib/__tests__/fixtures/novels/test-novel/chapters/ch-001.md`:
```markdown
---
title: "The Beginning"
chapter: 1
novel: test-novel
published: 2026-01-01
---

This is the first chapter.

It has multiple paragraphs.
```

Create `src/lib/__tests__/fixtures/novels/test-novel/chapters/ch-002.md`:
```markdown
---
title: "The Journey"
chapter: 2
novel: test-novel
published: 2026-01-08
---

This is the second chapter.
```

- [ ] **Step 2: Write failing tests**

Create `src/lib/__tests__/content.test.ts`:
```typescript
import path from 'path'
import {
  getAllNovels,
  getNovel,
  getChapters,
  getChapter,
} from '../content'

const FIXTURES_DIR = path.join(__dirname, 'fixtures/novels')

describe('getAllNovels', () => {
  it('returns novels from the content directory', () => {
    const novels = getAllNovels(FIXTURES_DIR)
    expect(novels).toHaveLength(1)
    expect(novels[0].slug).toBe('test-novel')
    expect(novels[0].title).toBe('Test Novel')
    expect(novels[0].genres).toEqual(['Fantasy', 'Action'])
    expect(novels[0].totalChapters).toBe(2)
    expect(novels[0].latestChapter).toBe(2)
  })
})

describe('getNovel', () => {
  it('returns a single novel by slug', () => {
    const novel = getNovel('test-novel', FIXTURES_DIR)
    expect(novel.title).toBe('Test Novel')
    expect(novel.status).toBe('ongoing')
  })

  it('throws if novel does not exist', () => {
    expect(() => getNovel('missing-novel', FIXTURES_DIR)).toThrow()
  })
})

describe('getChapters', () => {
  it('returns chapters sorted by chapter number ascending', () => {
    const chapters = getChapters('test-novel', FIXTURES_DIR)
    expect(chapters).toHaveLength(2)
    expect(chapters[0].chapter).toBe(1)
    expect(chapters[1].chapter).toBe(2)
  })

  it('builds chapter slug from chapter number', () => {
    const chapters = getChapters('test-novel', FIXTURES_DIR)
    expect(chapters[0].slug).toBe('ch-001')
    expect(chapters[1].slug).toBe('ch-002')
  })
})

describe('getChapter', () => {
  it('returns chapter with rendered HTML content', () => {
    const chapter = getChapter('test-novel', 'ch-001', FIXTURES_DIR)
    expect(chapter.title).toBe('The Beginning')
    expect(chapter.contentHtml).toContain('<p>')
    expect(chapter.contentHtml).toContain('first chapter')
  })

  it('sets prevChapter and nextChapter correctly', () => {
    const ch1 = getChapter('test-novel', 'ch-001', FIXTURES_DIR)
    expect(ch1.prevChapter).toBeNull()
    expect(ch1.nextChapter?.chapter).toBe(2)

    const ch2 = getChapter('test-novel', 'ch-002', FIXTURES_DIR)
    expect(ch2.prevChapter?.chapter).toBe(1)
    expect(ch2.nextChapter).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npx jest src/lib/__tests__/content.test.ts --no-coverage
```
Expected: FAIL — `Cannot find module '../content'`

- [ ] **Step 4: Implement content library**

Create `src/lib/content.ts`:
```typescript
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
      published: data.published ?? '',
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
    published: data.published ?? '',
    slug: chapterSlugParam,
    contentHtml,
    prevChapter,
    nextChapter,
  }
}
```

- [ ] **Step 5: Run tests — expect them to pass**

```bash
npx jest src/lib/__tests__/content.test.ts --no-coverage
```
Expected: PASS — all 6 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts src/lib/__tests__/
git commit -m "feat: add content library with Markdown parsing and chapter navigation"
```

---

### Task 5: Search & Progress Libraries

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/lib/progress.ts`
- Create: `src/lib/__tests__/search.test.ts`
- Create: `src/lib/__tests__/progress.test.ts`

- [ ] **Step 1: Write failing search tests**

Create `src/lib/__tests__/search.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx jest src/lib/__tests__/search.test.ts --no-coverage
```
Expected: FAIL — `Cannot find module '../search'`

- [ ] **Step 3: Implement search library**

Create `src/lib/search.ts`:
```typescript
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
```

- [ ] **Step 4: Implement progress library**

Create `src/lib/progress.ts` (client-only, no test required — localStorage doesn't exist in Node):
```typescript
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
```

- [ ] **Step 5: Run search tests — expect pass**

```bash
npx jest src/lib/__tests__/search.test.ts --no-coverage
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/search.ts src/lib/progress.ts src/lib/__tests__/search.test.ts src/lib/__tests__/progress.test.ts
git commit -m "feat: add search index builder and reading progress localStorage helpers"
```

---

### Task 6: Seed Content

**Files:**
- Create: `content/novels/slime-reincarnation/novel.md`
- Create: `content/novels/slime-reincarnation/chapters/ch-001.md`
- Create: `content/novels/slime-reincarnation/chapters/ch-002.md`
- Create: `content/novels/slime-reincarnation/chapters/ch-103.md`

- [ ] **Step 1: Create novel metadata**

Create `content/novels/slime-reincarnation/novel.md`:
```markdown
---
title: "That Time I Got Reincarnated as a Slime"
slug: slime-reincarnation
cover: /covers/slime-reincarnation.jpg
status: ongoing
genres: [Fantasy, Isekai, Adventure]
description: "A lonely salaryman dies and wakes up as the most unassuming creature in a world of monsters and magic — a slime. But this slime has a gift for making friends and a knack for acquiring the most absurd abilities."
---
```

- [ ] **Step 2: Create 3 seed chapters with content from existing .txt files**

Copy the first paragraph of `Slime/English/Chapter 1 - I Already Told You, He's Super Brave.txt` into:

`content/novels/slime-reincarnation/chapters/ch-001.md`:
```markdown
---
title: "I Already Told You, He's Super Brave"
chapter: 1
novel: slime-reincarnation
published: 2026-01-01
---

(paste full content of Chapter 1 .txt here, converting any formatting to Markdown: *italics*, **bold**, --- for scene breaks)
```

Repeat for `ch-002.md` (Chapter 2) and `ch-103.md` (Chapter 103).

- [ ] **Step 3: Verify content library reads seed data**

```bash
node -e "const {getAllNovels} = require('./src/lib/content.ts'); console.log(getAllNovels())"
```

If TypeScript errors, run via ts-node:
```bash
npx ts-node -e "import {getAllNovels} from './src/lib/content'; console.log(JSON.stringify(getAllNovels(), null, 2))"
```
Expected: JSON output showing Slime novel with `totalChapters: 3`.

- [ ] **Step 4: Commit**

```bash
git add content/
git commit -m "feat: add Slime Reincarnation novel.md and 3 seed chapters"
```

---

### Task 7: Root Layout, Navbar & Footer

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Navbar.tsx`
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Set up root layout with fonts and ThemeProvider**

Replace `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Playfair_Display, Lora, Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LorePress — Webnovel Translations',
  description: 'High-quality fan translations of webnovels and light novels.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${lora.variable} ${inter.variable} font-inter antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Build Navbar**

Create `src/components/Navbar.tsx`:
```typescript
import Link from 'next/link'
import { SearchDropdown } from './SearchDropdown'
import { ThemeToggle } from './ThemeToggle'
import { getAllNovels } from '@/lib/content'
import { getChapters } from '@/lib/content'
import { buildSearchIndex } from '@/lib/search'

export async function Navbar() {
  const novels = getAllNovels()
  const chaptersMap: Record<string, any[]> = {}
  for (const novel of novels) {
    chaptersMap[novel.slug] = getChapters(novel.slug)
  }
  const searchIndex = buildSearchIndex(novels, chaptersMap)

  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-bg-dark border-border">
      <nav className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
        <Link
          href="/"
          className="font-playfair text-xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          LorePress
        </Link>

        <div className="flex items-center gap-1 text-sm font-medium text-muted">
          <Link href="/novels" className="px-3 py-1 rounded hover:text-gray-900 dark:hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/novels?genre=fantasy" className="px-3 py-1 rounded hover:text-gray-900 dark:hover:text-white transition-colors">
            Genres
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SearchDropdown searchIndex={searchIndex} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
```

- [ ] **Step 3: Build Footer**

Create `src/components/Footer.tsx`:
```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 text-center">
      <p className="font-playfair text-lg font-black text-gray-900 dark:text-white">
        LorePress
      </p>
      <p className="mt-1 text-sm text-muted">
        Fan translations · For readers, by readers
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <Link href="/novels" className="hover:text-accent transition-colors">Browse</Link>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Verify layout renders**

```bash
npm run dev
```
Open http://localhost:3000. Expected: Navbar with "LorePress" logo and nav links, footer visible. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "feat: add root layout with Google Fonts, ThemeProvider, Navbar, and Footer"
```

---

### Task 8: Homepage

**Files:**
- Create: `src/components/CoverImage.tsx`
- Create: `src/components/HeroBanner.tsx`
- Create: `src/components/NovelCard.tsx`
- Create: `src/components/NovelCardProgress.tsx`
- Create: `src/components/GenreFilter.tsx`
- Replace: `src/app/page.tsx`

- [ ] **Step 1: Build CoverImage with gradient fallback**

Create `src/components/CoverImage.tsx`:
```typescript
const GRADIENTS: Record<string, string> = {
  'slime-reincarnation': 'linear-gradient(160deg, #3d1c02, #8b4513 60%, #5c2d0a)',
  default: 'linear-gradient(160deg, #1a1a2e, #16213e 60%, #0f3460)',
}

interface Props {
  src: string
  slug: string
  alt: string
  className?: string
}

export function CoverImage({ src, slug, alt, className = '' }: Props) {
  const gradient = GRADIENTS[slug] ?? GRADIENTS.default
  // Use an <img> with an onError fallback via a client wrapper
  // For SSR-safe rendering, we always render the gradient div as base
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradient }}
      aria-label={alt}
    >
      {/* If a cover image exists it will overlay the gradient */}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Build HeroBanner**

Create `src/components/HeroBanner.tsx`:
```typescript
import Link from 'next/link'
import { CoverImage } from './CoverImage'
import type { Novel } from '@/types'

export function HeroBanner({ novel }: { novel: Novel }) {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-red-950 to-accent px-6 py-14">
      <div className="mx-auto flex max-w-7xl items-center gap-12">
        <div className="flex-1">
          <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            ✦ Featured
          </span>
          <h1 className="mt-4 font-playfair text-4xl font-bold leading-tight text-white md:text-5xl">
            {novel.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
            {novel.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/novels/${novel.slug}/ch-001`}
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90 transition-colors"
            >
              Start Reading
            </Link>
            <Link
              href={`/novels/${novel.slug}`}
              className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              View All Chapters →
            </Link>
          </div>
        </div>
        <CoverImage
          src={novel.cover}
          slug={novel.slug}
          alt={novel.title}
          className="hidden md:block h-56 w-40 flex-shrink-0 rounded-lg shadow-2xl"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Build NovelCard (server) + NovelCardProgress (client)**

Create `src/components/NovelCard.tsx`:
```typescript
import Link from 'next/link'
import { CoverImage } from './CoverImage'
import { NovelCardProgress } from './NovelCardProgress'
import type { Novel } from '@/types'

export function NovelCard({ novel }: { novel: Novel }) {
  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="group block rounded-lg border border-border bg-white dark:bg-gray-900 overflow-hidden hover:shadow-md transition-shadow"
    >
      <CoverImage
        src={novel.cover}
        slug={novel.slug}
        alt={novel.title}
        className="aspect-[2/3] w-full"
      />
      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">
          {novel.genres[0]}
        </p>
        <h3 className="font-playfair text-sm font-bold leading-snug text-gray-900 dark:text-white line-clamp-2">
          {novel.title}
        </h3>
        <NovelCardProgress novelSlug={novel.slug} totalChapters={novel.totalChapters} />
      </div>
    </Link>
  )
}
```

Create `src/components/NovelCardProgress.tsx`:
```typescript
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
```

- [ ] **Step 4: Build GenreFilter client component**

Create `src/components/GenreFilter.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { NovelCard } from './NovelCard'
import type { Novel } from '@/types'

export function GenreFilter({ novels }: { novels: Novel[] }) {
  const [active, setActive] = useState('All')

  const allGenres = ['All', ...Array.from(new Set(novels.flatMap(n => n.genres))).sort()]
  const filtered = active === 'All' ? novels : novels.filter(n => n.genres.includes(active))

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8">
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setActive(genre)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === genre
                ? 'bg-accent text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map(novel => (
          <NovelCard key={novel.slug} novel={novel} />
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 5: Build Homepage page**

Replace `src/app/page.tsx`:
```typescript
import { getAllNovels } from '@/lib/content'
import { HeroBanner } from '@/components/HeroBanner'
import { GenreFilter } from '@/components/GenreFilter'

export default function HomePage() {
  const novels = getAllNovels()
  const featured = novels[0] // first novel is featured; can make configurable later

  return (
    <>
      {featured && <HeroBanner novel={featured} />}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="font-inter text-xs font-bold uppercase tracking-widest text-muted mb-6">
          All Novels
        </h2>
        <GenreFilter novels={novels} />
      </section>
    </>
  )
}
```

- [ ] **Step 6: Check homepage in browser**

```bash
npm run dev
```
Open http://localhost:3000. Expected:
- Hero banner shows Slime Reincarnation
- Genre filter shows "All", "Fantasy", "Isekai", "Adventure"
- Novel grid shows the Slime card with gradient cover

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx src/components/
git commit -m "feat: add homepage with hero banner, novel grid, and genre filter"
```

---

### Task 9: Novel Detail Page

**Files:**
- Create: `src/app/novels/page.tsx`
- Create: `src/app/novels/[slug]/page.tsx`
- Create: `src/components/ChapterListClient.tsx`

- [ ] **Step 1: Build /novels listing page**

Create `src/app/novels/page.tsx`:
```typescript
import { getAllNovels } from '@/lib/content'
import { GenreFilter } from '@/components/GenreFilter'

export default function NovelsPage() {
  const novels = getAllNovels()
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white mb-2">Library</h1>
      <p className="text-sm text-muted mb-8">All available translations</p>
      <GenreFilter novels={novels} />
    </div>
  )
}

export function generateStaticParams() {
  return []
}
```

- [ ] **Step 2: Build ChapterListClient**

Create `src/components/ChapterListClient.tsx`:
```typescript
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getLastChapter } from '@/lib/progress'
import type { Chapter } from '@/types'

export function ChapterListClient({
  novelSlug,
  chapters,
}: {
  novelSlug: string
  chapters: Chapter[]
}) {
  const [sortDesc, setSortDesc] = useState(true)
  const [lastChapter, setLastChapter] = useState<number | null>(null)

  useEffect(() => {
    setLastChapter(getLastChapter(novelSlug))
  }, [novelSlug])

  const sorted = sortDesc ? [...chapters].reverse() : chapters

  return (
    <div>
      {/* Continue Reading CTA */}
      {lastChapter !== null && (
        <Link
          href={`/novels/${novelSlug}/ch-${String(lastChapter).padStart(3, '0')}`}
          className="mb-6 flex items-center gap-3 rounded-lg border border-accent bg-accent/5 px-5 py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          <span>▶</span>
          <span>Continue Reading — Chapter {lastChapter}</span>
        </Link>
      )}

      {/* Sort toggle */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{chapters.length} chapters</p>
        <button
          onClick={() => setSortDesc(d => !d)}
          className="text-xs text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {sortDesc ? '↓ Newest first' : '↑ Oldest first'}
        </button>
      </div>

      {/* Chapter list */}
      <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {sorted.map(ch => (
          <Link
            key={ch.slug}
            href={`/novels/${novelSlug}/${ch.slug}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div>
              <span className="text-xs text-muted mr-3">Ch. {ch.chapter}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{ch.title}</span>
            </div>
            <span className="text-xs text-muted">{ch.published}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Build novel detail page**

Create `src/app/novels/[slug]/page.tsx`:
```typescript
import { getAllNovels, getNovel, getChapters } from '@/lib/content'
import { CoverImage } from '@/components/CoverImage'
import { ChapterListClient } from '@/components/ChapterListClient'

interface Props { params: { slug: string } }

export default function NovelPage({ params }: Props) {
  const novel = getNovel(params.slug)
  const chapters = getChapters(params.slug)

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start mb-12">
        <CoverImage
          src={novel.cover}
          slug={novel.slug}
          alt={novel.title}
          className="h-72 w-48 flex-shrink-0 rounded-lg shadow-xl"
        />
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {novel.genres.map(g => (
              <span
                key={g}
                className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent"
              >
                {g}
              </span>
            ))}
            <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400 capitalize">
              {novel.status}
            </span>
          </div>
          <h1 className="font-playfair text-3xl font-bold text-gray-900 dark:text-white leading-snug mb-4">
            {novel.title}
          </h1>
          <p className="text-base leading-relaxed text-muted max-w-2xl">
            {novel.description}
          </p>
          <p className="mt-4 text-xs text-muted">
            {novel.totalChapters} chapters · Last updated {novel.updatedAt}
          </p>
        </div>
      </div>

      <ChapterListClient novelSlug={novel.slug} chapters={chapters} />
    </div>
  )
}

export function generateStaticParams() {
  const novels = getAllNovels()
  return novels.map(n => ({ slug: n.slug }))
}
```

- [ ] **Step 4: Test in browser**

```bash
npm run dev
```
Open http://localhost:3000/novels/slime-reincarnation. Expected:
- Cover gradient, title, genres, description visible
- Chapter list shows 3 seed chapters
- Sort toggle works (oldest/newest)

- [ ] **Step 5: Commit**

```bash
git add src/app/novels/ src/components/ChapterListClient.tsx
git commit -m "feat: add novel detail page with chapter list and continue-reading CTA"
```

---

### Task 10: Chapter Reader — Core

**Files:**
- Create: `src/app/novels/[slug]/[chapter]/page.tsx`
- Create: `src/components/ReadingTracker.tsx`

- [ ] **Step 1: Build ReadingTracker (side-effect component)**

Create `src/components/ReadingTracker.tsx`:
```typescript
'use client'
import { useEffect } from 'react'
import { markChapterRead } from '@/lib/progress'

export function ReadingTracker({ novelSlug, chapterNum }: { novelSlug: string; chapterNum: number }) {
  useEffect(() => {
    markChapterRead(novelSlug, chapterNum)
  }, [novelSlug, chapterNum])
  return null
}
```

- [ ] **Step 2: Build chapter reader page**

Create `src/app/novels/[slug]/[chapter]/page.tsx`:
```typescript
import Link from 'next/link'
import { getAllNovels, getChapters, getChapter } from '@/lib/content'
import { ReaderTopBar } from '@/components/ReaderTopBar'
import { ReadingProgressBar } from '@/components/ReadingProgressBar'
import { SidebarDrawer } from '@/components/SidebarDrawer'
import { ReadingTracker } from '@/components/ReadingTracker'

interface Props { params: { slug: string; chapter: string } }

export default function ChapterPage({ params }: Props) {
  const chapter = getChapter(params.slug, params.chapter)
  const allChapters = getChapters(params.slug)

  return (
    <div data-font-size="default">
      <ReadingProgressBar />
      <ReadingTracker novelSlug={params.slug} chapterNum={chapter.chapter} />

      <ReaderTopBar
        novelSlug={params.slug}
        novelTitle={`← ${chapter.novel.replace(/-/g, ' ')}`}
        currentChapter={chapter}
        allChapters={allChapters}
      />

      <SidebarDrawer
        novelSlug={params.slug}
        chapters={allChapters}
        currentChapterNum={chapter.chapter}
      />

      {/* Reading column */}
      <article className="mx-auto max-w-reader px-6 py-12">
        <p className="font-inter text-[10px] font-bold uppercase tracking-widest text-accent mb-3">
          {params.slug.replace(/-/g, ' ')}
        </p>
        <h1 className="font-playfair text-3xl font-bold leading-snug text-gray-900 dark:text-white mb-2">
          {chapter.title}
        </h1>
        <p className="font-inter text-xs text-muted mb-10 pb-8 border-b border-border">
          Chapter {chapter.chapter} · {chapter.published}
        </p>

        <div
          className="prose-reader"
          dangerouslySetInnerHTML={{ __html: chapter.contentHtml }}
        />

        {/* Chapter navigation */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-border pt-10">
          <div>
            {chapter.prevChapter && (
              <Link
                href={`/novels/${params.slug}/${chapter.prevChapter.slug}`}
                className="block rounded-lg border border-border bg-gray-50 dark:bg-gray-800 p-4 hover:border-accent transition-colors"
              >
                <p className="font-inter text-[10px] uppercase tracking-widest text-muted mb-1">← Previous</p>
                <p className="font-playfair text-sm font-semibold text-gray-900 dark:text-white">
                  {chapter.prevChapter.title}
                </p>
              </Link>
            )}
          </div>
          <div>
            {chapter.nextChapter && (
              <Link
                href={`/novels/${params.slug}/${chapter.nextChapter.slug}`}
                className="block rounded-lg bg-accent p-4 text-right hover:bg-accent/90 transition-colors"
              >
                <p className="font-inter text-[10px] uppercase tracking-widest text-white/70 mb-1">Next →</p>
                <p className="font-playfair text-sm font-semibold text-white">
                  {chapter.nextChapter.title}
                </p>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export function generateStaticParams() {
  const novels = getAllNovels()
  const params: { slug: string; chapter: string }[] = []
  for (const novel of novels) {
    const chapters = getChapters(novel.slug)
    for (const ch of chapters) {
      params.push({ slug: novel.slug, chapter: ch.slug })
    }
  }
  return params
}
```

- [ ] **Step 3: Check chapter reader in browser**

```bash
npm run dev
```
Open http://localhost:3000/novels/slime-reincarnation/ch-001. Expected:
- Chapter title and content render
- Prev/next nav visible at bottom (ch-001 shows only "Next →")

- [ ] **Step 4: Commit**

```bash
git add src/app/novels/[slug]/[chapter]/ src/components/ReadingTracker.tsx
git commit -m "feat: add chapter reader page with content rendering and prev/next navigation"
```

---

### Task 11: Reader Controls — TopBar, Sidebar, Progress Bar

**Files:**
- Create: `src/components/ReaderTopBar.tsx`
- Create: `src/components/SidebarDrawer.tsx`
- Create: `src/components/ReadingProgressBar.tsx`
- Create: `src/components/FontControls.tsx`
- Create: `src/components/ThemeToggle.tsx`

- [ ] **Step 1: Build ReadingProgressBar**

Create `src/components/ReadingProgressBar.tsx`:
```typescript
'use client'
import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-75"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Build ThemeToggle**

Create `src/components/ThemeToggle.tsx`:
```typescript
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" /> // SSR placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '☀' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 3: Build FontControls**

Create `src/components/FontControls.tsx`:
```typescript
'use client'
import { useState, useEffect } from 'react'

type Preset = 'compact' | 'default' | 'relaxed'
const PRESETS: Preset[] = ['compact', 'default', 'relaxed']
const STORAGE_KEY = 'reader:font-size'

export function FontControls() {
  const [preset, setPreset] = useState<Preset>('default')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Preset | null
    if (stored && PRESETS.includes(stored)) setPreset(stored)
  }, [])

  useEffect(() => {
    document.querySelector('[data-font-size]')?.setAttribute('data-font-size', preset)
    localStorage.setItem(STORAGE_KEY, preset)
  }, [preset])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-xs font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Aa
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 flex flex-col gap-1 rounded-lg border border-border bg-white dark:bg-gray-900 p-2 shadow-xl min-w-[120px]">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setPreset(p); setOpen(false) }}
              className={`rounded px-3 py-1.5 text-left text-xs capitalize transition-colors ${
                preset === p
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Build ReaderTopBar**

Create `src/components/ReaderTopBar.tsx`:
```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FontControls } from './FontControls'
import { ThemeToggle } from './ThemeToggle'
import type { Chapter } from '@/types'

interface Props {
  novelSlug: string
  novelTitle: string
  currentChapter: Chapter
  allChapters: Chapter[]
}

export function ReaderTopBar({ novelSlug, novelTitle, currentChapter, allChapters }: Props) {
  const router = useRouter()

  return (
    <header className="sticky top-0.5 z-30 border-b border-border bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
      <div className="flex h-12 items-center gap-3 px-4">
        {/* Sidebar trigger */}
        <button
          onClick={() => document.dispatchEvent(new CustomEvent('open-sidebar'))}
          className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Open chapter list"
        >
          ☰
        </button>

        {/* Back link */}
        <Link
          href={`/novels/${novelSlug}`}
          className="hidden text-xs font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors sm:block truncate max-w-[140px]"
        >
          {novelTitle}
        </Link>

        {/* Chapter selector */}
        <select
          className="flex-1 max-w-xs rounded border border-border bg-transparent px-2 py-1 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-accent"
          value={currentChapter.slug}
          onChange={e => router.push(`/novels/${novelSlug}/${e.target.value}`)}
        >
          {allChapters.map(ch => (
            <option key={ch.slug} value={ch.slug}>
              Ch. {ch.chapter} — {ch.title}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <FontControls />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 5: Build SidebarDrawer**

Create `src/components/SidebarDrawer.tsx`:
```typescript
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

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-white dark:bg-bg-dark shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="font-playfair text-sm font-bold text-gray-900 dark:text-white">Chapters</span>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-gray-900 dark:hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Novel cover + title */}
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

        {/* Chapter list */}
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
```

- [ ] **Step 6: Test reader controls in browser**

```bash
npm run dev
```
Open http://localhost:3000/novels/slime-reincarnation/ch-001. Verify:
- Progress bar fills as you scroll
- ☰ opens sidebar; Escape + backdrop click close it
- Active chapter is highlighted in sidebar
- Chapter dropdown navigates to selected chapter
- Aa opens font size picker, changing size updates text
- Dark mode toggle switches theme

- [ ] **Step 7: Commit**

```bash
git add src/components/ReaderTopBar.tsx src/components/SidebarDrawer.tsx src/components/ReadingProgressBar.tsx src/components/FontControls.tsx src/components/ThemeToggle.tsx
git commit -m "feat: add reader controls — progress bar, sidebar drawer, font picker, theme toggle"
```

---

### Task 12: Search

**Files:**
- Create: `src/components/SearchDropdown.tsx`

- [ ] **Step 1: Build SearchDropdown**

Create `src/components/SearchDropdown.tsx`:
```typescript
'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { searchIndex } from '@/lib/search'
import type { SearchItem } from '@/types'

export function SearchDropdown({ searchIndex: index }: { searchIndex: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchItem[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setResults(searchIndex(index, query))
    setOpen(query.length > 0)
  }, [query, index])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-800 px-3 py-1.5 w-48 focus-within:border-accent transition-colors">
        <span className="text-xs text-muted">🔍</span>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-900 dark:text-white placeholder:text-muted outline-none"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {results.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              onClick={() => { setQuery(''); setOpen(false) }}
              className="flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className={`mt-0.5 text-[10px] font-bold uppercase tracking-wide ${
                item.type === 'novel' ? 'text-accent' : 'text-muted'
              }`}>
                {item.type === 'novel' ? 'Novel' : `Ch.${item.title.match(/Ch\.\s*(\d+)/)?.[1] ?? ''}`}
              </span>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white leading-snug">
                  {item.type === 'novel' ? item.title : item.title.replace(/^Ch\.\s*\d+\s*—\s*/, '')}
                </p>
                {item.type === 'chapter' && (
                  <p className="text-[10px] text-muted">{item.novelTitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {open && results.length === 0 && (
        <div className="absolute right-0 top-10 z-50 w-56 rounded-lg border border-border bg-white dark:bg-gray-900 shadow-xl p-4 text-center">
          <p className="text-xs text-muted">No results for "{query}"</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Test search in browser**

```bash
npm run dev
```
Open http://localhost:3000. Type "slime" in search bar. Expected:
- Dropdown shows "Slime Reincarnation" novel result and matching chapter results
- Clicking a result navigates to the page and closes dropdown

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchDropdown.tsx
git commit -m "feat: add client-side search with dropdown results"
```

---

### Task 13: Chapter Migration Script

**Files:**
- Create: `scripts/convert-chapters.js`

- [ ] **Step 1: Write the migration script**

Create `scripts/convert-chapters.js`:
```javascript
const fs = require('fs')
const path = require('path')

const INPUT_DIR = path.join(__dirname, '..', 'Slime', 'English')
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'novels', 'slime-reincarnation', 'chapters')
const NOVEL_SLUG = 'slime-reincarnation'
const PUBLISH_DATE = '2026-04-16'

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const files = fs.readdirSync(INPUT_DIR)
  .filter(f => f.endsWith('.txt'))
  .filter(f => !fs.statSync(path.join(INPUT_DIR, f)).isDirectory())

let converted = 0
let skipped = 0

for (const file of files) {
  const match = file.match(/^Chapter\s+(\d+)(?:\s+-\s+(.+))?\.txt$/)
  if (!match) {
    console.warn(`⚠  Skipping (unrecognized format): ${file}`)
    skipped++
    continue
  }

  const num = parseInt(match[1], 10)
  const rawTitle = match[2] ? match[2].replace(/_/g, ' ') : `Chapter ${num}`
  // Escape quotes in title for YAML
  const title = rawTitle.replace(/"/g, '\\"')

  const content = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8').trim()
  const chSlug = `ch-${String(num).padStart(3, '0')}`
  const outPath = path.join(OUTPUT_DIR, `${chSlug}.md`)

  // Skip if already converted
  if (fs.existsSync(outPath)) {
    console.log(`↷  Already exists, skipping: ${chSlug}.md`)
    skipped++
    continue
  }

  const md = `---\ntitle: "${title}"\nchapter: ${num}\nnovel: ${NOVEL_SLUG}\npublished: ${PUBLISH_DATE}\n---\n\n${content}\n`
  fs.writeFileSync(outPath, md, 'utf-8')
  console.log(`✓  ${chSlug}.md  ←  ${file}`)
  converted++
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped.`)
```

- [ ] **Step 2: Run the migration script**

```bash
node scripts/convert-chapters.js
```
Expected output: ~103 lines like `✓  ch-001.md  ←  Chapter 1 - ....txt`

- [ ] **Step 3: Verify chapters appear on the site**

```bash
npm run dev
```
Open http://localhost:3000/novels/slime-reincarnation. Expected:
- Chapter list shows all 103 chapters
- Clicking any chapter loads its content

- [ ] **Step 4: Commit**

```bash
git add scripts/convert-chapters.js content/novels/slime-reincarnation/chapters/
git commit -m "feat: add chapter migration script and convert 103 Slime chapters to Markdown"
```

---

### Task 14: Git & Deployment Setup

**Files:**
- Create: `.gitignore`
- Create: `README.md`

- [ ] **Step 1: Verify .gitignore covers the right files**

Confirm `.gitignore` (created by `create-next-app`) includes:
```
.next/
out/
node_modules/
.env*
.superpowers/
```

If `.superpowers/` is not listed, add it:
```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 2: Do a full production build to catch any errors**

```bash
npm run build
```
Expected: Build succeeds, `out/` directory created with all static pages. Fix any TypeScript or build errors before continuing.

- [ ] **Step 3: Create GitHub repo and push**

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Connect to Vercel**

1. Go to https://vercel.com/new
2. Import the GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: `out` (set this manually since `output: 'export'` is used)
6. Click **Deploy**

Expected: Vercel builds and provides a live URL. Every subsequent `git push` to `main` triggers an automatic redeploy.

- [ ] **Step 5: Final end-to-end verification on live URL**

1. Homepage loads with hero banner and novel grid
2. Genre filter works (client-side)
3. Novel detail page shows all 103 chapters
4. Chapter reader shows content, progress bar scrolls, dark mode toggles, sidebar opens/closes
5. Search returns results
6. Add a new chapter `.md` file → `git push` → Vercel redeploys → new chapter appears

- [ ] **Step 6: Commit**

```bash
git add .gitignore
git commit -m "feat: configure deployment, verify production build passes"
```

---

## Self-Review

**Spec coverage:**
- [x] Multiple novels platform — GenreFilter, NovelCard, /novels listing
- [x] Next.js static export — `output: 'export'`, `generateStaticParams` on all dynamic routes
- [x] Markdown content + frontmatter — `lib/content.ts` with gray-matter
- [x] Homepage hero, genre filters, novel grid — Tasks 8
- [x] Novel detail page with chapter list + sort + continue CTA — Task 9
- [x] Chapter reader: cream bg, Lora font, 680px column — `globals.css`, `max-w-reader`
- [x] Reading progress bar (scroll) — `ReadingProgressBar.tsx`
- [x] Sidebar drawer (collapsible, not persistent) — `SidebarDrawer.tsx`
- [x] Dark mode toggle persisted — `ThemeToggle.tsx` + `next-themes`
- [x] Font size controls (3 presets) — `FontControls.tsx` + `data-font-size`
- [x] Reading progress tracker (localStorage) — `lib/progress.ts` + `ReadingTracker.tsx` + `NovelCardProgress.tsx`
- [x] Search — `lib/search.ts` + `SearchDropdown.tsx`
- [x] Genre tags from frontmatter — `novel.md` genres field
- [x] Chapter migration from .txt — `scripts/convert-chapters.js`
- [x] Git + Vercel deployment — Task 14
- [x] Cover art gradient fallback — `CoverImage.tsx`
