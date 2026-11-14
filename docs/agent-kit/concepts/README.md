# AK-1 · Agent Studio Kit concepts

Three directions for `/agent-kit` inside cello.design's system. Each page is one static HTML file showing the hero, the studio chapter with its ticket moment as a still (mid-run, with the evaluator sending a planted bug back), one prompt panel with Copy and Download .md buttons, and the costs table.

| File | Direction |
|---|---|
| `a-blueprint-sheet.html` | A · Blueprint sheet |
| `b-night-shift.html` | B · Night shift |
| `c-job-tickets.html` | C · Job tickets |
| `shots/<file>-<390\|1440>-<dusk\|day>.png` | 12 full-page screenshots |

**How the pages are built.** Each page links `../../../src/styles/tokens.css` directly, so it opens from `file://` or from a static server at the repo root, and it reads roles only. `concepts.css` holds the shared base: a reset, the Button (mirroring `src/components/ui/Button.astro`), the switch, and a Day/Dusk toggle that exists only on these pages. `concepts.js` wires the toggle, Copy and Download .md. Geist Mono (400 and 700) and National Park are copied into `fonts/` (OFL 1.1, licences beside them), because the site loads both through Astro and `tokens.css` only declares Switchback, at a root-absolute URL. Switchback isn't used here. `make-shots.mjs` puts `source/p3.md` into each prompt panel and retakes the 12 screenshots (`node docs/agent-kit/concepts/make-shots.mjs [a|b|c]`).

**Shared across all three.** The demo ticket is PANTRY-4, "Shopping list by aisle", from an imagined meal-planning app. It has three criteria, and the planted bug is a console TypeError on `/list`, so the evaluator fails round 1 of 3 and sends it back to the worker. The switch shows "Plant a bug" turned on, beside Run ticket (primary) and Pause (secondary). Every page has the same copy, taken from the source kit and rewritten in the first person; opinion lines are left as `[Cello's words]`.

**Motion, shared spine.** The page is a scroll story in five chapters: brain → notes → studio → proof → setup. Each chapter's art assembles on entry (600 ms, `--ease-out`, 60 ms stagger), and the text is never held back by it. The ticket run is a pausable showcase tier. It plays only after the visitor presses Run ticket, Pause stops it, and it never autoplays or loops. With reduced motion, every chapter shows its end state as a still, and Run ticket jumps straight to the final state: shipped, or sent back if a bug is planted.

---

## A · Blueprint sheet

**Rationale.** The page is a technical drawing of the studio. The hero is a construction drawing of the mark (C-ring, green sun, earth triangle) under blueprint construction circles, a diagonal and a dimension line, with a title block (drawn by, sheet, roles, prompts) and a five-cell chapter strip. The studio is "Fig. 3": four numbered stations (ST-01 to ST-04) joined by a thick bar, on a faint blueprint grid. The evaluator's frame turns to the returned colour, and a dashed return path carries the PANTRY-4 tag back to the worker. Lettered annotations (A, B, C) hang from blueprint leader lines, and the eval report sits below as `docs/evals/pantry-4.md`. Costs become a bill of materials. This direction is the most literal about the system's construction language and stays closest to how `/design-system` already looks. It reads as "how it's built", which suits a designer who builds.

**Motion.** Each chapter draws itself. Construction lines stroke in first (stroke-dashoffset), then the art fills and locks in. In the studio, the ticket tag slides along the bar from one station to the next, and each station's state line types its result. On FAIL the return path draws from the evaluator back to the worker and the tag rides it. On PASS the shipper's dashed frame turns solid. The proof chapter could redline two real sheets, one per ship story.

**Proposed roles.**
- `--status-returned`: a ticket sent back, its tag, path and FAIL verdict. Dusk `#ff7a59` (new primitive ember-400) at 7.08:1 on ink-950. Day `#b3361c` (ember-700) at 5.21:1 on paper-100. There is no existing primitive for this. Earth and blueprint are both barred from carrying status.
- `--construction-strong`: leader and dimension lines that must read. Dusk `var(--accent-construction)` at 6.97:1 on ink. Day `#1f6fbf` (new blueprint-700) at 4.41:1 on paper-100. **Finding:** blueprint-500 is only 2.24:1 on Paper 100, so in Day today's construction lines fail 3:1 as meaningful graphics.
- `--construction-faint`: the sheet grid. Blueprint at 22% (Day: blueprint-700 at 20%). Decorative only; no contrast target.

**Risks.** Blueprint carries much of the look, while the system wants it kept to construction lines only, so this could drift into being "the blue page". The annotations need the Day blueprint fix above. It can feel like a diagram rather than a poster. The schematic needs its own phone layout (a vertical stack with the return path on the right), already sketched.

## B · Night shift

**Rationale.** The desk window after dark, with the identity's window frame used as the main primitive (6 frame, 4 mullion, earth sill). The hero is a poster seen through the window: a dusk-rule sky, two earth ridges, the studio block with three of four windows lit, and the green sun just under the ridge. It rises when a ticket ships. In the studio chapter, each role is its own tall lit window; the art sits in the pane and the label always sits on the sill plate beneath it. The evaluator's window has a returned-colour frame, and a "street" line under the row carries the ticket back. A shift log with timestamps tells the run as text. The prompt is a framed window with a sill ("Take a window home"), and costs are three panes: pay for, run locally, skip for now. In Day the windows turn to sky and pale panes, so the same poster reads as morning.

**Motion.** Lights come on window by window as the ticket moves (opacity on the lamp fill, 300 ms). The ticket plate travels along the street. On FAIL the evaluator's window flashes its frame once and the plate walks back. On ship the sun rises from behind the ridge (translateY, signature duration, overshoot like the landscape arrival). The hero arrival lights the windows one at a time.

**Proposed roles.**
- `--status-returned`: as in A.
- `--art-lamp`: a lit pane. Art only, never text. Dusk `#e8cf8a` (new primitive lamp-300), 11.87:1 against ink as a shape. Day `var(--paper-50)`.
- `--art-sky`: the poster sky. Dusk is the I3 dusk rule applied to September far (`color-mix(in oklab, september-far 40%, ink-950)`); Day is `--art-august-sky`.
- `--art-pane-dark`: an unlit pane. Dusk is ink with 7% starlight; Day is September far at 55% over paper.

**Risks.** It's the most illustrative of the three and leans on the rewrite's landscape language, so it may compete with the homepage scenes or feel like their preview. "Night shift" works against the Day theme: in daylight it becomes a "studio by day" scene and loses its story. It adds a new art ink (lamp). The sun-rise payoff only works when a ticket ships, so a visitor who plants a bug never sees it unless they run the ticket again.

## C · Job tickets

**Rationale.** A print shop's order rail. The hero is a heavy uppercase title above an earth rail with five stubs hanging from hooks, one per chapter, so the chapter index is the first poster object. The current chapter takes a green sill offset. The studio is a four-lane rail (lead, worker, evaluator, shipper) with a real ticket stub on each hook: PANTRY-5 queued, PANTRY-3 building, PANTRY-4 at the evaluator stamped **SENT BACK** with its criteria ticked and crossed, and PANTRY-2 stamped **PASS** at the shipper. A dashed route sends PANTRY-4 back. The prompt is a work order with a perforated tear-off holding "03", Copy and Download .md. Costs are a rate card that marks pay, local and skip per item. Stubs are paper in both themes, so they behave like opaque plates and always use ink-on-paper roles. This makes the evaluator's verdict the clearest of the three: a stamp is a judgement anyone understands at a glance.

**Motion.** A stub drops onto its hook and settles (translateY with the house overshoot). It slides along the rail from lane to lane and swings slightly as it lands. The evaluator stamps it: the stamp scales from 1.15 to 1 and locks in at 300 ms. On SENT BACK the stub slides back to the worker's hook. On PASS it continues to the shipper and the rail's end lights green. With reduced motion, the stubs sit on their final hooks with their stamps already on.

**Proposed roles.**
- `--bg-stub`: a ticket stub, an opaque paper plate in both themes. Dusk `var(--paper-100)`, Day `var(--paper-50)` (with the 3 px ink frame for the edge). Ink text on it is 15.59:1 (paper-100) and 17.22:1 (paper-50).
- `--status-returned`: as in A, on the canvas.
- `--status-returned-on-stub`: the SENT BACK stamp and FAIL marks on a stub, in both themes. `#b3361c` (ember-700) at 5.21:1 on paper-100 and 5.75:1 on paper-50.
- No new role for green on stubs: inside a stub the Day action roles apply (signal-700, 4.70:1 on paper-100).

**Risks.** A paper surface in Dusk is close to `--bg-inverse`, used many times on one page. The system calls that "the rare inverted block", so `--bg-stub` needs Cello's blessing. Without care, stamps and a rotated stamp can tip into skeuomorphic kitsch. On phones the five hero stubs scroll sideways (scroll-snap), which hides chapters 4 and 5 until swiped. The PASS stamp is ink, not green, to keep green for action, so it reads a little quieter than SENT BACK.

---

## Recommendation

**C · Job tickets**, keeping A's annotation layer for the proof chapter.

C turns the hands-on moment into the poster itself. A stamped ticket says "the evaluator sent this back" to anyone, so the planted-bug toggle has an obvious payoff. Its shapes come from the existing kit: hard-edged cards, thick bars, the earth rail, offset sills. It works the same in Day and Dusk, because the stubs are paper in both. It also adds the fewest art colours (one status colour and one surface). B is the most beautiful but borrows the landscape rewrite's thunder and loses its story in Day. A is the most "cello.design" in method but makes blueprint carry the page and needs a Day blueprint fix first. Worth taking from A either way: the blueprint-500 on Paper 100 contrast (2.24:1) is a system issue, not just a concept issue.

`--status-returned` is needed by all three. If Cello approves only one new role from AK-1, it should be that one.
