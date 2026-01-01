import {
	type Article,
	ArticleSchema,
	ArticlesApiResponseSchema,
} from "../features/articles/types";

const SPACELIGHT_API_URL =
	"https://api.spaceflightnewsapi.net/v4/articles/?limit=100";

export const fetchArticles = async (): Promise<Article[]> => {
	const response = await fetch(SPACELIGHT_API_URL, {
		headers: {
			Accept: "application/json",
		},
	});

	if (!response.ok) {
		const text = await response.text().catch(() => "");
		console.error("Articles API error response:", {
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
			contentType,
			bodyPreview: text.slice(0, 300),
		});

		throw new Error(
			`Unexpected response from API (expected JSON, got ${contentType || "unknow"}).`,
		);
	}

	const json = await response.json();

	const parsed = ArticlesApiResponseSchema.parse(json);

	return parsed.results.map((item) =>
		ArticleSchema.parse({
			id: item.id,
			title: item.title,
			description: item.summary,
		}),
	);
};
