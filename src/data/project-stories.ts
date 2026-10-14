/** Short reading paths, grounded in the corresponding MDX case studies. */
export const projectStories: Record<string, { problem: string; decision: string; outcome: string; mark: string }> = {
  "asheville-dispensary": {
    problem: "Three distinct brands needed consistent design, without spending every week rebuilding the same assets.",
    decision: "Share the system, keep each brand’s identity, and automate production with human approval.",
    outcome: "37 product drops delivered. Replaced 3–5 hours of manual asset work a week.",
    mark: "/images/project-marks/asheville-dispensary.svg",
  },
  ghosted: {
    problem: "AI can tailor a resume quickly. People still need to see and control every change.",
    decision: "Make each edit a yellow proposal on the real resume, ready to keep, reject, or revise.",
    outcome: "Live private beta, iterated with testers. Mobile resume position improved from 522px to 233px; hiring outcomes are not measured yet.",
    mark: "/images/project-marks/ghosted.svg",
  },
  vegavengers: {
    problem: "Festival information was going stale, and every correction depended on a developer.",
    decision: "Give editors their own publishing workflow. AI suggestions arrive as ordinary drafts with evidence.",
    outcome: "Two non-technical editors run the live CMS. AI proposes updates; an editor decides what gets published.",
    mark: "/images/project-marks/vegavengers.svg",
  },
  daybreak: {
    problem: "A generated daily plan is useful only when it respects real commitments and stays editable.",
    decision: "Give people and AI the same typed operations, with a receipt for every change.",
    outcome: "Signed Mac and iPhone builds in daily personal use. Validation with other users is still ahead.",
    mark: "/images/project-marks/daybreak.webp",
  },
};
