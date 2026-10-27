import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const entries = (name: string) => glob({ pattern: "**/*.{md,mdx}", base: `./src/content/${name}` });

// Media item schema for galleries
const mediaItem = z.object({
	src: z.string(),
	alt: z.string().optional(),
	caption: z.string().optional(),
});

// Media gallery schema with layout options
const mediaGallery = z.object({
	layout: z.enum(["full", "two", "three"]),
	items: z.array(mediaItem),
});

const projects = defineCollection({
	loader: entries("projects"),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(),
		ogImage: z.string().optional(), // Static image for social media previews
		url: z.url().optional(),
		github: z.url().optional(),
		techStack: z.array(z.string()),
		role: z.string(),
		// Whose work it is and since when, e.g. "Client · Since January 2022" or "My product · Since July 2026"
		engagement: z.string().optional(),
		highlights: z.array(z.string()),
		// The case study's opening: problem, role, key decision, shipped result (rendered above the section links)
		summary: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
		featured: z.boolean().default(false),
		complete: z.boolean().default(false),
		order: z.number().default(0),
		// Media galleries - array of gallery sections
		media: z.array(mediaGallery).optional(),
	}),
});

const visuals = defineCollection({
	loader: entries("visuals"),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(["packaging", "graphic", "motion", "video", "photography"]),
		image: z.string().optional(),
		tags: z.array(z.string()).optional(),
		featured: z.boolean().default(false),
		order: z.number().default(0),
		media: z.array(mediaGallery).optional(),
	}),
});

const blog = defineCollection({
	loader: entries("blog"),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		image: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().default(false),
	}),
});

export const collections = { projects, visuals, blog };
