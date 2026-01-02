import { useMemo, useState } from "react";
import type { Article } from "../types";
import {
	type FilteredArticle,
	filterAndSortArticles,
	parseKeywords,
} from "../utils/filterArticles";

interface UseArticleFilterResult {
	query: string;
	setQuery: (value: string) => void;
	filteredArticles: FilteredArticle[];
	keywords: string[];
}

export const useArticleFilter = (
	articles: Article[],
): UseArticleFilterResult => {
	const [query, setQuery] = useState("");

	const keywords = useMemo(() => parseKeywords(query), [query]);

	const filteredArticles = useMemo(
		() => filterAndSortArticles(articles, query),
		[articles, query],
	);

	return {
		query,
		setQuery,
		filteredArticles,
		keywords,
	};
};
