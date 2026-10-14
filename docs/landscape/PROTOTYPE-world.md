# Discoverable world: one prototype

## Verdict: rejected for cutover

Cello reviewed the running prototype on 2026-10-13 and said: “i kinda prefer what we were
building and is live on the netlify branch this feels more limited”. Preserve this branch
as an experiment. Do not promote its route, landmark navigation or summary panel into the
release. Return to the existing landscape preview as the implementation baseline.

The result tested a specific four-landmark implementation. It does not retract the desire
for an illustrated place to discover with easy access to work, or approve the unbuilt
chapters plan. Further release work should preserve the existing experience and address
its verified cutover issues.

## Question and baseline

Can the existing illustrated places become a space to discover while a hiring manager can
reach the work directly? One direction, requested by Cello on 2026-10-13, with a same-day
cutover goal. This replaces the default multi-variant prototype exercise.

Base: `086472050379393f2450cff39248a2f119937d2a`, containing the landscape build at `b471641`
and the completed reference investigations. The existing home is arrival → scrolling work
with backdrop swaps and an Admire state. C0–C5 is planned, not implemented. The source already
has four complete MDX projects, summary facts, people-free screenprint scene layers, fonts,
tokens, static fallbacks and the cutover test plan. No source changes precede this baseline.

## Prototype scope

- An illustrated Mirror Lake arrival with four named project landmarks.
- Selecting a landmark visits its existing paired place and exposes its real project artifact.
- A summary opens on an opaque reading surface; the full case-study route remains available.
- A visible Work route goes to a compact index without requiring spatial exploration.
- Keyboard, narrow screens, reduced motion, history and returning to explore are review targets.
- Reuse approved art and current content; no new image generation, private uploads or Efecto dependency.

Run: `pnpm prototype:world`, then `/prototype-world/` on the printed local server.

This is a throwaway route on `codex/discoverable-world-prototype`. It is not a production
homepage replacement. A cutover needs acceptance of this direction, promotion into the real
routes and the existing CUTOVER checks, with an independent release review.

## Persona and verification

Alex Chen (fictional), English-speaking design hiring manager, cold visit from a shared link,
no account or seeded data. Wants to understand Cello, inspect relevant work, and explore briefly.
Local persona runs passed 14 core flow assertions across 1440px desktop and 390px touch
emulation: arrival, Work index, project selection, summary, Back/Forward/Escape, full case
navigation and return, theme persistence. Three separate fallback checks passed for a direct
reading URL with reduced motion, a JavaScript-disabled case link, and keyboard skip to Work.
The final build passed all guards and Astro check (0 errors, warnings or hints), with 15
static pages. The last source-grid cap correction was not covered by the recorded browser run.

Mobile screenshots showed header capture anomalies that were not resolved before the user
rejected the direction. Physical phone/Safari, performance and a full contrast audit were
not completed. These checks establish only a runnable experiment, not release readiness.
