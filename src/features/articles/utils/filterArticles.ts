import type { Article } from "../types";
import { buildKeywordsRegex } from "./keywordRegex";

export interface FilteredArticle {
	article: Article;
}

export const parseKeywords = (rawQuery: string): string[] => {
	const tokens = rawQuery.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

	const seenKeywords = new Set<string>();
	const keywords: string[] = [];

	for (const token of tokens) {
		if (!seenKeywords.has(token)) {
			seenKeywords.add(token);
			keywords.push(token);
		}
	}
	return keywords;
};

type MatchStats = {
	matchedKeywordsCount: number; // how many different keywords matched at least once
	totalMatchesCount: number; // how many matches total
};

const getMatchStats = (text: string, keywords: string[]): MatchStats => {
	const normalizedText = (text ?? "").toLowerCase();
	const combinedRegex = buildKeywordsRegex(keywords, "gu");

	if (!combinedRegex || normalizedText.length === 0) {
		return { matchedKeywordsCount: 0, totalMatchesCount: 0 };
	}

	const matchesUnique = new Set<string>();
	let totalMatches = 0;

	for (const match of normalizedText.matchAll(combinedRegex)) {
		const matchedValue = match[0];
		if (!matchedValue) continue;
		matchesUnique.add(matchedValue);
		totalMatches += 1;
	}

	return {
		matchedKeywordsCount: matchesUnique.size,
		totalMatchesCount: totalMatches,
	};
};

export const filterAndSortArticles = (
	articles: Article[],
	query: string,
): FilteredArticle[] => {
	const keywords = parseKeywords(query);

	if (keywords.length === 0) {
		return articles.map((article) => ({ article }));
	}

	const candidates = articles
		.map((article) => {
			const titleStats = getMatchStats(article.title, keywords);
			const descriptionStats = getMatchStats(article.description, keywords);

			const hasAnyMatch =
				titleStats.matchedKeywordsCount > 0 ||
				descriptionStats.matchedKeywordsCount > 0;

			if (!hasAnyMatch) {
				return null;
			}

			return { article, titleStats, descriptionStats };
		})
		.filter(
			(
				item,
			): item is {
				article: Article;
				titleStats: MatchStats;
				descriptionStats: MatchStats;
			} => item !== null,
		);

	//strict priority sort: title matches always above description-only matches
	candidates.sort((a, b) => {
		const aHasTitleMatch = a.titleStats.matchedKeywordsCount > 0 ? 1 : 0;
		const bHasTitleMatch = b.titleStats.matchedKeywordsCount > 0 ? 1 : 0;

		if (aHasTitleMatch !== bHasTitleMatch) {
			return bHasTitleMatch - aHasTitleMatch;
		}

		if (
			a.titleStats.matchedKeywordsCount !== b.titleStats.matchedKeywordsCount
		) {
			return (
				b.titleStats.matchedKeywordsCount - a.titleStats.matchedKeywordsCount
			);
		}

		if (a.titleStats.totalMatchesCount !== b.titleStats.totalMatchesCount) {
			return b.titleStats.totalMatchesCount - a.titleStats.totalMatchesCount;
		}

		if (
			a.descriptionStats.matchedKeywordsCount !==
			b.descriptionStats.matchedKeywordsCount
		) {
			return (
				b.descriptionStats.matchedKeywordsCount -
				a.descriptionStats.matchedKeywordsCount
			);
		}

		if (
			a.descriptionStats.totalMatchesCount !==
			b.descriptionStats.totalMatchesCount
		) {
			return (
				b.descriptionStats.totalMatchesCount -
				a.descriptionStats.totalMatchesCount
			);
		}

		return b.article.id - a.article.id;
	});

	return candidates.map(({ article }) => ({ article }));
};

export const truncateText = (text: string, maxLength = 100): string => {
	if (text.length <= maxLength) {
		return text;
	}

	return `${text.slice(0, maxLength).trimEnd()}...`;
};

export const buildSnippetAroundMatch = (
	text: string,
	keywords: string[],
	maxLength = 100,
): string => {
	if (!text) {
		return "";
	}

	if (keywords.length === 0) {
		return truncateText(text, maxLength);
	}

	const combinedRegex = buildKeywordsRegex(keywords, "i");
	if (!combinedRegex) {
		return truncateText(text, maxLength);
	}

	const firstMatchIndex = text.search(combinedRegex);
	if (firstMatchIndex === -1) {
		return truncateText(text, maxLength);
	}

	const beforeMatchBudget = Math.floor(maxLength * 0.35);

	let startIndex = Math.max(0, firstMatchIndex - beforeMatchBudget);
	let endIndex = Math.min(text.length, startIndex + maxLength);

	if (endIndex - startIndex < maxLength) {
		startIndex = Math.max(0, endIndex - maxLength);
		endIndex = Math.min(text.length, startIndex + maxLength);
	}

	const prefix = startIndex > 0 ? "…" : "";
	const suffix = endIndex < text.length ? "…" : "";

	return `${prefix}${text.slice(startIndex, endIndex).trim()}${suffix}`;
};
