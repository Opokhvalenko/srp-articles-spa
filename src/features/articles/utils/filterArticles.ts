import type { Article } from "../types";

export interface FilteredArticle {
	article: Article;
	score: number;
}

export const parseKeywords = (rawQuery: string): string[] => {
	return rawQuery
		.split(/\s+/)
		.map((word) => word.trim().toLowerCase())
		.filter((word) => word.length > 0);
};

const countMatches = (text: string, keywords: string[]): number => {
	const lowerText = text.toLowerCase();
	return keywords.reduce((count, keyword) => {
		return lowerText.includes(keyword) ? count + 1 : count;
	}, 0);
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

	const withScores: FilteredArticle[] = articles
		.map((article) => {
			const titleMatches = countMatches(article.title, keywords);
			const descriptionMatches = countMatches(article.description, keywords);
			const totalMatches = titleMatches + descriptionMatches;

			if (totalMatches === 0) {
				return null;
			}

			const score = titleMatches * 10 + descriptionMatches;

			return {
				article,
				score,
			};
		})
		.filter((item): item is FilteredArticle => item !== null);

	return withScores.sort((a, b) => b.score - a.score);
};

export const truncateText = (text: string, maxLength = 100): string => {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength).trimEnd()}...`;
};
