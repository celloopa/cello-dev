# Blog publication and voice revision — October 14, 2026

## Baseline, recorded before editing

Publishing base: live `origin/master` at `192d143`. Work is isolated on `codex/blog-voice-publication`; the primary checkout's settings and portfolio-reference note are unrelated. Local AGENTS.md requires `pnpm build`. CLAUDE.md describes MDX publication by pushing to Git and Netlify auto-deployment; the release record confirms `master` is the production branch.

The collection uses title, description, publishDate, optional updatedDate/image/tags, and draft. Both the listing and static routes filter drafts. Media lives under `public/images` and article figures use `MediaFull` / `MediaTwo`. WebP derivatives use sharp from Astro's dependency tree. New posts receive an existing landscape through the stable slug rotation.

| Slug | Original publication date | Baseline status | Story to preserve |
| --- | --- | --- | --- |
| designing-for-the-second-user | 2026-10-11 | Published | Ghosted's walkthrough for people with existing work, Kim's context, shortening and AI exception |
| programmatic-resumes-you-can-chat-with | 2026-10-08 | Published; updated 2026-10-11 | Ghosted rebuild, resume editing and review, tester feedback, dated Oct 9–11 updates |
| scheduled-agent-flower-drop-routine | 2026-10-08 | Draft | July automation, wrong scrape and premature approval post, notification and cost decisions |
| keeping-ai-agents-inside-a-design-system | 2026-10-11 | Draft | October 11 Ghosted drift audit, design decisions, staged migration and checks |

## Editorial scope

Publish “When will the future of design arrive?” dated October 14, 2026. Its approved article body is retained; Brain frontmatter, duplicate title and editorial handoff are excluded. The generated collaboration image is a static concept, captioned accordingly. The Threads attribution is limited to a public page title/redirect and the approved short excerpt; full body/replies were inaccessible. Figma and Slack comparisons derive from official documentation, not app runtime testing.

Rewrite all four older posts in the endorsed first-person, concrete, conversational voice. Keep each post's own story, authorship, original dates, URLs, links and media. Set updatedDate to October 14 for the editorial revisions. Keep both drafts unpublished. Historical metrics and plans remain tied to their original reporting period.

## Verification and delivery

Build passes: token, family and Figma guards; Astro check 114 files with zero errors/warnings/hints; 16 static pages. Source comparisons confirm original dates and draft flags plus every existing media/link target are preserved. All built local links and images resolve. Private capture frontmatter/editorial handoff/local paths are absent, and both drafts have no static route.

The image is 1484 × 1060, 104,986 bytes, converted to WebP with Astro's sharp dependency at quality 88. MediaFull's opt-in `uncropped` removes its image height cap, preserving the full concept at every width. The new post uses the figure at the approved position in the body and the site's default social image; no duplicate hero is added.

Persona: Morgan, a hiring manager reading Cello's design writing in English, entering through Writing. No account or seeded personal data is needed for public static posts. Reused `pnpm ui:shots` for four pages × two sizes × both theme settings (16 captures). Durable desktop/phone samples are below; the source captures also include the alternate setting. The landscape's reading treatment remains the existing one. In-app browser clicks verified the reading chain, article dates, concept alt/caption and canonical URL. At 768 and 390 px the new article has no horizontal overflow; the concept retains its natural ratio and no height cap. Prose renders in Geist Sans.

| Id | Flow | Result | Screenshots |
| --- | --- | --- | --- |
| morgan-writing-01 | Find the new post in Writing, dated Oct 14, above the Oct 11/8 posts | Pass; two drafts absent | [Desktop](shots/blog-1440-dark.webp), [phone](shots/blog-390-light.webp) |
| morgan-writing-02 | Read the approved article and understand the image is a static concept | Pass; article body, full image, alt, caption, source links and next story verified | [Desktop](shots/blog-when-will-the-future-of-design-arrive-1440-dark.webp), [phone](shots/blog-when-will-the-future-of-design-arrive-390-light.webp) |
| morgan-writing-03 | Continue to the second-user story at its existing URL | Pass; Oct 11 original date, Oct 14 revision, media and next story | [Desktop](shots/blog-designing-for-the-second-user-1440-dark.webp), [phone](shots/blog-designing-for-the-second-user-390-light.webp) |
| morgan-writing-04 | Continue to the Ghosted launch story and distinguish launch plans from dated updates | Pass; Oct 8 original date, Oct 14 revision, all media and links retained | [Desktop](shots/blog-programmatic-resumes-you-can-chat-with-1440-dark.webp), [phone](shots/blog-programmatic-resumes-you-can-chat-with-390-light.webp) |

Limits: both unpublished drafts were read and compiled by the build; they were not made public for visual testing. No product runtime, new AI calls, physical-phone test or new collaboration app was part of this writing release.

Delivery workflow: push only this checked writing commit as a fast-forward to `master`, then verify production HTML and the image. The remote branch is unprotected and was still at the publishing base at the pre-push check. The chat delivery receipt records the actual commit and live outcome.
