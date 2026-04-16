# Guided Website Workflow — Design Spec

**Date:** 2026-04-16
**Project:** Forgotten Translations (F:\TL Website)
**Audience:** Non-technical user (Yogesh) — no coding knowledge assumed

---

## Problem

Working on the site requires knowing which files to edit, how to run builds, and how to push to GitHub. This friction means good ideas don't get built because the process gets in the way.

## Goal

Every conversation with Claude automatically becomes a guided session: Claude asks what you want, does all the technical work with subagents, shows it locally, reviews the code, then commits and optionally deploys to Vercel — all in plain English with no jargon.

---

## Workflow (End-to-End)

```
1. Conversation opens
   → Claude: "What would you like to change today?"

2. Requirements gathering
   → Claude asks one follow-up question at a time until the request is clear

3. Implementation (subagent)
   → Implementation agent writes code + runs npm run build
   → If build fails: agent tries to fix once, then reports plainly if still stuck
   → Claude relays result in plain English

4. Local preview
   → Dev server starts (localhost:3002)
   → Claude asks guided check questions: "Does X look right?", "Is Y where you expected?"
   → User approves

5. Code review (subagent)
   → Code review agent checks for bugs and issues
   → If problems found: Claude explains plainly, decides fix/skip, confirms with user
   → If all clear: Claude says so

6. Plain-English summary
   → Claude describes what changed: "I added a dark mode toggle to the reader bar"

7. Commit to GitHub
   → Deploy agent commits with a clear message and pushes to main
   → GitHub push triggers Vercel auto-deploy

8. Optional immediate deploy
   → Claude asks: "It'll auto-deploy in ~2 minutes via GitHub. Want me to push it to Vercel right now instead?"
   → If yes: runs npx vercel --prod --yes directly
   → Either way: confirms "Your changes are live at forgottentranslations.vercel.app"

9. Loop
   → "Anything else you'd like to change?"
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `F:\TL Website\CLAUDE.md` | Project context loaded every conversation; activates always-on guided mode |
| `C:\Users\Yogesh\.claude\skills\tl-website-workflow\skill.md` | Full step-by-step workflow skill with subagent dispatch instructions |

---

## Subagents

| Agent | Role | Reports back |
|-------|------|-------------|
| Implementation agent | Writes code, runs build, fixes one retry on failure | Success or plain-English error |
| Code review agent | Reviews diff for bugs/issues | Findings in plain English or "all clear" |
| Deploy agent | git commit + git push to main | Confirmation with commit SHA |

---

## Setup (One-Time)

- **Disable GitHub branch protection** on `main` so the deploy agent can push directly without PRs

---

## Non-Technical User Rules (for CLAUDE.md)

- Never use technical terms without a plain-English explanation in parentheses
- Never ask the user to run a command themselves unless absolutely unavoidable
- Always explain what's happening before doing it ("I'm going to make that change now...")
- When something goes wrong, say what it means in plain English first, technical detail second

---

## Verification Checklist

- [ ] Start a fresh conversation — Claude greets with "What would you like to change today?"
- [ ] Give a vague request — Claude asks follow-up questions
- [ ] Give a clear request — Implementation subagent runs, build passes, dev server starts
- [ ] Claude asks guided check questions about the feature
- [ ] Code review runs and reports back
- [ ] Commit lands on GitHub, Vercel deploy triggers
- [ ] Optional immediate deploy prompt appears and works
- [ ] "Anything else?" appears at end
