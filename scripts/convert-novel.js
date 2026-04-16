#!/usr/bin/env node
/**
 * Convert a folder of Chapter NN - Title.txt files into Markdown chapters.
 *
 * Usage:
 *   node scripts/convert-novel.js --input "Zhui Xu/English" --slug zhui-xu
 *   node scripts/convert-novel.js --input "Slime/English" --slug slime-reincarnation [--date 2026-04-16]
 */

const fs = require('fs')
const path = require('path')

// Parse CLI args
const args = process.argv.slice(2)
function getArg(flag) {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : null
}

const inputArg = getArg('--input')
const slug = getArg('--slug')
const dateArg = getArg('--date') || new Date().toISOString().slice(0, 10)

if (!inputArg || !slug) {
  console.error('Usage: node scripts/convert-novel.js --input <path> --slug <novel-slug> [--date YYYY-MM-DD]')
  process.exit(1)
}

const INPUT_DIR = path.resolve(inputArg)
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'novels', slug, 'chapters')

if (!fs.existsSync(INPUT_DIR)) {
  console.error(`Input directory not found: ${INPUT_DIR}`)
  process.exit(1)
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const files = fs.readdirSync(INPUT_DIR)
  .filter(f => f.endsWith('.txt'))
  .filter(f => !fs.statSync(path.join(INPUT_DIR, f)).isDirectory())
  .sort()

let converted = 0
let skipped = 0

for (const file of files) {
  // Matches: "Chapter 01 - Some Title.txt" or "Chapter 01.txt"
  const match = file.match(/^Chapter\s+(\d+)(?:\s*[-:]\s*(.+))?\.txt$/i)
  if (!match) {
    console.warn(`⚠  Skipping (unrecognized filename): ${file}`)
    skipped++
    continue
  }

  const num = parseInt(match[1], 10)
  // Strip inline "Chapter NN: Subtitle -" prefix from the filename title if present
  const rawTitle = match[2]
    ? match[2].replace(/^Chapter\s+\d+\s*[-:]\s*/i, '').replace(/_/g, ' ').trim()
    : `Chapter ${num}`
  const title = rawTitle.replace(/"/g, '\\"')

  const chSlug = `ch-${String(num).padStart(3, '0')}`
  const outPath = path.join(OUTPUT_DIR, `${chSlug}.md`)

  if (fs.existsSync(outPath)) {
    console.log(`↷  Already exists, skipping: ${chSlug}.md`)
    skipped++
    continue
  }

  // Read content; strip any leading "Chapter NN: Title" heading line if present
  let content = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8').trim()
  // Remove a leading heading line that duplicates the chapter title (common in these files)
  content = content.replace(/^Chapter\s+\d+\s*[-:][^\n]*\n+/i, '').trim()

  const md = `---\ntitle: "${title}"\nchapter: ${num}\nnovel: ${slug}\npublished: ${dateArg}\n---\n\n${content}\n`
  fs.writeFileSync(outPath, md, 'utf-8')
  console.log(`✓  ${chSlug}.md  ←  ${file}`)
  converted++
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped.`)
