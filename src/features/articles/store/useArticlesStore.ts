import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchArticles, getArticleById } from "../../../api/articlesApi";
import type { Article } from "../types";

const emptyStorage: Storage = {
	getItem: () => null,
	setItem: () => undefined,
	removeItem: () => undefined,
	clear: () => undefined,
	key: () => null,
	get length() {
		return 0;
	},
};

const sessionStorageProvider = (): Storage =>
	typeof window === "undefined" ? emptyStorage : window.sessionStorage;

export interface ArticlesState {
	// data
	articles: Article[];
	filter: string;

	// list loading
	isLoading: boolean;
	error: string | null;

	// selected
	selectedArticleId: number | null;
	selectedArticle: Article | null;
	selectedArticleLoading: boolean;
	selectedArticleError: string | null;

	// internal (avoid dev double-fetch)
	hasLoaded: boolean;

	// actions
	loadArticles: (opts?: { force?: boolean }) => Promise<void>;
	setFilter: (value: string) => void;

	selectArticle: (id: number | null) => void;
	loadArticleById: (id: number) => Promise<void>;
}

export const useArticlesStore = create<ArticlesState>()(
	persist(
		(set, get) => ({
			// initial
			articles: [],
			filter: "",

			isLoading: false,
			error: null,

			selectedArticleId: null,
			selectedArticle: null,
			selectedArticleLoading: false,
			selectedArticleError: null,

			hasLoaded: false,

			// actions
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
						err instanceof Error ? err.message : "Failed to load articles";
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
				const { selectedArticleId, selectedArticle, selectedArticleLoading } =
					get();

				// guard: avoid StrictMode double-fetch + repeated calls
				if (selectedArticleLoading) {
					return;
				}

				if (selectedArticleId === id && selectedArticle) {
					return;
				}

				try {
					set({
						selectedArticleLoading: true,
						selectedArticleError: null,
						selectedArticleId: id,
					});

					const article = await getArticleById(String(id));

					// protect from race conditions
					const { selectedArticleId: currentId } = get();
					if (currentId !== id) {
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
		}),
		{
			name: "srp-articles-spa",
			storage: createJSONStorage(sessionStorageProvider),
			version: 1,
			// persist only what is actually useful between reloads
			partialize: (state) => ({ filter: state.filter }),
		},
	),
);
