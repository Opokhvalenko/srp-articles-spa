import { filterAndSortArticles, parseKeywords } from "../utils/filterArticles";
import type { ArticlesState } from "./useArticlesStore";

export const selectKeywords = (s: ArticlesState) => parseKeywords(s.filter);

export const selectFilteredArticles = (s: ArticlesState) =>
	filterAndSortArticles(s.articles, s.filter);
