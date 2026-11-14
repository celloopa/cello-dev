Read AGENT.md first. My second brain and session recaps are set up. Now I want a small software studio (lead / worker / evaluator / shipper) for building apps for myself and the people around me: reminders, meal planning, small tools.

## Ground rules
- Work in the phases below. At the end of each phase, show me what you built and what you tested, then stop and wait for my OK.
- Show me each file before installing it. Ask before anything that costs money, sends data off my machines, or changes global settings.
- For any third-party tool: read its README/SKILL.md first (don't trust memory for install steps or flags), show me what it'll install, and record it in `registry/` with what it's for and when to use it.
- Never change firewall, router, DNS, VPN, reverse-proxy or power settings yourself: give me the exact changes and I'll apply them.
- Never store passwords, keys or tokens in the brain or in Git.

## Phase 0: survey and questions
Check and report: OS, CPU, RAM, GPU and VRAM, free disk, and what's installed (git, Node and its version, Python, Docker, Ollama; on Windows, whether WSL2 is set up).

Then ask me, all at once:
1. Who uses the apps (just me, or family/friends on their phones)? iPhone, Android or both? One first app idea to run the pipeline on.
2. Where should apps run: only on this computer, a home server I have, or a small rented server? Should they work away from home?
3. If I have a server or network setup: what it runs, my reverse proxy, domain, how I do certificates and remote access.
4. Budget appetite: free/local only, or a few paid tools if they clearly save time?
5. Board: a plain `docs/board.md` in each repo, or GitHub issues?

Then propose a folder layout (on Windows: app repos and dev servers inside WSL2, the brain on the Windows side) and write it into AGENT.md.

## Phase 1: toolbox

**Matt Pocock's skills** (github.com/mattpocock/skills). Install with the `skills` CLI as the README says, user-level. Browse the whole repo and recommend any I'm missing, but at least:

| Skill | Where it fits |
|---|---|
| `grill-me` / `grilling` | The lead grills me on every new app idea *before* writing the plan: who it's for, edge cases, what "done" means. |
| `grill-with-docs` / `domain-modeling` | When an app has real data: pin down the terms and record decisions as ADRs in the repo. |
| `research` | The lead's research step: primary sources into a repo .md, not from memory. |
| `prototype` | A throwaway prototype to test an idea on my phone before the real build. |
| `improve-codebase-architecture` | Monthly scheduled pass per app, producing a report of what to simplify. I choose what becomes tickets. |
| `triage` | Only if I chose GitHub issues as the board. |
| `writing-great-skills` | Read before writing any of my own skills. |
| `teach` | For me, when I want to learn part of my stack, not just have it built. Only I start it. |

**REA, Reverse Engineer Anything** (rea.tools, github.com/morluto/rea). Investigates how a *shipped* app works (JavaScript/Electron/web apps; native apps need an extra engine), so my apps can learn from ones I like. Check which Node versions it supports and use a pinned Node rather than changing my system Node. Don't approve optional install scripts without asking me. Only apps I use or own, for learning concepts; never copy proprietary code, assets or branding.

**Playwright:** Playwright MCP (Microsoft) so you can drive a real browser at phone and desktop sizes, click through flows and take screenshots; and Playwright Test in every app repo, a small smoke test of the main flows that is part of the check command.

**Chrome DevTools MCP** (github.com/ChromeDevTools/chrome-devtools-mcp): Playwright drives, DevTools inspects. Console errors, failed or slow network requests, a performance trace at a throttled mobile connection, and audits (performance, accessibility, best practices, PWA installability; use the Lighthouse CLI if the MCP lacks audits). If I have Android, also show me how to connect a real phone over USB debugging.

**Also:** Context7 (or a similar docs MCP) so workers code against current library docs, and Anthropic's built-in skill-creator.

**Test:** show each tool working once.

## Phase 2: the pipeline

**Roles**
- **Lead** (one session per app, the one I talk to): `grill-me` me → `research` (optionally a `reference-study`: REA on one app + feature I like → observed behavior, evidence, 2–3 concepts, a recommendation; I pick) → optional `prototype` → plan in `projects/<app>.md` (goal, who it's for, screens, data, decisions) → small tickets, each with 2–5 testable acceptance criteria. Makes product calls with me. Never writes big code itself.
- **Workers** (subagents or separate sessions, one ticket each): build in their own git branch/worktree, add or update a Playwright test, run the checks, and hand back: branch + commit, what changed, checks run, screenshots, anything unfinished. Never merge, deploy or write their own evals.
- **Evaluator** (a separate subagent with fresh context): gets ONLY the acceptance criteria, the standing criteria and the running app, never the worker's chat. Walks each criterion with Playwright MCP at phone and desktop size, checks console, network, performance and audits with DevTools MCP, and writes `docs/evals/<ticket>.md`: pass/fail per criterion with evidence, measured results separate from its opinion. Verdict: PASS, or FAIL with specific fixes. On FAIL the worker fixes and it goes back, max 3 rounds, then it escalates to the lead and me. Never edits code.
- **Shipper** (at first the lead runs this through a background subagent; its own session once 2+ workers run at once): accepts only a PASS eval on that exact commit, merges to main, deploys, re-runs a quick eval on the live URL, writes a one-paragraph release note to `output/` in the brain, and tells me what shipped.

**Standing criteria** for every app (in its `docs/ship-profile.md`): no console errors, no failed requests, accessibility ≥ 90, installs as a PWA, works at phone width, usable within ~3s on a throttled mobile connection.

Rules: nothing reaches main without a PASS; I give the go for anything other people will see; one heavy job at a time (builds, local models, image generation) so the computer stays usable.

**Default stack:** PWAs (they install to phone home screens and send push notifications; on iPhone that needs iOS 16.4+ and adding to the home screen). A simple full-stack framework with SQLite, one repo per app, packaged as a Docker image, Playwright Test from the start. A shared tiny UI kit once there are 2+ apps.

## Phase 3: hosting and local AI

**Hosting.** Use my Phase 0 answers; don't pick for me. Write a deploy plan for my approval covering:
- **Real HTTPS** (PWA install, offline mode and push need it): prefer a domain + Let's Encrypt (DNS challenge works for internal-only apps) over self-signed certs.
- **Remote access** only the way I choose (my VPN, Tailscale, or public with login), nothing inbound opened unless I say so. Web push needs outbound access to the browser's push service.
- **Least-privilege deploy access:** a dedicated deploy user/key, never my admin credentials, never committed.
- **Per app:** container, data volume, backups with a tested restore, health check, rollback. Exact steps go in `docs/ship-profile.md`, so the shipper deploys the same way every time.

**Local AI.** Pick what fits my hardware and tell me what you chose and why (say plainly if my GPU will be slow or unsupported):
- **Ollama** with a current open model sized to my memory, for cheap private jobs: nightly recap summaries, tagging inbox notes, AI features inside my apps. Not the main coding agent; that stays with you.
- **faster-whisper** (or whisper.cpp) for voice notes → brain inbox.
- **ComfyUI** for app icons, illustrations and placeholder art, with a saved reusable workflow.

## Phase 4: skills and schedules
Read `writing-great-skills` first. Create user-level skills that call Matt's skills instead of duplicating them: `new-app` (scaffold repo + brain note + board + ship profile + Playwright), `lead` / `worker` / `evaluator` / `shipper` role briefs, `reference-study`, `walkthrough`, `evaluate`, `ship`, and `app-health` (weekly: every live app up, cert expiry, last backup + restore test, disk, standing criteria vs last week). Schedule `app-health` weekly and `improve-codebase-architecture` monthly. Add everything to `registry/automations.md`.

## Phase 5: prove it end to end
1. Run the pipeline on my first app idea: the lead grills me, researches and plans; two workers build two tickets in parallel; the evaluator checks each, including one deliberate FAIL (e.g. a planted console error) so I can see it caught and fixed; the shipper deploys; I open it on my phone over HTTPS.
2. Confirm that session got recapped and appears in the next nightly digest.
3. Tell me plainly anything you couldn't get working or couldn't test.
