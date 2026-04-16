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
  const title = rawTitle.replace(/"/g, '\\"')

  const content = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8').trim()
  const chSlug = `ch-${String(num).padStart(3, '0')}`
  const outPath = path.join(OUTPUT_DIR, `${chSlug}.md`)

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
