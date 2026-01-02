import { useEffect, useMemo } from "react";
import { useArticlesStore } from "../store/useArticlesStore";
import type { SelectedArticleResult } from "../types";

export const useSelectedArticle = (
	id: number | null,
): SelectedArticleResult => {
	const article = useArticlesStore((s) => s.selectedArticle);
	const isLoading = useArticlesStore((s) => s.selectedArticleLoading);
	const error = useArticlesStore((s) => s.selectedArticleError);
	const loadArticleById = useArticlesStore((s) => s.loadArticleById);

	useEffect(() => {
		if (!id) {
			return;
		}
		void loadArticleById(id);
	}, [id, loadArticleById]);

	const stableArticle = useMemo(() => {
		if (!id || !article) {
			return null;
		}
		return article.id === id ? article : null;
	}, [article, id]);

	return {
		article: stableArticle,
		isLoading,
		error,
	};
};
