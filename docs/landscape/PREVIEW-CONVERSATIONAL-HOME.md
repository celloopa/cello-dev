# Conversational home and clearer work

Preview iteration, October 14, 2026. This iteration began from landscape release `192d143`. The current preview also preserves the independently published writing update `b2f753d`; greeting changes remain preview-only.

## Changes

- Reuse Cello’s existing illustrated avatar. Show the complete greeting, Mt. Hood invitation, product/prototype range and “builder” aside as ordinary HTML. No timed dialogue or access gate.
- Give Work, Writing and About their own clear links. Explain the project-logo rail in plain language. Hide the proposed YouTube route until Cello’s new channel is ready.
- Widen home project artifacts to the existing 1500px container token. The media gets the larger column in both alternating orientations; stack at tablet widths. Use the actual project marks beside names, including Daybreak’s Rail and block icon.
- Lead each case study with problem, decision, supported result and ownership before the main artifact. Move full details/tools into an expandable section. Remove the repeated end-of-page highlights. Ghosted has six main chapters with supporting subsections; existing heading anchors remain available.
- Keep cursor depth, still fallbacks, About separation, and the connected rail. No renderer or scene assets change in this iteration.

## Evidence and limits

Short summaries draw only from the corresponding MDX. Ghosted remains private beta, with hiring outcomes unmeasured. Daybreak remains personal dogfooding, without external user validation. Coding-agent attribution stays explicit. Earlier research is restored alongside the new 2D Three.js investigation; the UXfolio destination was only partially observable. This is a structure/findability hypothesis, not a measured conversion gain.

## Quick persona run

Persona: Morgan, an invented product-design hiring lead, English, first visit. No account or data seed required. Local static build at `127.0.0.1:4613`; desktop and phone screenshots kept in the private landscape-polish session directory.

| Flow | Expected | Result |
| --- | --- | --- |
| Understand the greeting and find the work | Avatar and complete intro visible without waiting; Work link and rail explanation available | Pass |
| Inspect Ghosted and open its story | Large artifact, matching logo/name, explicit case-study action; skim summary before cover | Pass |
| Find deeper evidence | Six main chapters; full role/tools available through details | Pass |
| Read Writing or About | Direct normal links; YouTube hidden | Pass |

Local build passed with zero errors or warnings. New intro/work/case/Writing/About flows passed at 390, 768, 1440 and 1676 pixels. The Ghosted media width at 1676 is 967px. Rail click/scrub/current state/keyboard, separate About and no-JavaScript navigation passed at 390, 768 and 1440 pixels. Browser checks establish mechanics and recorded appearance, not human comprehension or hiring conversion.

Shipped preview `30032ff` passed deployed route/metadata/identity smoke and bounded REA. REA found a minor 390×844 rail overlap; the follow-up removes the duplicate intro Resume link and puts the place caption above the mobile rail. Local 390×844 geometry checks confirm intro routes/caption clear the rail. Browser Back returns from Ghosted to home. The deployed REA record and its exact coverage limits are in `RESEARCH-2d-three-websites.md`.

## Sequential greeting follow-up

Cello asked for each greeting message to arrive and write itself out. The circle avatar now enters, then the four messages reveal in order. Existing motion tokens set character pacing, pauses and entry duration. Full text reserves its layout, so typing never shifts the links. Show all finishes immediately; Replay hello repeats intentionally. A session flag avoids replay on return. Scrolling away, selecting an intro route, hiding the tab or switching to reduced motion completes the text. No-JavaScript and reduced-motion paths show complete semantic copy; the visual typewriter spans are hidden from assistive technology rather than sending character-by-character live announcements.

Local checks pass for sequencing, skip/replay, session return, runtime reduced-motion changes, full sequence completion, no-JavaScript content, stable route geometry, and the existing390/768/1440/1676 flows. Character exploration is separate: Cello supplied current portrait/hiking references and requested a modern mullet, rain jacket, existing backpack, and the landscape’s consistent flat cutout treatment. Keep the circle while that likeness/style is being refined; personal source photographs stay outside the public repo.

Character follow-up: Cello selected the simpler unified illustration and requested it against Mt. Hood with depth. Home now opts into the independent character plane, between terrain and foreground. The four landscape cuts remain separate, and the chat stays fixed. See `CHARACTER-GREETING.md` for the asset, exact prompt, depth boundary and fallback behavior.

## Foreground character, focused messages and phone navigation

Cello reported that the character disappeared into shadow, the builder joke did not flow, and the phone view was busy. The clean-shaven character now sits beside the chat as a foreground cutout driven by the existing depth spring. The builder line is removed; the product message becomes “I love to design and prototype helpful experiences, taking an idea all the way to something you can use.”

Normal motion keeps the name in place and gives the body messages one shared slot. Each types in, pauses for reading, then fades upward as the next takes focus. The final product message remains. Skip intro and Replay hello remain available; direct routes never wait. Reduced motion/no JavaScript show both complete messages in ordinary reading order.

On home at phone widths (≤768px), the top context bar is hidden and its Menu entry moves into a toolbar on the bottom project rail. Six connected project stops stay intact. The phone routes use shorter labels and one brief scroll/tap hint. Case-study headers remain available because those routes do not have a project rail. Desktop navigation stays in its existing place. Menu touch activation, Escape/focus return, expanded state and case-study header retention are checked alongside the responsive flows.

Validation for the combined pass: build passes with zero errors/warnings;375px emulated-touch bottom Menu/rail/back-header checks pass. GPU foreground depth, fixed-copy geometry, static context-loss fallback, focused typing/skip/replay/session/reduced-motion/noJS and390/768/1440/1676 flows pass. Screenshots and exact driver output are retained in the private landscape-polish session directory (`mobile-greeting-check.log`).
