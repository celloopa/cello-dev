/*
 * The scroll story's one list of stops, in reading order. The hero's rail, the mini rail, each
 * chapter's id and eyebrow, and the scroll driver (story.ts) all read this list, so a chapter is
 * added, renamed or reordered here and nowhere else. data-ch on .ak is a stop's 1-based position
 * (0 while the hero is the current view).
 */
export interface Stop {
  /** the section id and the rail link's #target */
  id: string;
  /** the number on the stub and in the eyebrow */
  no: string;
  /** the stub's name */
  name: string;
  /** the stub's footnote */
  note: string;
  /** the chapter eyebrow after the number */
  eyebrow: string;
}

export const stops: Stop[] = [
  { id: "brain", no: "01", name: "Brain", note: "Plain Markdown", eyebrow: "The brain" },
  { id: "notes", no: "02", name: "Notes", note: "Every session", eyebrow: "Session notes" },
  { id: "studio", no: "03", name: "Studio", note: "4 roles", eyebrow: "The studio" },
  { id: "proof", no: "04", name: "Proof", note: "2 ship stories", eyebrow: "Proof" },
  { id: "setup", no: "05", name: "Setup", note: "3 prompts", eyebrow: "Setup" },
];

export function stop(id: string): Stop {
  const found = stops.find((s) => s.id === id);
  if (!found) throw new Error(`agent-kit: no stop "${id}"`);
  return found;
}

/** "03 · The studio" */
export const eyebrowOf = (id: string) => `${stop(id).no} · ${stop(id).eyebrow}`;
