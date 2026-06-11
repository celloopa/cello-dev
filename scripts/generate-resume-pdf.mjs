// Regenerates public/files/marcelo_rondon-resume.pdf from the live /resume
// page so the download can never drift from cv.json. Boots a temporary Astro
// dev server, prints via headless Chrome, then shuts the server down.
import { spawn, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const PORT = 4399;
const PAGE_URL = `http://localhost:${PORT}/resume`;
const OUT_PATH = "public/files/marcelo_rondon-resume.pdf";

const chrome = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
]
  .filter(Boolean)
  .find((path) => existsSync(path));

if (!chrome) {
  console.error(
    "Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.",
  );
  process.exit(1);
}

const server = spawn(
  "./node_modules/.bin/astro",
  ["dev", "--port", String(PORT)],
  { stdio: "ignore" },
);

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const res = await fetch(PAGE_URL);
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Dev server did not respond at ${PAGE_URL}`);
}

try {
  await waitForServer();
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=10000",
    `--print-to-pdf=${OUT_PATH}`,
    PAGE_URL,
  ]);
  console.log(`Wrote ${OUT_PATH}`);
} finally {
  server.kill();
}
