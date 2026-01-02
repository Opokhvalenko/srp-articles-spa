import type { Article } from "../types";

export interface FilteredArticle {
	article: Article;
	score: number;
}

export const parseKeywords = (rawQuery: string): string[] => {
	const tokens = rawQuery
		.split(/\s+/)
		.map((word) => word.trim().toLowerCase())
		.filter((word) => word.length > 0);

	const seen = new Set<string>();
	const unique: string[] = [];
	for (const t of tokens) {
		if (!seen.has(t)) {
			seen.add(t);
			unique.push(t);
		}
	}
	return unique;
};
const countMatches = (text: string, keywords: string[]): number => {
	const lowerText = text.toLowerCase();
	let count = 0;
	for (const keyword of keywords) {
		if (lowerText.includes(keyword)) {
			count += 1;
		}
	}
	return count;
};

export const filterAndSortArticles = (
	articles: Article[],
	query: string,
): FilteredArticle[] => {
	const keywords = parseKeywords(query);

	if (keywords.length === 0) {
		return articles.map((article) => ({
			article,
			score: 0,
		}));
	}

	const scored = articles
		.map((article) => {
			const titleMatches = countMatches(article.title, keywords);
			const descriptionMatches = countMatches(article.description, keywords);

			if (titleMatches === 0 && descriptionMatches === 0) {
				return null;
			}

			return { article, titleMatches, descriptionMatches };
		})
		.filter(
			(
				item,
			): item is {
				article: Article;
				titleMatches: number;
				descriptionMatches: number;
			} => item !== null,
		);

	//strict priority
	scored.sort((a, b) => {
		const aHasTitle = a.titleMatches > 0 ? 1 : 0;
		const bHasTitle = b.titleMatches > 0 ? 1 : 0;

		if (aHasTitle !== bHasTitle) {
			return bHasTitle - aHasTitle;
		}
		if (a.titleMatches !== b.titleMatches) {
			return b.titleMatches - a.titleMatches;
		}
		if (a.descriptionMatches !== b.descriptionMatches) {
			return b.descriptionMatches - a.descriptionMatches;
		}
		return b.article.id - a.article.id;
	});

	return scored.map(({ article, titleMatches, descriptionMatches }) => ({
		article,
		score: titleMatches * 100 + descriptionMatches,
	}));
};

export const truncateText = (text: string, maxLength = 100): string => {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength).trimEnd()}...`;
};
