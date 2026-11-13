// /agent-kit/prompts/<file>: each kit prompt as a download, byte for byte its source file.
import type { APIRoute, GetStaticPaths } from "astro";
import { prompts, promptBytes } from "@/lib/agent-kit/prompts";

export const getStaticPaths = (() => prompts.map((p) => ({ params: { file: p.file } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(new Uint8Array(promptBytes(String(params.file))), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
