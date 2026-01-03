import type { Article } from "../types";
import {
	type FilteredArticle,
	filterAndSortArticles,
	parseKeywords,
} from "../utils/filterArticles";
import type { ArticlesState } from "./useArticlesStore";

// keywords selector (memoized)
let lastFilterForKeywords = "";
let lastKeywords: string[] = [];

export const selectKeywords = (s: ArticlesState): string[] => {
	if (s.filter === lastFilterForKeywords) {
		return lastKeywords;
	}

	lastFilterForKeywords = s.filter;
	lastKeywords = parseKeywords(s.filter);
	return lastKeywords;
};

// filtered articles selector (memoized)
let lastArticlesRef: Article[] | null = null;
let lastFilterForList = "";
let lastFiltered: FilteredArticle[] = [];

export const selectFilteredArticles = (s: ArticlesState): FilteredArticle[] => {
	if (s.articles === lastArticlesRef && s.filter === lastFilterForList) {
		return lastFiltered;
	}

	lastArticlesRef = s.articles;
	lastFilterForList = s.filter;
	lastFiltered = filterAndSortArticles(s.articles, s.filter);

	return lastFiltered;
};
