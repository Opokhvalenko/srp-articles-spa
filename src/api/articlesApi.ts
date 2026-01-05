import type { ZodType } from "zod";
import {
	type Article,
	type ArticleApi,
	ArticleApiSchema,
	ArticleSchema,
	ArticlesApiResponseSchema,
} from "../features/articles/types";
import { formatDateLabel } from "./utils/formatDateLabel";

const API_BASE_URL = "https://api.spaceflightnewsapi.net/v4/";
const ARTICLES_LIMIT = 100;

const REQUEST_TIMEOUT_MS = 12_000;

const buildUrl = (path: string, params?: Record<string, string>): string => {
	const url = new URL(path, API_BASE_URL);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, value);
		}
	}
	return url.toString();
};

const fetchJson = async (url: string): Promise<unknown> => {
	const controller = new AbortController();
	const timeoutId = window.setTimeout(
		() => controller.abort(),
		REQUEST_TIMEOUT_MS,
	);

	try {
		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
			},
			signal: controller.signal,
		});

		if (!response.ok) {
			const bodyPreview = await response.text().catch(() => "");
			console.error("Articles API error response:", {
				url,
				status: response.status,
				statusText: response.statusText,
				bodyPreview: bodyPreview.slice(0, 300),
			});

			throw new Error(
				`Failed to fetch articles. Status: ${response.status} ${response.statusText}`,
			);
		}

		const contentType = response.headers.get("content-type") ?? "";

		if (!contentType.includes("application/json")) {
			const bodyPreview = await response.text().catch(() => "");
			console.error("Articles API returned non-JSON response:", {
				url,
				contentType,
				bodyPreview: bodyPreview.slice(0, 300),
			});

			throw new Error(
				`Unexpected response from API (expected JSON, got ${contentType || "unknown"}).`,
			);
		}

		return response.json();
	} catch (err) {
		const isAbortError =
			err instanceof DOMException && err.name === "AbortError";

		if (isAbortError) {
			throw new Error("Request timed out. Please try again.");
		}

		throw err;
	} finally {
		window.clearTimeout(timeoutId);
	}
};

const fetchAndParse = async <T>(
	url: string,
	schema: ZodType<T>,
): Promise<T> => {
	const json = await fetchJson(url);
	return schema.parse(json);
};

const mapApiArticleToDomain = (api: ArticleApi): Article => {
	const publishedAt = api.published_at ?? "";
	const imageUrl = api.image_url ?? "";

	return ArticleSchema.parse({
		id: api.id,
		title: api.title,
		description: api.summary,

		imageUrl,
		publishedAt,
		publishedAtLabel: publishedAt ? formatDateLabel(publishedAt) : "",
	});
};

export const fetchArticles = async (): Promise<Article[]> => {
	const url = buildUrl("articles/", { limit: String(ARTICLES_LIMIT) });
	const parsed = await fetchAndParse(url, ArticlesApiResponseSchema);
	return parsed.results.map(mapApiArticleToDomain);
};

export const getArticleById = async (id: string): Promise<Article> => {
	const safeId = encodeURIComponent(id);
	const url = buildUrl(`articles/${safeId}/`);
	const apiArticle = await fetchAndParse(url, ArticleApiSchema);
	return mapApiArticleToDomain(apiArticle);
};
