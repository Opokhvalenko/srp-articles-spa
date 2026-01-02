import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getArticleById } from "../../api/articlesApi";
import type { Article } from "../../features/articles/types";

import "./ArticlePage.scss";

interface LocationState {
	article?: Article;
}

const ArticlePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const state = location.state as LocationState | null;

	const [article, setArticle] = React.useState<Article | null>(
		state?.article ?? null,
	);

	const [isLoading, setIsLoading] = React.useState<boolean>(!state?.article);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (article || !id) {
			return;
		}

		const loadArticle = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const data = await getArticleById(id);
				setArticle(data);
			} catch {
				setError("Failed to load article. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		void loadArticle();
	}, [article, id]);

	const handleBack = () => {
		navigate(-1);
	};

	if (isLoading) {
		return (
			<Container className="article-page">
				<div className="article-page__loader">
					<CircularProgress />
				</div>
			</Container>
		);
	}

	if (error || !article) {
		return (
			<Container className="article-page">
				<Alert severity="error" className="article-page__alert">
					{error ?? "Article not found."}
				</Alert>

				<Button variant="contained" onClick={handleBack}>
					Back to articles
				</Button>
			</Container>
		);
	}

	return (
		<Container className="article-page">
			<Box className="article-page__header">
				<Button variant="outlined" onClick={handleBack}>
					Back
				</Button>
			</Box>
			<Typography variant="h4" component="h1" gutterBottom>
				{article.title}
			</Typography>

			<Typography
				variant="body1"
				component="p"
				className="article-page__description"
			>
				{article.description}
			</Typography>
		</Container>
	);
};

export default ArticlePage;
