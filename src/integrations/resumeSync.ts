// Dev-only endpoints behind the "Import from Ghosted" panel on /resume.
// The live site is static, so imports only exist while `pnpm dev` runs.
//
//   POST /__resume-sync/preview  body: Ghosted JSON export → { changes, notes }
//   POST /__resume-sync/apply    same body → writes cv.json, then regenerates the PDF
//   GET  /__resume-sync/status   → PDF job state (survives the reload cv.json triggers)
import type { AstroIntegration } from "astro";
import type { IncomingMessage, ServerResponse } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { mergeJsonResume } from "../lib/mergeJsonResume";
// Plain .mjs so `pnpm resume:pdf` can run it without a build step.
import { printResumePdf } from "../../scripts/resume-pdf.mjs";

type PdfJob = { state: "idle" | "printing" | "done" | "error"; error?: string; finishedAt?: number };

export default function resumeSync(): AstroIntegration {
  return {
    name: "resume-sync",
    hooks: {
      "astro:server:setup": ({ server }) => {
        const cvPath = resolve(server.config.root, "cv.json");
        let pdf: PdfJob = { state: "idle" };

        const send = (res: ServerResponse, status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        const readExport = async (req: IncomingMessage) => {
          let raw = "";
          for await (const chunk of req) raw += chunk;
          const data = JSON.parse(raw);
          if (!data || typeof data.basics !== "object") throw new Error("That file isn't a JSON Resume export.");
          return data;
        };

        // Wait until Vite has seen the new cv.json, so the printed page isn't stale.
        const cvReloaded = () =>
          new Promise<void>((done) => {
            const fallback = setTimeout(done, 3000);
            const onChange = (file: string) => {
              if (resolve(file) !== cvPath) return;
              server.watcher.off("change", onChange);
              clearTimeout(fallback);
              setTimeout(done, 500);
            };
            server.watcher.on("change", onChange);
          });

        server.middlewares.use("/__resume-sync", async (req, res) => {
          try {
            if (req.method === "GET" && req.url === "/status") return send(res, 200, pdf);
            if (req.method !== "POST" || (req.url !== "/preview" && req.url !== "/apply")) return send(res, 404, { error: "Not found" });

            const result = mergeJsonResume(readFileSync(cvPath, "utf8"), await readExport(req));
            if (req.url === "/preview" || !result.changes.length) return send(res, 200, { changes: result.changes, notes: result.notes });
            if (pdf.state === "printing") return send(res, 409, { error: "Still regenerating the last PDF. Try again in a moment." });

            const reloaded = cvReloaded();
            writeFileSync(cvPath, result.text);
            pdf = { state: "printing" };
            const pageUrl = `http://${req.headers.host}/resume`;
            reloaded
              .then(() => printResumePdf(pageUrl))
              .then(() => (pdf = { state: "done", finishedAt: Date.now() }))
              .catch((err: Error) => (pdf = { state: "error", error: err.message, finishedAt: Date.now() }));
            send(res, 200, { changes: result.changes, notes: result.notes });
          } catch (err) {
            send(res, 400, { error: (err as Error).message });
          }
        });
      },
    },
  };
}
