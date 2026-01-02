import { create } from "zustand";
import { fetchArticles, getArticleById } from "../../../api/articlesApi";
import type { Article } from "../types";

export interface ArticlesState {
	//data
	articles: Article[];
	filter: string;

	//list loading
	isLoading: boolean;
	error: string | null;

	//selected
	selectedArticleId: number | null;
	selectedArticle: Article | null;
	selectedArticleLoading: boolean;
	selectedArticleError: string | null;

	//internal(avoid dev double-fetch)
	hasLoaded: boolean;

	//actions
	loadArticles: (opts?: { force?: boolean }) => Promise<void>;
	setFilter: (value: string) => void;

	selectArticle: (id: number | null) => void;
	loadArticleById: (id: number) => Promise<void>;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
	//initial
	articles: [],
	filter: "",

	isLoading: false,
	error: null,

	selectedArticleId: null,
	selectedArticle: null,
	selectedArticleLoading: false,
	selectedArticleError: null,

	hasLoaded: false,

	//actions
	loadArticles: async (opts) => {
		const { hasLoaded, isLoading } = get();
		if (isLoading) {
			return;
		}
		if (hasLoaded && !opts?.force) {
			return;
		}

		try {
			set({ isLoading: true, error: null });

			const articles = await fetchArticles();

			set({
				articles,
				isLoading: false,
				hasLoaded: true,
			});
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed t load articles";
			set({ error: message, isLoading: false });
		}
	},

	setFilter: (value) => {
		set({ filter: value });
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

			//protect from race conditions
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
