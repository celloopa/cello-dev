/** Short reading paths, grounded in the corresponding MDX case studies. */
export const projectStories: Record<string, { problem: string; decision: string; outcome: string; mark: string }> = {
  "asheville-dispensary": {
    problem: "Three distinct brands needed consistent design, and I didn’t want to spend every week rebuilding the same assets.",
    decision: "Share the system, keep each brand’s identity, and let code handle production while a person approves what goes out.",
    outcome: "37 product drops delivered. Replaced 3–5 hours of manual asset work a week.",
    mark: "/images/project-marks/asheville-dispensary.svg",
  },
  ghosted: {
    problem: "AI can tailor a resume quickly. People still need to see and control every change.",
    decision: "Make each edit a yellow proposal on the real resume, ready to keep, reject, or revise.",
    outcome: "Live in early testing, shaped by what testers said. On phones the resume moved up from 522px to 233px. I haven’t measured hiring outcomes yet.",
    mark: "/images/project-marks/ghosted.svg",
  },
  vegavengers: {
    problem: "Festival information was going stale, and every correction landed on a developer.",
    decision: "Give editors their own publishing workflow, and have AI suggestions show up as ordinary drafts with evidence.",
    outcome: "Two non-technical editors run the live CMS. AI proposes updates; an editor decides what gets published.",
    mark: "/images/project-marks/vegavengers.svg",
  },
  daybreak: {
    problem: "A generated daily plan is only useful when it respects real commitments and stays editable.",
    decision: "Give people and AI the same typed operations, with a receipt for every change.",
    outcome: "Signed Mac and iPhone builds I dogfood every day. I haven’t validated it with other users yet.",
    mark: "/images/project-marks/daybreak.webp",
  },
};
