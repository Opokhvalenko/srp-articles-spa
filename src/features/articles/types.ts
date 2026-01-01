import { z } from "zod";

export const ArticleApiSchema = z.object({
	id: z.number(),
	title: z.string(),
	summary: z.string(),
});

export const ArticlesApiResponseSchema = z.object({
	results: z.array(ArticleApiSchema),
});

export type ArticleApi = z.infer<typeof ArticleApiSchema>;

export const ArticleSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
});

export type Article = z.infer<typeof ArticleSchema>;
