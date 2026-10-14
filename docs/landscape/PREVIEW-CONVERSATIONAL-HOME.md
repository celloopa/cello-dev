# Conversational home and clearer work

Preview iteration, October 14, 2026. Production remains the approved landscape release at `192d143`.

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
