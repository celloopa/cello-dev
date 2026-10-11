// Regenerates public/files/marcelo_rondon-resume.pdf from the live /resume
// page so the download can never drift from cv.json. Boots a temporary Astro
// dev server, prints via headless Chrome, then shuts the server down.
import { spawn } from "node:child_process";
import { findChrome, printResumePdf, OUT_PATH } from "./resume-pdf.mjs";

const PORT = 4399;
const PAGE_URL = `http://localhost:${PORT}/resume`;

if (!findChrome()) {
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
  await printResumePdf(PAGE_URL);
  console.log(`Wrote ${OUT_PATH}`);
} finally {
  server.kill();
}
