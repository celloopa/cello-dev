# cello.design ship profile

Light static Astro site; no runtime database or user-data migration.

- Repository: celloopa/cello-dev, production branch master, site https://cello.design.
- Evidence: docs/writing/2026-10-14-publication.md and prior production release records.
- Publish MDX by setting draft:false. Preserve existing slugs and cross-links.
- Checks: pnpm install --frozen-lockfile; pnpm build (token guard, Astro diagnostics, static build); git diff --check; new route/listing/media/link checks.
- Reader: Morgan, hiring manager, English; changed reading paths at 1440 and 390 pixels. Public static pages need no accounts or seeds.
- Deployment: push branch, open PR for linked Netlify deploy preview, verify that preview, then fast-forward master to exactly the checked head. Do not force-push or replace another release.
- Deployment signal: Netlify successful commit status for preview and production, plus live HTTP/content verification.
- Smoke: Writing lists new post; post and case return 200 with expected copy and reciprocal links; local image/video URLs return correct content, final reel matches repository bytes.
- Risk: draft filtering, article dates/slugs, private editorial material appearing in page HTML, stale case summary, missing media, publishing a case link before its article.
- Rollback: a new revert commit on master, preserving subsequent work, followed by Netlify and live verification.
- Release receipt: docs/writing/2026-10-29-publication.md; post-deploy facts in Cello Brain.

## /agent-kit (Agent Studio Kit)

- Smoke: `/agent-kit/` returns 200 with "Agent Studio Kit"; each `/agent-kit/prompts/{1-second-brain,2-session-notes,3-studio-pipeline}.md` returns 200 and is one version header line, a blank line, then exactly the bytes of `src/content/agent-kit/prompts/` in the shipped commit; header and landscape bar show "Agent Kit".
- Checks at 390 and 1440, Dusk and Day: each Copy button copies its own prompt; 0 console errors; no horizontal scroll; Lighthouse accessibility ≥ 90 (mobile and desktop presets).
- Readers: Morgan (hiring manager, desktop) and a builder on a phone arriving from a shared link.
- Risk: no placeholder text in the built page (`dist/agent-kit/index.html` has no bracketed placeholder or `[verify]` mark); private strings in any pushed commit (keep the patterns in a local file outside the repo and grep every commit, not just the tip); the studio moment under reduced motion and Pause motion.
- Upkeep: prompt versions and the "last checked" date live in `src/content/agent-kit/prompts/meta.json`.
