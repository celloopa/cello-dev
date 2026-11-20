/**
 * /now (CDEV-54, CDEV-59): what Cello is building, one entry per project, ordered by what a
 * visitor can open today first. Facts come from Brain inbox/2026-11-20-cello-design-current-work-
 * states.md; Cello's pick on CDEV-61 lets the page name Crest, Tabor and Plate, with demo data
 * only (screens use demo data only, CDEV-68). Never put his own plan, meals,
 * workouts or saves here.
 *
 *   hook    the heading: the reader's problem in their words
 *   name    the product, bold at the start of the first paragraph
 *   body    one or two short paragraphs; the first one continues after the name
 *   status  where it stands, in plain words
 *   links   only public places
 *   image   an optional demo-data screen (CDEV-68); never his own data
 *   clips   optional short loops of demo work, each with a caption
 */
export interface NowEntry {
  id: string;
  hook: string;
  name: string;
  body: string[];
  status: string;
  links: { href: string; label: string; external?: boolean }[];
  image?: { src: string; alt: string };
  /** short silent loops with a caption each (CDEV-68) */
  clips?: { src: string; mp4: string; poster: string; label: string; caption: string }[];
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
    image: { src: "/images/now/crest.webp", alt: "Crest on iPhone with demo data: a missed block waiting in Catch up with choices for where it goes, and a day where proposed changes wait for Keep or Reject" },
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
    image: { src: "/images/now/tabor.webp", alt: "Tabor on a Mac with demo data: a moodboard of public-domain images and links, with a proposed connection waiting for Keep or Dismiss" },
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
    image: { src: "/images/now/plate.webp", alt: "Plate on iPhone with demo data: today's planned meals, and the shared grocery list with what each item is for" },
  },
  {
    id: "second-chair",
    hook: "Ask “play it and check my levels” with your song open in Ableton Live",
    name: "Second Chair",
    body: [
      "lets the AI helper you already chat with work inside your Live set. You ask in plain words, and it reads the set, sets up effects, checks levels and loudness, writes automation, and explains each step so you can do it yourself next time.",
      "It asks before it changes your set, never overwrites a clip, and can take back its own changes. The ideas stay yours: it writes notes only when you ask for that one thing.",
      "Live gives scripts no save button, so it saves the way you would: through Live's own File menu, in the background, then checks the save landed.",
    ],
    status: "Beta and open source, in use on my Mac and PC. A YouTube series about it is planned.",
    links: [{ href: "https://github.com/celloopa/second-chair", label: "See Second Chair on GitHub", external: true }],
    image: { src: "/images/now/second-chair/control-surface.webp", alt: "Live's Settings, Tempo and MIDI tab, with SecondChair chosen as a control surface" },
    clips: [
      { src: "/images/now/second-chair/drum-rack-playing.webm", mp4: "/images/now/second-chair/drum-rack-playing.mp4", poster: "/images/now/second-chair/drum-rack-playing-poster.webp", label: "A Drum Rack of Live's own 808 sounds that Second Chair built, playing a two-bar beat it wrote", caption: "A drum kit it built from Live's own 808 sounds, and the beat it wrote, playing." },
      { src: "/images/now/second-chair/automation-sweep.webm", mp4: "/images/now/second-chair/automation-sweep.mp4", poster: "/images/now/second-chair/automation-sweep-poster.webp", label: "Live's Arrangement playing through a filter sweep that Second Chair wrote as automation", caption: "A filter sweep it wrote as automation, rising and settling over eight bars." },
      { src: "/images/now/second-chair/chord-coach-playing.webm", mp4: "/images/now/second-chair/chord-coach-playing.mp4", poster: "/images/now/second-chair/chord-coach-playing-poster.webp", label: "Chord Coach in Live naming each chord as it plays, with the keys lit and a trail of past chords", caption: "Chord Coach, a device that ships with it: it names the chord you're playing and lights the keys." },
    ],
  },
];
