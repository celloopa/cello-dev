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
