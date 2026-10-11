// Prints the /resume page to public/files/marcelo_rondon-resume.pdf with
// headless Chrome. Shared by `pnpm resume:pdf` and the dev-only resume import
// on /resume (src/integrations/resumeSync.ts).
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { promisify } from "node:util";

export const OUT_PATH = "public/files/marcelo_rondon-resume.pdf";

export function findChrome() {
  return [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ]
    .filter(Boolean)
    .find((path) => existsSync(path));
}

export async function printResumePdf(pageUrl) {
  const chrome = findChrome();
  if (!chrome) {
    throw new Error("Chrome not found. Set CHROME_PATH to a Chrome/Chromium binary.");
  }
  await promisify(execFile)(chrome, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=10000",
    `--print-to-pdf=${OUT_PATH}`,
    pageUrl,
  ]);
}
