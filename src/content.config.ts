import { defineCollection, z } from "astro:content";

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
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string().optional(),
		url: z.string().url().optional(),
		github: z.string().url().optional(),
		techStack: z.array(z.string()),
		role: z.string(),
		highlights: z.array(z.string()),
		featured: z.boolean().default(false),
		order: z.number().default(0),
		// Media galleries - array of gallery sections
		media: z.array(mediaGallery).optional(),
	}),
});

const visuals = defineCollection({
	type: "content",
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
	type: "content",
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
