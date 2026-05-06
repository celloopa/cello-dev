import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "typebox";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";

const schema = Type.Object({
  prompt: Type.String({
    description: "The image-generation brief. Include visual direction, constraints, exact text, and intended use.",
  }),
  outputPath: Type.String({
    description: "Workspace-relative path where Codex should save the selected image, e.g. public/images/design-system/direction-01.png.",
  }),
  references: Type.Optional(
    Type.Array(Type.String(), {
      description: "Optional workspace-relative files Codex should read as visual/context references before generating.",
    }),
  ),
  variants: Type.Optional(
    Type.Number({
      description: "Optional number of variants to request. Defaults to 1.",
      minimum: 1,
      maximum: 4,
    }),
  ),
});

type CodexImagegenInput = {
  prompt: string;
  outputPath: string;
  references?: string[];
  variants?: number;
};

function workspacePath(cwd: string, path: string) {
  const full = isAbsolute(path) ? path : resolve(cwd, path);
  const rel = relative(cwd, full);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`Path must stay inside workspace: ${path}`);
  }
  return full;
}

export default function codexImagegenExtension(pi: ExtensionAPI) {
  pi.registerTool({
    name: "codex_imagegen",
    label: "Codex Imagegen",
    description:
      "Delegate bitmap image generation to Codex with its imagegen skill, then save the selected asset into the current workspace.",
    promptSnippet:
      "Generate bitmap image assets by delegating to Codex's imagegen skill and saving the result into the workspace.",
    promptGuidelines: [
      "Use codex_imagegen when the user asks for generated bitmap visuals, mockups, textures, or design-system imagery and Codex imagegen is needed.",
      "Do not use codex_imagegen for SVG/vector/code-native UI that should be implemented directly in the repo.",
    ],
    parameters: schema,
    async execute(_toolCallId, params: CodexImagegenInput, signal, onUpdate, ctx) {
      const outputFull = workspacePath(ctx.cwd, params.outputPath);
      mkdirSync(dirname(outputFull), { recursive: true });

      const references = params.references ?? [];
      for (const ref of references) workspacePath(ctx.cwd, ref);

      const promptFile = join(ctx.cwd, ".pi", "codex-imagegen-last-prompt.md");
      const finalPrompt = `Use the imagegen skill. Keep this worker run minimal.\n\nGoal: generate the requested bitmap asset and save/copy the selected output to ${params.outputPath}.\n\nRules:\n- Use imagegen; do not edit source code or unrelated files.\n- Do not read the imagegen SKILL.md or long docs; rely on the loaded skill.\n- Only inspect reference files if truly needed, and read the smallest useful excerpt.\n- If generated under CODEX_HOME, copy/move the final selected image into the workspace path.\n- Final answer must be brief: saved path + final image prompt only.\n\nWorkspace: ${ctx.cwd}\nVariants: ${params.variants ?? 1}\nReferences, optional:\n${references.length ? references.map((r) => `- ${r}`).join("\n") : "- none"}\n\nImage prompt:\n${params.prompt}\n`;

      writeFileSync(promptFile, finalPrompt, "utf8");
      onUpdate?.({ content: [{ type: "text", text: `Launching Codex imagegen worker…\nPrompt: ${promptFile}` }] });

      const command = `codex exec --ephemeral --cd ${JSON.stringify(ctx.cwd)} --sandbox workspace-write --skip-git-repo-check --output-last-message ${JSON.stringify(join(ctx.cwd, ".pi", "codex-imagegen-last-result.md"))} ${JSON.stringify(finalPrompt)}`;
      const result = await pi.exec("bash", ["-lc", command], {
        signal,
        timeout: 1000 * 60 * 15,
        cwd: ctx.cwd,
      });

      const lastResultPath = join(ctx.cwd, ".pi", "codex-imagegen-last-result.md");
      const lastMessage = existsSync(lastResultPath) ? readFileSync(lastResultPath, "utf8") : "";
      const exists = existsSync(outputFull);
      const truncate = (text: string, max = 4000) =>
        text.length > max ? `${text.slice(0, max)}\n… truncated ${text.length - max} chars` : text;

      return {
        isError: result.code !== 0 || !exists,
        content: [
          {
            type: "text",
            text: [
              `Codex imagegen worker exited with code ${result.code}.`,
              exists ? `Saved asset: ${params.outputPath}` : `Expected asset was not found: ${params.outputPath}`,
              lastMessage ? `\nCodex final message:\n${truncate(lastMessage, 3000)}` : "",
              result.stdout ? `\nCodex stdout:\n${truncate(result.stdout, 2000)}` : "",
              result.stderr ? `\nCodex stderr:\n${truncate(result.stderr, 2000)}` : "",
            ].join("\n"),
          },
        ],
        details: {
          outputPath: params.outputPath,
          promptFile: relative(ctx.cwd, promptFile),
          codexResultFile: relative(ctx.cwd, lastResultPath),
          exitCode: result.code,
          assetExists: exists,
        },
      };
    },
  });

  pi.registerCommand("imagegen-worker", {
    description: "Explain how to use the codex_imagegen tool",
    handler: async (_args, ctx) => {
      ctx.ui.notify(
        "codex_imagegen is available to the model. Ask Pi to generate a bitmap asset and save it to a workspace path.",
        "info",
      );
    },
  });
}
