/*
 * /agent-kit's scroll story (AK-4). Plain DOM, no animation library; CSS does the motion.
 *
 * 1. The driver. Chapter tops are measured once (and again on ResizeObserver / resize), never per
 *    frame: a scroll only schedules one rAF, which reads scrollY and compares it with the cached
 *    tops. It writes data-ch on .ak (the current stop, with hysteresis so a boundary can't flicker),
 *    aria-current="step" on every rail link for that stop, and data-in on each chapter once it has
 *    scrolled in (data-seen on .ak is the furthest one). Writes happen only when a value changes.
 *
 * 2. The studio moment: one ticket, lead → worker → evaluator → shipper.
 *      init ──(Run ticket, or ≥50% of the board in view while untouched)──▶ playing ──▶ end
 *      init / playing ──(scrolled past, Pause motion, the bug switch mid-run)──▶ done (lands at
 *      the end state at once, no burst)
 *    Run ticket replays from end or done. With reduced motion the board keeps the AK-3 still until
 *    Run ticket, which lands the end state at once; with Pause motion on, the moment sits at its end.
 *    Each step is announced in the polite log ("Evaluator: sent back — TypeError on /list"), and
 *    the bug switch's outcome region (#studio-outcome) is rewritten to the one current sentence.
 *
 * 3. Pause motion: aria-pressed, saved in localStorage "ak-motion", applied before first paint by
 *    the inline script in index.astro (html[data-motion="paused"]). It pauses every loop (CSS),
 *    shows every chapter, and lands the moment at its end.
 */
import { stops } from "./stops";

type Lane = "lead" | "worker" | "eval" | "ship";
type At = "here" | "past" | undefined;
interface Step {
  /** lead, worker, eval, ship: h = the ticket is here, p = it passed through, . = empty */
  lanes: string;
  dir: "drop" | "on" | "back";
  eval: "fail" | "pass";
  /** round 2: the worker's fix and the evaluator's second round */
  round2?: boolean;
  returned?: boolean;
  stamp?: boolean;
  say: string;
}

const LANES: Lane[] = ["lead", "worker", "eval", "ship"];
const lead: Step = { lanes: "h...", dir: "drop", eval: "fail", say: "Lead: PANTRY-4 planned, 3 testable criteria" };
const worker: Step = { lanes: "ph..", dir: "on", eval: "fail", say: "Worker: built on branch pantry-4, test added" };
const RUNS: Record<"bug" | "clean", Step[]> = {
  bug: [
    lead,
    worker,
    { lanes: "pph.", dir: "on", eval: "fail", stamp: true, say: "Evaluator: sent back. TypeError on /list" },
    { lanes: "php.", dir: "back", eval: "fail", returned: true, round2: true, say: "Worker: PANTRY-4 is back, fix pushed for round 2" },
    { lanes: "pph.", dir: "on", eval: "pass", returned: true, round2: true, stamp: true, say: "Evaluator: pass, round 2 of 3" },
    { lanes: "ppph", dir: "on", eval: "pass", returned: true, round2: true, say: "Shipper: PANTRY-4 is live" },
  ],
  clean: [
    { ...lead, eval: "pass" },
    { ...worker, eval: "pass" },
    { lanes: "pph.", dir: "on", eval: "pass", stamp: true, say: "Evaluator: pass, all 3 criteria" },
    { lanes: "ppph", dir: "on", eval: "pass", say: "Shipper: PANTRY-4 is live" },
  ],
};
const SUMMARY = {
  bug: "Run complete. Evaluator sent PANTRY-4 back for a TypeError on /list, round 2 passed, and the shipper put it live.",
  clean: "Run complete. Evaluator passed PANTRY-4 first time and the shipper put it live.",
};
const NOTE = {
  init: "Press Run ticket, or keep scrolling and it plays once.",
  playing: "Running the ticket.",
  end: "Showing the end of the run.",
};
const MOTION_KEY = "ak-motion";
/** how far past a boundary (px) the reading line must go before the current chapter changes */
const HYSTERESIS = 48;

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let teardown: (() => void) | null = null;

function ms(value: string, fallback: number) {
  const v = value.trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return fallback;
  return v.endsWith("ms") ? n : v.endsWith("s") ? n * 1000 : n;
}

function isPaused() {
  return document.documentElement.dataset.motion === "paused";
}

function init() {
  const ak = document.querySelector<HTMLElement>(".ak");
  if (!ak) return;
  const cleanups: Array<() => void> = [];
  const listen = (t: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) => {
    t.addEventListener(type, fn, opts);
    cleanups.push(() => t.removeEventListener(type, fn, opts));
  };

  // re-apply the saved choice after a client-side navigation (the router replaces <html>'s attributes)
  try {
    if (localStorage.getItem(MOTION_KEY) === "paused") document.documentElement.dataset.motion = "paused";
  } catch {}

  /* ---------- 1. the driver ---------- */
  const sections = stops.map((s) => document.getElementById(s.id));
  const links = stops.map((s) => Array.from(document.querySelectorAll<HTMLAnchorElement>(`[data-stop-link="${s.id}"]`)));
  const rail = document.querySelector<HTMLElement>("[data-story-rail]");
  const studioAt = stops.findIndex((s) => s.id === "studio");
  let skipMoment: (() => void) | null = null;
  let tops: number[] = [];
  let vh = innerHeight;
  let cur = -1; // stop index, -1 = hero
  let seen = -1;
  let ticking = false;

  function setCh(i: number) {
    if (i === cur) return;
    links[cur]?.forEach((a) => a.removeAttribute("aria-current"));
    links[i]?.forEach((a) => a.setAttribute("aria-current", "step"));
    cur = i;
    ak!.dataset.ch = String(i + 1);
    // jumped past the studio (a rail link, Home/End): the IntersectionObserver never saw it, so settle it
    if (i > studioAt) skipMoment?.();
  }

  function update() {
    ticking = false;
    const y = scrollY;
    const line = y + vh * 0.4;
    let i = -1;
    for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k;
    if (i !== cur) {
      // forward as soon as the reading line crosses the next top; back only once it is
      // HYSTERESIS above the current chapter's top, so a boundary never flickers
      const backEdge = (tops[cur] ?? 0) - HYSTERESIS;
      if (cur === -2 || i > cur || line <= backEdge || cur - i > 1) setCh(i);
    }
    const reveal = y + vh * 0.85;
    while (seen + 1 < tops.length && tops[seen + 1] <= reveal) {
      seen++;
      sections[seen]?.setAttribute("data-in", "");
      ak!.dataset.seen = String(seen + 1);
    }
  }

  function schedule() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function measure() {
    vh = innerHeight;
    const y = scrollY;
    tops = sections.map((s) => (s ? s.getBoundingClientRect().top + y : Infinity));
    schedule();
  }

  ak.dataset.story = "";
  if (rail) rail.hidden = false;
  cur = -2; // first update sets data-ch without hysteresis
  measure();
  listen(window, "scroll", schedule, { passive: true });
  listen(window, "resize", measure);
  const ro = new ResizeObserver(measure);
  ro.observe(ak);
  cleanups.push(() => ro.disconnect());

  /* ---------- 2. the studio moment ---------- */
  const moment = document.querySelector<HTMLElement>("[data-studio-moment]");
  if (moment) {
    const m = initMoment(moment, listen);
    skipMoment = m.skip;
    cleanups.push(m.dispose);
    if (cur > studioAt) m.skip();
  }

  teardown = () => {
    cleanups.forEach((fn) => fn());
    teardown = null;
  };
}

function initMoment(moment: HTMLElement, listen: (t: EventTarget, type: string, fn: EventListener) => void) {
  const runBtn = moment.querySelector<HTMLButtonElement>("[data-run-ticket]");
  const pauseBtn = moment.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  const bug = moment.querySelector<HTMLInputElement>(".ak-bug-input");
  const log = moment.querySelector<HTMLElement>("[data-studio-log]");
  const note = moment.querySelector<HTMLElement>("#studio-still");
  const board = moment.querySelector<HTMLElement>(".ak-board");
  const lanes = Object.fromEntries(LANES.map((l) => [l, moment.querySelector<HTMLElement>(`[data-lane="${l}"]`)])) as Record<Lane, HTMLElement | null>;
  const alts = Array.from(moment.querySelectorAll<HTMLElement>("[data-alt]")).map((el) => ({ el, orig: el.textContent ?? "", alt: el.dataset.alt ?? "" }));

  // durations from the showcase tokens, read once
  const css = getComputedStyle(moment);
  const travel = ms(css.getPropertyValue("--motion-showcase-travel"), 700);
  const stamp = ms(css.getPropertyValue("--motion-showcase-stamp"), 300);
  const beat = travel + stamp; // a step: the ticket arrives, then a beat to read it
  const stampBeat = beat + stamp; // a verdict: the stamp locks in after the ticket lands, then holds

  let state: "still" | "init" | "playing" | "end" | "done" = "still";
  let timer = 0;
  const mode = () => (bug?.checked ? "bug" : "clean") as "bug" | "clean";

  moment.dataset.enhanced = "";

  // the bug switch's live region holds only the current sentence (AC7): its two static spans are
  // the no-JS fallback (swapped by CSS); with script the region's text is set on every change
  const outcome = moment.querySelector<HTMLElement>("#studio-outcome");
  const sentence = (when: string) => outcome?.querySelector(`[data-when="${when}"]`)?.textContent?.trim() ?? "";
  const sentences = { bug: sentence("bug"), clean: sentence("clean") };
  const setOutcome = () => {
    if (outcome) outcome.textContent = sentences[mode()];
  };
  setOutcome();
  if (runBtn) runBtn.disabled = false;
  if (pauseBtn) {
    pauseBtn.disabled = false;
    pauseBtn.textContent = "Pause motion";
    pauseBtn.removeAttribute("aria-describedby");
    pauseBtn.setAttribute("aria-pressed", String(isPaused()));
  }

  function say(text: string) {
    if (log) log.textContent = text;
  }

  function setNote(text: string) {
    if (note) note.textContent = text;
  }

  function render(step: Step, run: "bug" | "clean", instant: boolean) {
    moment.toggleAttribute("data-instant", instant);
    moment.dataset.run = run;
    moment.dataset.eval = step.eval;
    moment.dataset.dir = step.dir;
    moment.toggleAttribute("data-returned", !!step.returned);
    alts.forEach(({ el, orig, alt }) => (el.textContent = step.round2 ? alt : orig));
    LANES.forEach((l, i) => {
      const code = step.lanes[i];
      const at: At = code === "h" ? "here" : code === "p" ? "past" : undefined;
      const el = lanes[l];
      if (!el) return;
      if (at) el.dataset.at = at;
      else el.removeAttribute("data-at");
    });
    moment.dataset.step = step.lanes;
  }

  function renderEmpty() {
    moment.removeAttribute("data-instant");
    moment.dataset.run = mode();
    moment.dataset.eval = mode() === "bug" ? "fail" : "pass";
    moment.dataset.dir = "drop";
    moment.removeAttribute("data-returned");
    alts.forEach(({ el, orig }) => (el.textContent = orig));
    LANES.forEach((l) => lanes[l]?.removeAttribute("data-at"));
    moment.dataset.step = "....";
  }

  function land(announce: boolean) {
    window.clearTimeout(timer);
    const run = mode();
    const steps = RUNS[run];
    render(steps[steps.length - 1], run, true);
    state = announce ? "end" : "done";
    setNote(NOTE.end);
    if (runBtn) runBtn.textContent = "Run again";
    if (announce) say(SUMMARY[run]);
  }

  function play() {
    window.clearTimeout(timer);
    if (reduced.matches || isPaused()) {
      land(true);
      return;
    }
    const run = mode();
    const steps = RUNS[run];
    state = "playing";
    setNote(NOTE.playing);
    if (runBtn) runBtn.textContent = "Run again";
    // a frame on the empty board first, so the lead's drop starts fresh on a replay
    renderEmpty();
    let i = 0;
    const next = () => {
      const step = steps[i];
      render(step, run, false);
      say(step.say);
      i++;
      if (i < steps.length) timer = window.setTimeout(next, step.stamp ? stampBeat : beat);
      else
        timer = window.setTimeout(() => {
          state = "end";
          setNote(NOTE.end);
        }, beat);
    };
    // one style flush on the empty board, so a replay restarts the lead's drop (not in the scroll path)
    void board?.offsetWidth;
    next();
  }

  // the start: reduced motion keeps the AK-3 still; Pause motion sits at the end; else an empty rail
  if (reduced.matches) state = "still";
  else if (isPaused()) land(false);
  else {
    renderEmpty();
    state = "init";
    setNote(NOTE.init);
  }

  if (runBtn) listen(runBtn, "click", play);

  if (bug)
    listen(bug, "change", () => {
      setOutcome();
      // mid-run or after it: the board shows the new outcome's end at once (no burst)
      if (state === "playing" || state === "end" || state === "done") land(false);
    });

  if (pauseBtn)
    listen(pauseBtn, "click", () => {
      const paused = !isPaused();
      if (paused) document.documentElement.dataset.motion = "paused";
      else delete document.documentElement.dataset.motion;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      try {
        if (paused) localStorage.setItem(MOTION_KEY, "paused");
        else localStorage.removeItem(MOTION_KEY);
      } catch {}
      if (paused && (state === "playing" || state === "init")) land(false);
    });

  // visitor can, else it plays itself once ≥50% of the board is in view; scrolled past → lands
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      const root = entry.rootBounds?.height || innerHeight;
      const shown = Math.max(entry.intersectionRatio, entry.intersectionRect.height / root);
      if (state === "init" && shown >= 0.5) play();
      // skipped (scrolled past while untouched) or left mid-run: settle finished
      else if (state === "init" && !entry.isIntersecting && entry.boundingClientRect.top < 0) land(false);
      else if (state === "playing" && !entry.isIntersecting) land(false);
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );
  if (board) io.observe(board);

  return {
    skip: () => {
      if (state === "init") land(false);
    },
    dispose: () => {
      window.clearTimeout(timer);
      io.disconnect();
    },
  };
}

document.addEventListener("astro:page-load", () => {
  teardown?.();
  init();
});
document.addEventListener("astro:before-swap", () => teardown?.());
