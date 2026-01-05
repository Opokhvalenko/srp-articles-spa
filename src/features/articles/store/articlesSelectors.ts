import type { Article } from "../types";
import {
	type FilteredArticle,
	filterAndSortArticles,
	parseKeywords,
} from "../utils/filterArticles";
import type { ArticlesState } from "./useArticlesStore";

// keywords selector (manual memoization)
let cachedKeywordsQuery = "";
let cachedKeywords: string[] = [];

export const selectKeywords = (state: ArticlesState): string[] => {
	if (state.filter === cachedKeywordsQuery) {
		return cachedKeywords;
	}

	cachedKeywordsQuery = state.filter;
	cachedKeywords = parseKeywords(state.filter);

	return cachedKeywords;
};

// filtered articles selector (manual memoization)
let cachedArticlesRef: Article[] | null = null;
let cachedFilterQuery = "";
let cachedFilteredArticles: FilteredArticle[] = [];

export const selectFilteredArticles = (
	state: ArticlesState,
): FilteredArticle[] => {
	const isSameInput =
		state.articles === cachedArticlesRef && state.filter === cachedFilterQuery;

	if (isSameInput) {
		return cachedFilteredArticles;
	}

	cachedArticlesRef = state.articles;
	cachedFilterQuery = state.filter;
	cachedFilteredArticles = filterAndSortArticles(state.articles, state.filter);

	return cachedFilteredArticles;
};
