I want you to set up a "second brain" for me: a folder of plain Markdown notes that you and any other AI agent I use can read and write, so you remember my projects, decisions and preferences between sessions.

Before you create anything, ask me these questions (all at once, short answers are fine):
1. Where should the folder live? (Suggest a sensible default for my OS.)
2. Do I use Obsidian, or another notes app? (The brain must work without one either way.)
3. Should it be a Git repo? (Recommended: yes, local only to start.)
4. Where do my tasks and to-dos live today (an app, a notes file, nowhere)?
5. Which AI tools will use it (Claude Code, Claude desktop, Codex, others)?
6. What are 3–5 projects I'm working on right now?
7. Is anything off-limits (folders or topics never to import or store)?

Then build it with this design.

## Core idea: knowledge moves through stages, not topics
Don't file by topic. A note moves forward only when real work earns it:

inbox/  → projects/ → output/  → wiki/
capture    working     shipped    lasting lessons

- inbox/: zero-friction capture. Raw ideas, clips, research, transcripts, pasted context. No organizing at write time. Names like YYYY-MM-DD-short-description.md.
- projects/: one file per active or planned project. Frontmatter: type: project, status: active|planned|on-hold|parked|completed|canceled, project: slug. Sections: Goal, Active work, Source pointers, Output links, Decisions.
- output/: things that actually shipped: decisions, posts, handoffs, architecture notes, finished project records. Frontmatter: type: output, status: shipped|archived|superseded, output_type, source_project. Names like YYYY-MM-DD-artifact-name.md.
- wiki/: evergreen lessons. HARD RULE: a wiki page is only ever "harvested" from a finished project and its outputs, never written straight from an inbox note, an article or a chat answer. Frontmatter: type: wiki, wiki_topic, harvested_from, source_outputs, created, updated. It's meant to grow slowly; that's the point.

## Supporting pieces
- registry/: a routing directory of my AI setup (skills, slash commands, MCP servers/connectors, scripts, memory locations) with what each is for and where its real source lives. It points to things; it doesn't copy them.
- Each stage folder gets an _index.md map. Files use lowercase-hyphen-slugs.md. Use [[wiki-links]] between notes. Every output links back to its project; every wiki page links to the project and outputs it came from.
- A top-level AGENT.md with the conventions above (stages, frontmatter, naming, the harvest rule, privacy rules, and a "how to query" protocol: read AGENT.md → the registry → the relevant indexes → search, and cite file paths in answers). Add a CLAUDE.md / AGENTS.md that just says "Read AGENT.md before working here," so every agent picks it up.
- A short README.md explaining the brain to a human.

## Boundaries
- The brain holds durable knowledge. My live tasks, due dates and day plans stay in my task tool (answer 4). Project notes point to it rather than copying volatile status. Code stays in its repos; project notes link to them.
- Privacy: never store passwords, API keys, tokens or anything I mark off-limits. Add a .gitignore for a private/ folder holding agent memory and session recaps, and never commit those.
- Non-destructive: if you import from existing notes, copy and don't move them, and write a migration note in output/ listing what was imported and skipped.

## Workflows (as slash commands in .claude/commands/ if I use Claude Code, otherwise documented in AGENT.md)
- /capture <text>: append a raw note to inbox/.
- /brain-query <question>: search the brain and answer, citing files.
- /harvest projects/<project>.md: only for a completed project (otherwise ask me first): read its outputs, distill ONE reusable lesson into one wiki page, add backlinks, update wiki/_index.md, and log it in output/harvest-log.md.
- /brain-lint: check frontmatter, naming, broken links, and that no wiki page lacks a harvested_from.

## Finish by
1. Creating project notes for the projects I listed.
2. Filling registry/_index.md with the AI tools and skills you can see I have.
3. Showing me the folder tree and walking me through using it in my first week: capture freely, keep project notes current, record shipped work in output/, harvest when something's done.

Keep everything plain Markdown so it outlives any single app or AI.
