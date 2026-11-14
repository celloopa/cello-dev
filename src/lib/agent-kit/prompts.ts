// The three Agent Studio Kit prompts. Each one has a single source, a Markdown file in
// src/content/agent-kit/prompts/, read as bytes at build time: the page shows that text and
// /agent-kit/prompts/<file> serves the same bytes, so the two can't drift.
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "src/content/agent-kit/prompts");

export type Prompt = {
  file: string;
  no: string;
  title: string;
  summary: string;
  needs: string;
  time?: string;
};

export const prompts: Prompt[] = [
  {
    file: "1-second-brain.md",
    no: "01",
    title: "Set up the second brain",
    summary: "Creates the folders, the rules your agents follow, and a few commands.",
    needs: "Needs: nothing",
    time: "About 30 minutes",
  },
  {
    file: "2-session-notes.md",
    no: "02",
    title: "Automatic session notes and habits",
    summary: "Logs every session, writes a nightly digest, and adds morning, weekly and monthly routines.",
    needs: "Needs: prompt 01",
  },
  {
    file: "3-studio-pipeline.md",
    no: "03",
    title: "The studio pipeline",
    summary: "Sets up the tools, the four roles, self-testing, hosting and local AI, then builds a first app end to end.",
    needs: "Needs: prompts 01 and 02",
  },
];

// Version, last-checked date and changelog per prompt live in meta.json beside the prompts, so
// upkeep edits data, not markup, and the .md files stay exactly the prompt text. The upkeep check
// that proposes changes is described in Cello Brain (registry/agent-kit-upkeep.md).
type Change = { version: string; date: string; note: string };
type Meta = { version: string; checked: string; changes: Change[] };
const meta: Record<string, Meta> = JSON.parse(fs.readFileSync(path.join(DIR, "meta.json"), "utf8"));

export const promptMeta = (file: string): Meta => {
  const m = meta[file];
  if (!m?.version || !m?.checked) throw new Error(`src/content/agent-kit/prompts/meta.json has no version and checked date for ${file}`);
  if (!m.changes?.length || m.changes[0].version !== m.version)
    throw new Error(`src/content/agent-kit/prompts/meta.json: ${file} needs a changelog whose first entry is v${m.version}`);
  return m;
};

export const promptBytes =(file: string): Buffer => {
  if (!prompts.some((p) => p.file === file)) throw new Error(`Unknown agent-kit prompt: ${file}`);
  return fs.readFileSync(path.join(DIR, file));
};

export const promptText = (file: string): string => promptBytes(file).toString("utf8");

/** The first line of each download: which prompt, its version and date, and where the latest is. */
export const downloadHeader = (file: string): string => {
  const p = prompts.find((x) => x.file === file);
  const m = promptMeta(file);
  return `<!-- Agent Studio Kit, prompt ${p?.no} of 03, v${m.version}, last checked ${m.checked}. Latest: https://cello.design/agent-kit/ -->\n\n`;
};

/** A download is the header line, a blank line, then the prompt's source bytes unchanged. */
export const promptDownload = (file: string): Buffer =>
  Buffer.concat([Buffer.from(downloadHeader(file), "utf8"), promptBytes(file)]);
