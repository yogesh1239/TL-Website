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
