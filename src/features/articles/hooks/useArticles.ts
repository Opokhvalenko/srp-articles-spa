import { useEffect, useState } from "react";
import { fetchArticles } from "../../../api/articlesApi";
import type { Article } from "../types";

interface UseArticlesState {
	articles: Article[];
	isLoading: boolean;
	error: string | null;
}

export const useArticles = (): UseArticlesState => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadArticles = async () => {
			try {
				setIsLoading(true);
				const data = await fetchArticles();

				if (isMounted) {
					setArticles(data);
					setError(null);
				}
			} catch (err) {
				if (isMounted) {
					const message =
						err instanceof Error
							? err.message
							: "Failed to load articles. Please try again.";
					setError(message);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		loadArticles();

		return () => {
			isMounted = false;
		};
	}, []);

	return {
		articles,
		isLoading,
		error,
	};
};
