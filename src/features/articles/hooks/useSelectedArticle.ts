import { useEffect, useMemo } from "react";

import { useArticlesStore } from "../store/useArticlesStore";
import type { SelectedArticleResult } from "../types";

export const useSelectedArticle = (
	articleId: number | null,
): SelectedArticleResult => {
	const selectedArticle = useArticlesStore((s) => s.selectedArticle);
	const isLoading = useArticlesStore((s) => s.selectedArticleLoading);
	const error = useArticlesStore((s) => s.selectedArticleError);
	const loadArticleById = useArticlesStore((s) => s.loadArticleById);

	useEffect(() => {
		if (articleId === null) {
			return;
		}
		void loadArticleById(articleId);
	}, [articleId, loadArticleById]);

	const article = useMemo(() => {
		if (!articleId || !selectedArticle) {
			return null;
		}
		return selectedArticle.id === articleId ? selectedArticle : null;
	}, [selectedArticle, articleId]);

	return {
		article: article,
		isLoading,
		error,
	};
};
