# Return to the existing landscape preview

## Decision, 2026-10-13

Cello preferred the existing Netlify branch preview after reviewing the discoverable-world
prototype: “i kinda prefer what we were building and is live on the netlify branch this feels
more limited”. The four-landmark prototype is preserved at `0c339ff` on
`codex/discoverable-world-prototype`, outside the cutover path.

Resume release preparation from `b471641`. Its site source, public assets, package manifest,
lockfile and Astro configuration match preview pin `250cd03` (PR14 tree `d94e121`). The two
commits differ only in planning docs. This is an experience baseline, not a new release pin.
Keep the existing scrolling work, backdrop swaps, Admire view and full case-study routes.
The unbuilt C0–C5 chapters plan has not been reapproved by this preference.

## Evidence and remaining release work

The Netlify PR14 homepage returned HTTP 200 and a fresh desktop browser capture rendered
the existing landscape arrival. This spot check does not replace the CUTOVER test matrix.

`CUTOVER.md` records the remaining issues on this site baseline:

- Day-theme text contrast fails between arrival and reading on home and /card (recorded
  minimum 2.03:1, with 3:1 required for the measured large text). Fix and measure on this
  scrolling experience; do not assume the unbuilt chapters design resolves it.
- Nineteen inherited WebM-only videos lack posters and were blank in iPhone Simulator.
  Confirm affected assets and supply compatible fallbacks as needed.
- Phone theme/Pause controls retain a tap hover state, the reading-page Menu spacing is
  tight, and case-study TOC focus rings clip.
- Finish browser/fallback, route, identity-file, privacy and exact-preview checks in the
  cutover matrix. Previously recorded results are baselines, not a pass for a new pin.

Production merge/deployment is still held pending the concrete candidate's review and
Cello's release go. Keep the one-commit cutover strategy in CUTOVER.md; never push historical
landscape commits containing private identifiers.
