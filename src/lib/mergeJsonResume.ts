// Merge a resume exported from Ghosted (its JSON button) into cv.json.
//
// Copied from ghosted-app/scripts/merge-json-resume.ts so the two repos don't
// depend on each other; keep them in step when one changes.
//
// Only the text Ghosted edits is touched: label, summary, contact, job titles,
// dates, locations and bullets, project bullets/links/dates, education. Things
// Ghosted doesn't track (photo, skill levels and keywords, profile network
// names, summaries, project types…) are kept as they are. Entries missing from
// the export are kept and reported, never deleted. Where possible the file's own
// formatting is preserved, so the git diff shows only real changes.

type Obj = Record<string, any>;

export interface MergeResult {
  /** What the export changes, one line each. Empty when cv.json already matches. */
  changes: string[];
  /** Things in cv.json the export doesn't mention, kept as they are. */
  notes: string[];
  /** The merged file contents, ready to write. */
  text: string;
}

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function mergeJsonResume(originalText: string, src: Obj): MergeResult {
  const original: Obj = JSON.parse(originalText);
  const out: Obj = structuredClone(original);
  const changes: string[] = [];
  const notes: string[] = [];

  /** Copy a field from the export when it has a value and differs. */
  function take(target: Obj, from: Obj, key: string, where: string, allowEmpty = false) {
    const v = from[key];
    if (v === undefined || (!allowEmpty && (v === "" || (Array.isArray(v) && !v.length)))) return;
    if (v === "" && !target[key]) return; // "" and a missing key both mean "none / Present"
    if (!same(target[key], v)) {
      changes.push(`${where} · ${key}`);
      target[key] = v;
    }
  }

  // --- basics ---
  const b = (out.basics ??= {});
  const sb: Obj = src.basics ?? {};
  for (const k of ["name", "label", "email", "phone", "url", "summary"]) take(b, sb, k, "basics");
  if (sb.location) {
    b.location ??= {};
    for (const k of ["city", "region"]) take(b.location, sb.location, k, "basics.location");
  }
  for (const p of sb.profiles ?? []) {
    const host = (u: string) => norm(u).replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    const match = (b.profiles ??= []).find((x: Obj) => norm(x.network) === norm(p.network) || host(x.url) === host(p.url));
    if (match) take(match, p, "url", `profile ${match.network}`);
    else {
      b.profiles.push(p);
      changes.push(`basics.profiles · added ${p.network}`);
    }
  }

  // --- work: match by company + position, then by company + start date, then a lone company entry ---
  const used = new Set<Obj>();
  for (const w of src.work ?? []) {
    const byName = (out.work ??= []).filter((x: Obj) => norm(x.name) === norm(w.name) && !used.has(x));
    const t = byName.find((x: Obj) => norm(x.position) === norm(w.position))
      ?? byName.find((x: Obj) => w.startDate && x.startDate === w.startDate)
      ?? (byName.length === 1 ? byName[0] : undefined);
    const where = `work "${w.name}${w.position ? ` · ${w.position}` : ""}"`;
    if (!t) {
      out.work.push(w);
      changes.push(`${where} · added`);
      continue;
    }
    used.add(t);
    for (const k of ["position", "location", "startDate", "highlights"]) take(t, w, k, where);
    take(t, w, "endDate", where, true); // "" = Present, a real change
  }
  for (const t of out.work ?? []) if (!used.has(t) && !(src.work ?? []).some((w: Obj) => norm(w.name) === norm(t.name)))
    notes.push(`kept work "${t.name}" — not in the export`);

  // --- projects (by name) ---
  for (const p of src.projects ?? []) {
    const t = (out.projects ??= []).find((x: Obj) => norm(x.name) === norm(p.name));
    if (!t) {
      out.projects.push(p);
      changes.push(`project "${p.name}" · added`);
      continue;
    }
    for (const k of ["url", "startDate", "highlights"]) take(t, p, k, `project "${p.name}"`);
    take(t, p, "endDate", `project "${p.name}"`, true);
  }

  // --- education (by institution) ---
  for (const e of src.education ?? []) {
    const t = (out.education ??= []).find((x: Obj) => norm(x.institution) === norm(e.institution));
    if (!t) {
      out.education.push(e);
      changes.push(`education "${e.institution}" · added`);
      continue;
    }
    for (const k of ["studyType", "area", "startDate", "endDate"]) take(t, e, k, `education "${e.institution}"`);
  }

  // --- skills: never restructured (levels/keywords live in the site); only new names are added ---
  const have = new Set((out.skills ?? []).flatMap((s: Obj) => [norm(s.name), ...(s.keywords ?? []).map(norm)]));
  for (const s of src.skills ?? []) {
    if (have.has(norm(s.name))) continue;
    (out.skills ??= []).push({ name: s.name, ...(s.keywords ? { keywords: s.keywords } : {}) });
    changes.push(`skills · added "${s.name}"`);
  }
  const srcSkillNames = new Set((src.skills ?? []).flatMap((s: Obj) => [norm(s.name), ...(s.keywords ?? []).map(norm)]));
  for (const s of original.skills ?? []) if (!srcSkillNames.has(norm(s.name))) notes.push(`kept skill "${s.name}" — not in the export`);

  // --- serialize, preserving formatting where the edit is a value swap ---
  function serialize(): string {
    let text = originalText;
    const enc = (v: unknown) => JSON.stringify(v);
    let ok = true;
    const walk = (a: any, b: any) => {
      if (!ok || same(a, b)) return;
      if (a && b && typeof a === "object" && typeof b === "object" && Array.isArray(a) === Array.isArray(b) && (!Array.isArray(a) || a.length === b.length || a.every((x: unknown) => typeof x !== "object"))) {
        if (Array.isArray(a) && a.every((x: unknown) => typeof x === "string") && b.every((x: unknown) => typeof x === "string")) {
          // string list (e.g. highlights): swap the lines in place, keeping indentation
          const m = text.match(new RegExp(`([ \\t]*)${escape(enc(a[0] ?? ""))}`));
          const indent = m?.[1] ?? "";
          const block = a.map(enc).join(`,\n${indent}`);
          if (a.length && text.split(block).length === 2) text = text.replace(block, b.map(enc).join(`,\n${indent}`));
          else ok = false;
          return;
        }
        if (Array.isArray(a)) a.forEach((x: unknown, i: number) => walk(x, b[i]));
        else if (Object.keys(b).every((k) => k in a)) for (const k of Object.keys(b)) walk(a[k], b[k]);
        else ok = false; // a key was added
        return;
      }
      if (typeof a === "string" && typeof b === "string" && text.split(enc(a)).length === 2) text = text.replace(enc(a), enc(b));
      else ok = false;
    };
    walk(original, out);
    return ok && same(JSON.parse(text), out) ? text : `${JSON.stringify(out, null, 2)}\n`;
  }

  return { changes, notes, text: changes.length ? serialize() : originalText };
}
