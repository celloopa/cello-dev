Read AGENT.md first. My second brain is set up. Now automate documenting what I do with you, and add skills that keep my agents consistent.

## Ground rules
- At the end, show me what you built and what you tested, then stop.
- Show me each file before installing it. Ask before anything that costs money, sends data off my machine, or changes global settings.
- Never store passwords, keys or tokens in the brain or in Git.

## Step 0: survey
Check my OS, where Claude Code keeps its session transcripts on this machine (and in WSL, if I use it), and which scheduler I have (Task Scheduler, cron, launchd, or the Claude desktop app's scheduled tasks). Ask me what times suit a nightly and a weekly job.

Note: only Claude Code / desktop Code sessions are saved on this machine. Regular claude.ai chats aren't, so for those I'll use `capture` by hand.

## Step 1: automatic chat documentation
Three layers, each one simple:
1. **Log every session (hook, no AI).** A Claude Code `SessionEnd` hook, plus a `PreCompact` hook so long sessions get logged before compression. It appends one line to `private/recap-queue.jsonl`: timestamp, working folder, session id, and `transcript_path` from the hook input. Instant, never fails a session.
2. **`recap` skill.** Reads a transcript and writes `private/session-recaps/YYYY-MM-DD/<project>-<time>.md` with only these sections: What we did · Decisions (and why) · Verified vs not verified · Open threads · Memory candidates · Project it belongs to. Short and factual, no transcript dumps. I can run it by hand; the nightly job covers the rest.
3. **Nightly digest (local scheduler).** Recaps anything still queued, then writes one `private/nightly/YYYY-MM-DD.md` grouped by project: decisions, open threads, memory candidates, and proposed updates to project notes and agent memory. It only proposes; I approve in the morning. Use `claude -p`. Run it locally, not as a cloud agent: the transcripts only exist on this machine.

Rules: `private/` is Git-ignored; redact keys, tokens, passwords and emails before writing; never copy raw transcripts into the brain; nothing goes into `wiki/` from a recap (the harvest rule still applies); idempotent (mark queue entries done, never recap a session twice); if the computer was asleep, the next run catches up.

## Step 2: consistency skills
Create these as user-level Claude Code skills, each with a clear description of when it triggers. Each one reads AGENT.md before writing, writes only where AGENT.md allows, and ends by saying what it changed and what's waiting for my approval.

| Skill | What it does | When |
|---|---|---|
| `brain-context` | Read AGENT.md, the matching project note and recent recaps before starting work, so every agent starts with the same context | Auto, start of work |
| `capture` | Drop a raw thought, link or pasted chat into `inbox/` | On demand |
| `recap` | Session recap (Step 1) | End of session + nightly |
| `handoff` | Update the project note, then give me a paste-ready prompt to continue in a fresh session | On demand / long sessions |
| `decision-log` | Record real decisions in the project note with the date and reason | Auto, when deciding |
| `harvest` | Turn a finished project into one wiki lesson (rules in AGENT.md) | On demand |
| `morning-brief` | Last night's digest, pending approvals, open threads, 1–3 suggestions for today | Daily |
| `brain-lint` | Frontmatter, naming, broken links, stale statuses, inbox notes older than 30 days | Weekly |
| `weekly-review` | Week per project, flag projects idle 2+ weeks (park or continue?), inbox notes to promote or delete, finished projects worth harvesting | Weekly |
| `consolidate-memory` | Merge duplicate memories, fix stale facts, prune the index | Monthly |

## Step 3: schedule and verify
- Schedule the nightly, daily, weekly and monthly jobs at the times I chose.
- Write `registry/automations.md` listing every hook, skill and scheduled job: what it does, when it runs, where it writes, and how to turn it off. Link it from `registry/_index.md`.
- Test end to end: run a short dummy session, confirm the hook logged it, run `recap` and the nightly digest by hand, and show me the files. Tell me plainly anything you couldn't test.
