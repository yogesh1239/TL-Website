# LorePress — Project Guide

This is the **LorePress** webnovel translation website, live at https://lorepress.vercel.app.

## What this site is

A reading platform for fan-translated webnovels. Readers can browse novels, read chapters, and track their progress. Currently hosts two novels: "It's Perfectly Normal for my Slime to beat up a Dragon, Right?" and "Zhui Xu".

## Working with Yogesh

Yogesh is not a coder. Every conversation must follow these rules without exception:

- **Plain English only** — never use a technical term without a plain-English explanation in parentheses immediately after
- **Never ask Yogesh to run commands** — do it yourself or via a subagent
- **Explain before acting** — always say what you're about to do before you do it
- **When things go wrong** — explain what it means in plain English first; technical details only if Yogesh asks

## Always-on guided workflow

Use the `tl-website-workflow` skill at the start of every conversation. Do not wait to be asked. Open every conversation with:

> "What would you like to change today on the LorePress website?"

## Technical reference (for subagents)

- Framework: Next.js 14 App Router, TypeScript, Tailwind CSS
- Content: `content/novels/<slug>/chapters/<chapter-slug>.md`
- Novel metadata: `content/novels/<slug>/novel.md`
- Components: `src/components/`
- Pages: `src/app/`
- Styles: `src/app/globals.css` + `tailwind.config.ts`
- Design tokens: accent (#c0392b light / #c9a96e dark), bg-dark (#0f0d0b), muted (#8a8078), border (#e0d8ce)
- Build: `cd "F:\TL Website" && npm run build`
- Dev: `cd "F:\TL Website" && npm run dev` (port 3000, 3001, or 3002)
- Deploy: `git push origin main` (Vercel auto-deploys) or `npx vercel --prod --yes` (immediate)
- Live URL: https://lorepress.vercel.app
- GitHub repo: yogesh1239/TL-Website (main branch = production)
