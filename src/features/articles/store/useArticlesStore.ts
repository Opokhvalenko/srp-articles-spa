import { create } from "zustand";
import { fetchArticles, getArticleById } from "../../../api/articlesApi";
import type { Article } from "../types";
import {
	type FilteredArticle,
	filterAndSortArticles,
	parseKeywords,
} from "../utils/filterArticles";

interface ArticlesState {
	//data
	articles: Article[];
	filter: string;
	filtered: FilteredArticle[];
	keywords: string[];

	//list loading
	isLoading: boolean;
	error: string | null;

	//selected
	selectedArticleId: number | null;
	selectedArticle: Article | null;
	selectedArticleLoading: boolean;
	selectedArticleError: string | null;

	//actions
	loadArticles: () => Promise<void>;
	setFilter: (value: string) => void;

	selectArticle: (id: number | null) => void;
	loadArticleById: (id: number) => Promise<void>;
}

const recomputeFilter = (articles: Article[], filter: string) => ({
	filtered: filterAndSortArticles(articles, filter),
	keywords: parseKeywords(filter),
});

export const useArticlesStore = create<ArticlesState>((set, get) => ({
	//initial
	articles: [],
	filter: "",
	filtered: [],
	keywords: [],

	isLoading: false,
	error: null,

	selectedArticleId: null,
	selectedArticle: null,
	selectedArticleLoading: false,
	selectedArticleError: null,

	//actions
	loadArticles: async () => {
		try {
			set({ isLoading: true, error: null });

			const articles = await fetchArticles();
			const { filter } = get();

			set({
				articles,
				...recomputeFilter(articles, filter),
				isLoading: false,
			});
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed t load articles";
			set({ error: message, isLoading: false });
		}
	},

	setFilter: (value) => {
		const { articles } = get();

		set({
			filter: value,
			...recomputeFilter(articles, value),
		});
	},

	selectArticle: (id) => {
		set({
			selectedArticleId: id,
			selectedArticle: null,
			selectedArticleError: null,
		});
	},

	loadArticleById: async (id) => {
		try {
			set({
				selectedArticleLoading: true,
				selectedArticleError: null,
				selectedArticleId: id,
			});

			const article = await getArticleById(String(id));

			const { selectedArticleId } = get();
			if (selectedArticleId !== id) {
				return;
			}
			set({
				selectedArticle: article,
				selectedArticleLoading: false,
			});
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: "Failed to load article. Please try again.";

			set({
				selectedArticleError: message,
				selectedArticleLoading: false,
				selectedArticle: null,
			});
		}
	},
}));
