// /agent-kit/prompts/<file>: each kit prompt as a download: one header line (prompt, version,
// date, where the latest lives), a blank line, then its source file byte for byte.
import type { APIRoute, GetStaticPaths } from "astro";
import { prompts, promptDownload } from "@/lib/agent-kit/prompts";

export const getStaticPaths = (() => prompts.map((p) => ({ params: { file: p.file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(new Uint8Array(promptDownload(String(params.file))), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
