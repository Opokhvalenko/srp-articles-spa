import type { ZodType } from "zod";
import {
	type Article,
	type ArticleApi,
	ArticleApiSchema,
	ArticleSchema,
	ArticlesApiResponseSchema,
} from "../features/articles/types";

const BASE_URL = "https://api.spaceflightnewsapi.net/v4";
const ARTICLES_URL = `${BASE_URL}/articles/?limit=100`;

const fetchJson = async (url: string): Promise<unknown> => {
	const response = await fetch(url, {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		console.error("Articles API error response:", {
			url,
			status: response.status,
			statusText: response.statusText,
			bodyPreview: text.slice(0, 300),
		});

		throw new Error(
			`Failed to fetch articles. Status: ${response.status} ${response.statusText}`,
		);
	}

	const contentType = response.headers.get("content-type") ?? "";

	if (!contentType.includes("application/json")) {
		const text = await response.text().catch(() => "");
		console.error("Articles API returned non-JSON response:", {
			url,
			contentType,
			bodyPreview: text.slice(0, 300),
		});

		throw new Error(
			`Unexpected response from API (expected JSON, got ${contentType || "unknown"}).`,
		);
	}

	return response.json();
};

const fetchAndParse = async <T>(
	url: string,
	schema: ZodType<T>,
): Promise<T> => {
	const json = await fetchJson(url);
	return schema.parse(json);
};

const toArticle = (api: ArticleApi): Article =>
	ArticleSchema.parse({
		id: api.id,
		title: api.title,
		description: api.summary,
	});

export const fetchArticles = async (): Promise<Article[]> => {
	const parsed = await fetchAndParse(ARTICLES_URL, ArticlesApiResponseSchema);
	return parsed.results.map(toArticle);
};

export const getArticleById = async (id: string): Promise<Article> => {
	const apiArticle = await fetchAndParse(
		`${BASE_URL}/articles/${id}`,
		ArticleApiSchema,
	);
	return toArticle(apiArticle);
};
