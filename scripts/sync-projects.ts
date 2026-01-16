#!/usr/bin/env npx tsx

/**
 * Auto-sync script for portfolio project entries
 * Fetches data from GitHub repos and updates project MDX and cv.json
 *
 * Usage:
 *   pnpm sync-projects <github-url>
 *   pnpm sync-projects https://github.com/celloopa/ghosted
 */

import * as fs from "fs";
import * as path from "path";

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projects");

interface GitHubRepo {
  name: string;
  description: string;
  topics: string[];
  language: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}

interface RepoData {
  repo: GitHubRepo;
  readme: string;
  commits: GitHubCommit[];
  features: string[];
  recentChanges: string[];
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function fetchGitHubData(
  owner: string,
  repo: string
): Promise<RepoData | null> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "cello-dev-sync-script",
  };

  // Add token if available
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // Fetch repo info
    const repoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    if (!repoRes.ok) {
      console.error(`Failed to fetch repo: ${repoRes.status}`);
      return null;
    }
    const repoData: GitHubRepo = await repoRes.json();

    // Fetch README
    let readme = "";
    try {
      const readmeRes = await fetch(
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
      );
      if (readmeRes.ok) {
        readme = await readmeRes.text();
      }
    } catch {
      // Try master branch
      try {
        const readmeRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
        );
        if (readmeRes.ok) {
          readme = await readmeRes.text();
        }
      } catch {
        console.warn("Could not fetch README");
      }
    }

    // Fetch recent commits
    const commitsRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=20`,
      { headers }
    );
    const commits: GitHubCommit[] = commitsRes.ok
      ? await commitsRes.json()
      : [];

    // Extract features from README
    const features = extractFeatures(readme);

    // Extract recent changes from commits
    const recentChanges = extractRecentChanges(commits);

    return {
      repo: repoData,
      readme,
      commits,
      features,
      recentChanges,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
}

function extractFeatures(readme: string): string[] {
  const features: string[] = [];

  // Look for feature sections in README
  const featurePatterns = [
    /## Features?\n([\s\S]*?)(?=\n##|\n$)/gi,
    /## Core Features?\n([\s\S]*?)(?=\n##|\n$)/gi,
    /## Key Features?\n([\s\S]*?)(?=\n##|\n$)/gi,
    /## Capabilities\n([\s\S]*?)(?=\n##|\n$)/gi,
    /\*\*([^*]+)\*\*\n([^*\n]+)/g,
  ];

  for (const pattern of featurePatterns) {
    const matches = readme.matchAll(pattern);
    for (const match of matches) {
      const section = match[1] || match[0];
      // Extract bullet points
      const bullets = section.match(/[-*]\s+(.+)/g);
      if (bullets) {
        features.push(...bullets.map((b) => b.replace(/^[-*]\s+/, "").trim()));
      }
    }
  }

  // Also look for bold feature descriptions
  const boldFeatures = readme.matchAll(/\*\*([^*]+)\*\*/g);
  for (const match of boldFeatures) {
    if (
      match[1].length > 10 &&
      match[1].length < 100 &&
      !match[1].includes(":")
    ) {
      features.push(match[1]);
    }
  }

  return [...new Set(features)].slice(0, 20);
}

function extractRecentChanges(commits: GitHubCommit[]): string[] {
  const changes: string[] = [];

  for (const commit of commits.slice(0, 10)) {
    const msg = commit.commit.message.split("\n")[0];
    // Skip merge commits and trivial commits
    if (msg.startsWith("Merge") || msg.length < 10) continue;
    changes.push(msg);
  }

  return changes;
}

function findProjectMdx(repoUrl: string): string | null {
  const files = fs.readdirSync(PROJECTS_DIR);
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const content = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    if (content.includes(repoUrl)) {
      return path.join(PROJECTS_DIR, file);
    }
  }
  return null;
}

function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = match[2];

  // Simple YAML parsing for our use case
  const frontmatter: Record<string, unknown> = {};
  let currentKey = "";
  let inArray = false;
  let arrayItems: string[] = [];

  for (const line of frontmatterStr.split("\n")) {
    if (line.match(/^(\w+):\s*$/)) {
      // Start of array
      if (inArray && currentKey) {
        frontmatter[currentKey] = arrayItems;
      }
      currentKey = line.match(/^(\w+):/)?.[1] || "";
      inArray = true;
      arrayItems = [];
    } else if (line.match(/^\s+-\s+(.+)$/)) {
      // Array item
      const item = line.match(/^\s+-\s+(.+)$/)?.[1];
      if (item) arrayItems.push(item);
    } else if (line.match(/^(\w+):\s*(.+)$/)) {
      // Key-value pair
      if (inArray && currentKey) {
        frontmatter[currentKey] = arrayItems;
        inArray = false;
      }
      const kvMatch = line.match(/^(\w+):\s*(.+)$/);
      if (kvMatch) {
        frontmatter[kvMatch[1]] = kvMatch[2];
      }
    }
  }

  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
  }

  return { frontmatter, body };
}

function generateUpdateSummary(
  data: RepoData,
  existingMdx: string | null
): void {
  console.log("\n" + "=".repeat(60));
  console.log("PROJECT SYNC SUMMARY: " + data.repo.name.toUpperCase());
  console.log("=".repeat(60));

  console.log("\n📦 Repository Info:");
  console.log(`   Name: ${data.repo.name}`);
  console.log(`   Description: ${data.repo.description}`);
  console.log(`   Language: ${data.repo.language}`);
  console.log(`   Topics: ${data.repo.topics.join(", ")}`);
  console.log(`   Last updated: ${data.repo.updated_at}`);

  console.log("\n🔄 Recent Changes:");
  for (const change of data.recentChanges.slice(0, 5)) {
    console.log(`   • ${change}`);
  }

  console.log("\n✨ Extracted Features:");
  for (const feature of data.features.slice(0, 10)) {
    console.log(`   • ${feature}`);
  }

  if (existingMdx) {
    const { frontmatter } = parseFrontmatter(existingMdx);
    console.log("\n📄 Current MDX Highlights:");
    const highlights = frontmatter.highlights as string[] | undefined;
    if (highlights) {
      for (const h of highlights) {
        console.log(`   • ${h}`);
      }
    }
  }

  console.log("\n" + "=".repeat(60));
}

function generateSuggestedHighlights(data: RepoData): string[] {
  const highlights: string[] = [];

  // Based on features and commits, generate highlight suggestions
  if (data.repo.topics.includes("tui") || data.readme.includes("TUI")) {
    highlights.push(
      "Full-featured Terminal User Interface with vim-style navigation and keyboard shortcuts"
    );
  }

  if (data.repo.topics.includes("cli") || data.readme.includes("CLI")) {
    highlights.push(
      "Scriptable CLI interface designed for AI agent integration with JSON I/O"
    );
  }

  if (
    data.readme.includes("AI agent") ||
    data.readme.includes("agent pipeline")
  ) {
    highlights.push(
      "Multi-agent pipeline for automated document generation and job application workflow"
    );
  }

  if (
    data.recentChanges.some(
      (c) => c.toLowerCase().includes("compile") || c.includes("PDF")
    )
  ) {
    highlights.push(
      "Document compilation system converting Typst files to PDFs with smart naming"
    );
  }

  if (
    data.recentChanges.some((c) =>
      c.toLowerCase().includes("fetch")
    )
  ) {
    highlights.push(
      "Job board integration fetching postings from Lever, Greenhouse, Workday, LinkedIn"
    );
  }

  return highlights;
}

function generateCvKeywords(data: RepoData): string[] {
  const keywords = new Set<string>();

  // Add language
  if (data.repo.language) keywords.add(data.repo.language);

  // Add topics
  for (const topic of data.repo.topics) {
    keywords.add(topic.charAt(0).toUpperCase() + topic.slice(1));
  }

  // Add common relevant keywords based on features
  if (data.readme.includes("Bubble Tea")) keywords.add("Bubble Tea");
  if (data.readme.includes("TUI")) keywords.add("TUI");
  if (data.readme.includes("CLI")) keywords.add("CLI");
  if (data.readme.includes("AI agent")) keywords.add("AI Integration");
  if (data.readme.includes("open source") || data.readme.includes("MIT"))
    keywords.add("Open Source");

  return [...keywords].slice(0, 8);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Usage: pnpm sync-projects <github-url>");
    console.log("Example: pnpm sync-projects https://github.com/celloopa/ghosted");
    process.exit(1);
  }

  const url = args[0];
  const parsed = parseGitHubUrl(url);

  if (!parsed) {
    console.error("Invalid GitHub URL");
    process.exit(1);
  }

  console.log(`\n🔍 Fetching data for ${parsed.owner}/${parsed.repo}...`);

  const data = await fetchGitHubData(parsed.owner, parsed.repo);
  if (!data) {
    console.error("Failed to fetch repository data");
    process.exit(1);
  }

  // Find existing MDX file
  const mdxPath = findProjectMdx(url);
  const existingMdx = mdxPath ? fs.readFileSync(mdxPath, "utf-8") : null;

  // Generate summary
  generateUpdateSummary(data, existingMdx);

  // Generate suggestions
  console.log("\n💡 SUGGESTED UPDATES:");
  console.log("-".repeat(60));

  const suggestedHighlights = generateSuggestedHighlights(data);
  console.log("\nSuggested MDX Highlights:");
  for (const h of suggestedHighlights) {
    console.log(`   - ${h}`);
  }

  const suggestedKeywords = generateCvKeywords(data);
  console.log("\nSuggested cv.json Keywords:");
  console.log(`   ${JSON.stringify(suggestedKeywords)}`);

  console.log("\n📝 cv.json Project Entry (suggested):");
  const cvEntry = {
    name: data.repo.name.charAt(0).toUpperCase() + data.repo.name.slice(1),
    description: data.repo.description,
    highlights: suggestedHighlights,
    keywords: suggestedKeywords,
    startDate: data.repo.created_at.slice(0, 7),
    url: data.repo.html_url,
    type: "application",
  };
  console.log(JSON.stringify(cvEntry, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("Review the suggestions above and apply updates manually,");
  console.log("or use the --apply flag to auto-update files.");
  console.log("=".repeat(60) + "\n");
}

main().catch(console.error);
