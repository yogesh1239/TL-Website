# Guided Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a guided, always-on workflow system so a non-technical user can request changes conversationally and Claude handles everything — implementation, review, commit, and Vercel deploy.

**Architecture:** A project-level `CLAUDE.md` loads on every conversation and activates the `tl-website-workflow` skill. The skill orchestrates subagents for implementation, code review, and deployment, keeping the main conversation context clean and the user experience jargon-free.

**Tech Stack:** Claude Code skills (Markdown), GitHub CLI (`gh`), Vercel CLI (`npx vercel`)

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `F:\TL Website\CLAUDE.md` | Project context + always-on guided mode instructions |
| Create | `C:\Users\Yogesh\.claude\skills\tl-website-workflow\skill.md` | Full 7-phase workflow with subagent dispatch |
| GitHub setting | `yogesh1239/TL-Website` main branch | Remove branch protection so deploy agent can push directly |

---

### Task 1: Disable GitHub branch protection on main

**Files:** GitHub API only — no file changes

- [ ] **Step 1: Delete branch protection**

```bash
gh api repos/yogesh1239/TL-Website/branches/main/protection --method DELETE
```

Expected output: empty (204 No Content = success)

- [ ] **Step 2: Verify protection is gone**

```bash
gh api repos/yogesh1239/TL-Website/branches/main/protection 2>&1
```

Expected: error containing `404` or `"Branch not protected"`

---

### Task 2: Create the workflow skill file

**Files:**
- Create: `C:\Users\Yogesh\.claude\skills\tl-website-workflow\skill.md`

- [ ] **Step 1: Create skill directory and file**

Create `C:\Users\Yogesh\.claude\skills\tl-website-workflow\skill.md` with this exact content:

```markdown
# Forgotten Translations — Website Workflow

Use this skill at the start of EVERY conversation about the Forgotten Translations website.

## Phase 1: Requirements Gathering

Open with:
> "What would you like to change today on the Forgotten Translations website?"

Ask ONE follow-up question at a time until you know:
- What to add / change / fix (specific)
- Where it should appear (which page or section)
- How it should look or behave (if relevant)

Rules:
- One question at a time — never stack questions
- Plain English only — no technical terms
- If the request is already clear, skip to Phase 2

## Phase 2: Implementation (Subagent)

Say: "Got it! I'm going to make that change now — this will take a minute or two."

Dispatch an **implementation subagent** with these instructions:

> You are implementing a change for the Forgotten Translations webnovel website.
> Project root: F:\TL Website
> Framework: Next.js 14 App Router, TypeScript, Tailwind CSS
> Content: content/novels/<slug>/chapters/<chapter-slug>.md
> Build check: cd "F:\TL Website" && npm run build
>
> Task: [describe the exact change needed]
>
> Steps:
> 1. Implement the change
> 2. Run npm run build — if it fails, fix it once and retry
> 3. Report back: DONE (describe what you changed) or BLOCKED (plain-English explanation of what went wrong)
>
> Final response under 300 words. No code dumps — just outcomes.

If subagent reports BLOCKED: tell the user in plain English what went wrong. Ask if they want to try a different approach.
If subagent reports DONE: proceed to Phase 3.

## Phase 3: Local Preview

Start dev server if not already running:
```
cd "F:\TL Website" && npm run dev
```
Port is usually 3000, 3001, or 3002 (whichever is free).

Tell the user:
> "The change is ready! Open **http://localhost:[PORT]** in your browser and take a look."

Then ask guided check questions ONE AT A TIME based on what changed:
- "Can you see [the new element] on the [page name] page?"
- "Does it look right on mobile? (Try making your browser window narrow)"
- "When you click [button/link], does it do what you expected?"
- "Does it look right in both light mode and dark mode?"

Only move to Phase 4 when the user confirms it looks good.

## Phase 4: Code Review (Subagent)

Say: "Great! Let me do a quick check before we save it — just to make sure everything is solid."

Dispatch a **code review subagent**:

> Review the uncommitted git diff in F:\TL Website.
> Check for: bugs, broken logic, missing edge cases, security issues.
> Report findings in plain English (not code). Rate each finding: Critical / Important / Minor.
> Final response under 400 words.

If reviewer finds Critical or Important issues:
- Tell the user in one plain sentence: "The reviewer spotted [plain description]. Should I fix it?"
- If yes: dispatch implementation subagent to fix, then return to Phase 3
- If no: proceed

If all clear or only Minor issues: proceed.

## Phase 5: Summary

Tell the user in one plain sentence what changed:
> "I [added/updated/fixed] [plain description of the change]."

Ask: "Ready to save this to GitHub?"

## Phase 6: Commit and Push (Subagent)

Dispatch a **deploy subagent**:

> In F:\TL Website, run these commands in order:
> 1. git add -A
> 2. git commit -m "[descriptive message, e.g. 'feat: add dark mode toggle to reader bar']"
> 3. git push origin main
>
> Report: the commit message used and whether the push succeeded. Under 100 words.

After subagent reports success, tell the user:
> "Saved! Your change has been sent to GitHub."

## Phase 7: Optional Immediate Deploy

Ask:
> "It'll automatically go live at forgottentranslations.vercel.app in about 2 minutes. Want me to push it live right now instead?"

If yes:
```
cd "F:\TL Website" && npx vercel --prod --yes
```
Confirm: "It's live now at https://forgottentranslations.vercel.app"

If no: "It'll be live in a couple of minutes automatically."

## Phase 8: Loop

Ask: "Is there anything else you'd like to change?"

If yes: return to Phase 1.
If no: "Great! Let me know whenever you want to make more changes."
```

- [ ] **Step 2: Verify the file exists**

```bash
Get-Content "C:\Users\Yogesh\.claude\skills\tl-website-workflow\skill.md" | Select-Object -First 5
```

Expected: first 5 lines of the file including the title.

---

### Task 3: Create project CLAUDE.md

**Files:**
- Create: `F:\TL Website\CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md**

Create `F:\TL Website\CLAUDE.md` with this exact content:

```markdown
# Forgotten Translations — Project Guide

This is the **Forgotten Translations** webnovel translation website, live at https://forgottentranslations.vercel.app.

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

> "What would you like to change today on the Forgotten Translations website?"

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
- Live URL: https://forgottentranslations.vercel.app
- GitHub repo: yogesh1239/TL-Website (main branch = production)
```

- [ ] **Step 2: Verify the file exists**

```bash
Get-Content "F:\TL Website\CLAUDE.md" | Select-Object -First 5
```

Expected: first 5 lines including the title.

---

### Task 4: Commit everything to GitHub

**Files:** `F:\TL Website\CLAUDE.md`, `F:\TL Website\docs\superpowers\`

- [ ] **Step 1: Stage files**

```bash
cd "F:\TL Website" && git add CLAUDE.md docs/superpowers/specs/2026-04-16-guided-workflow-design.md docs/superpowers/plans/2026-04-16-guided-workflow.md
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: add guided workflow CLAUDE.md, spec, and plan for non-technical user"
```

Expected: commit hash printed, no errors.

- [ ] **Step 3: Push**

```bash
git push origin main
```

Expected: `Branch 'main' set up to track remote branch 'main'` or similar success message.

---

## Verification

After all tasks complete:

- [ ] Start a fresh Claude Code session in `F:\TL Website`
- [ ] Claude should open with: "What would you like to change today on the Forgotten Translations website?"
- [ ] Give a vague request like "make the site look nicer" — Claude asks one follow-up question
- [ ] Give a specific request — implementation subagent runs, build passes
- [ ] Guided check questions appear after local preview
- [ ] Code review runs before commit
- [ ] After approval, commit lands on `yogesh1239/TL-Website` main branch
- [ ] Optional Vercel deploy prompt appears
