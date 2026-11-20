/** Short reading paths, grounded in the corresponding MDX case studies. */
export const projectStories: Record<string, { problem: string; decision: string; outcome: string; mark: string }> = {
  "asheville-dispensary": {
    problem: "Three brands needed their own look everywhere, and approved files were hard to find.",
    decision: "Build all three from one set of parts, and let each brand bring its own colors, type and imagery.",
    outcome: "One file library, with a portal in each brand's look, is in use. The guides and templates are in review.",
    mark: "/images/project-marks/asheville-dispensary.svg",
  },
  ghosted: {
    problem: "An AI can tailor a resume in a minute. I only trust it if I can see every change it made.",
    decision: "Make each edit a yellow proposal on the real resume, ready to keep, reject, or fix yourself.",
    outcome: "Real testers have used it since October 8, and their reports set what I build next. I haven’t measured hiring outcomes.",
    mark: "/images/project-marks/ghosted.svg",
  },
  vegavengers: {
    problem: "Festival dates kept going stale, and every fix came to me.",
    decision: "Give the editors a CMS of their own, and have the AI checker write drafts with evidence for them to approve.",
    outcome: "Two editors run it every day. The checker suggests; an editor decides what goes live.",
    mark: "/images/project-marks/vegavengers.svg",
  },
  daybreak: {
    problem: "My planner made me commit the day, and let unfinished work pile up as guilt.",
    decision: "Nothing is late, it just needs a place. The planner and the AI only propose.",
    outcome: "Rebuilt from the ground up and in daily use on Mac and iPhone since October 15. I haven’t tested it with other people yet.",
    mark: "/images/project-marks/daybreak.webp",
  },
};
