/** Short reading paths, grounded in the corresponding MDX case studies. */
export const projectStories: Record<string, { problem: string; decision: string; outcome: string; mark: string }> = {
  "asheville-dispensary": {
    problem: "Three distinct brands needed a coherent system across social, web, print and packaging.",
    decision: "Share the foundations and reusable structures, with each brand supplying its own visual identity.",
    outcome: "A shared asset directory is in use; audits and editable guides are extending the system across media.",
    mark: "/images/project-marks/asheville-dispensary.svg",
  },
  ghosted: {
    problem: "AI can tailor a resume quickly. People still need to see and control every change.",
    decision: "Make each edit a yellow proposal on the real resume, ready to keep, reject, or revise.",
    outcome: "Used by 30+ users, and their feedback shapes each release. I haven’t measured hiring outcomes.",
    mark: "/images/project-marks/ghosted.svg",
  },
  vegavengers: {
    problem: "Festival information was going stale, and every correction landed on a developer.",
    decision: "Give editors their own publishing workflow, and have AI suggestions show up as ordinary drafts with evidence.",
    outcome: "Two non-technical editors run the live CMS. AI proposes updates; an editor decides what gets published.",
    mark: "/images/project-marks/vegavengers.svg",
  },
  daybreak: {
    problem: "My planner made me commit the day, and let unfinished work pile up as guilt.",
    decision: "Nothing is late, it just needs a place. The planner and the AI only propose.",
    outcome: "Rebuilt from the ground up and in daily use on Mac and iPhone since October 15. I haven’t tested it with other people yet.",
    mark: "/images/project-marks/daybreak.webp",
  },
};
