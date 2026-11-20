/**
 * /now (CDEV-54, CDEV-59): what Cello is building, one entry per project, ordered by what a
 * visitor can open today first. Facts come from Brain inbox/2026-11-20-cello-design-current-work-
 * states.md; Cello's pick on CDEV-61 lets the page name Crest, Tabor and Plate, with demo data
 * only (this page has no screens yet, so no data at all). Never put his own plan, meals,
 * workouts or saves here.
 *
 *   hook    the heading: the reader's problem in their words
 *   name    the product, bold at the start of the first paragraph
 *   body    one or two short paragraphs; the first one continues after the name
 *   status  where it stands, in plain words
 *   links   only public places
 */
export interface NowEntry {
  id: string;
  hook: string;
  name: string;
  body: string[];
  status: string;
  links: { href: string; label: string; external?: boolean }[];
}

export const nowPage = {
  title: "What I’m building now",
  description:
    "What Cello is building now: Ghosted, the agent kit and Pocket Startup, Crest, Tabor, Plate and Second Chair, with what each one does and where it stands.",
  lede: "Three of these are live today: Ghosted, the agent kit and Second Chair’s code. The rest I use myself while I build them, and each one says where it stands.",
  updated: "Updated November 2026",
} as const;

export const nowEntries: NowEntry[] = [
  {
    id: "ghosted",
    hook: "Tailoring your resume for every job?",
    name: "Ghosted",
    body: [
      "proposes changes to your resume for each job, highlighted in yellow, and you keep or reject each one. An interview tab helps you prep, and thank-you notes are there for after.",
      "Testers have used it since October, and their reports set the order of what I build next.",
    ],
    status: "Live and in testing. Sign up on the site for a tester code.",
    links: [
      { href: "https://ghosted.cello.design", label: "Try Ghosted", external: true },
      { href: "/projects/ghosted", label: "Read the Ghosted case study" },
    ],
  },
  {
    id: "agent-kit",
    hook: "Hand off a task to AI and come back to checked work",
    name: "The agent kit",
    body: [
      "is how I hand work to Claude Code, Anthropic’s coding tool, shared as three prompts you copy. Together they set up sessions that plan the task, build it, check the build against the plan and ship it.",
      "Pocket Startup is the free, open-source version I’m planning: a kit you copy onto your own computer that sets up a small team of AI helpers, a task list and a page on your phone, and teaches you step by step. It’s for people who have never opened a terminal: you follow plain pages and end with a working setup. When work needs you, it stops on a question with two buttons, and nothing ships without your answer. None of it is built yet.",
    ],
    status: "The agent kit is live. Pocket Startup is planned.",
    links: [{ href: "/agent-kit", label: "Open the agent kit" }],
  },
  {
    id: "crest",
    hook: "What happens to the task you didn’t get to?",
    name: "Crest",
    body: [
      "is my day planner for Mac and iPhone, and nothing in it is ever marked late. When a block slips past, Catch up gives it a new place: in five minutes, at a time you pick, or wherever you ask it to make room. Nothing moves until you keep it.",
    ],
    status: "In daily use by me since October. Not public yet.",
    links: [],
  },
  {
    id: "tabor",
    hook: "Find the reel you saved by what was said in it",
    name: "Tabor",
    body: [
      "saves a TikTok, Instagram or YouTube link with a line you write in your own words, then puts it on a board with a transcript, so you can search for the clip by what someone said in it. It runs on Mac and Windows.",
    ],
    status: "In use by me. Not public yet.",
    links: [],
  },
  {
    id: "plate",
    hook: "One grocery list for the whole house",
    name: "Plate",
    body: [
      "is an iPhone app a household shares: one week of meals, one grocery list and the week’s workouts. Paste the list from your phone’s notes and it shows what’s missing in one tap. A training planner is built and waiting on its first real run.",
    ],
    status: "In progress. Not public yet.",
    links: [],
  },
  {
    id: "second-chair",
    hook: "Type “make a four-chord loop in A minor” into Ableton Live",
    name: "Second Chair",
    body: [
      "is a helper inside Ableton Live, the music program, that does what you ask by text or voice without taking over your screen. That request comes back as a clip of notes built from music theory. It also saves, imports and exports, and splits a track into stems with Live’s own tool. It works offline too, with a small model on your computer.",
    ],
    status: "In use on my Mac and PC, and open source. A YouTube series about it is planned.",
    links: [{ href: "https://github.com/celloopa/second-chair", label: "See Second Chair on GitHub", external: true }],
  },
];
