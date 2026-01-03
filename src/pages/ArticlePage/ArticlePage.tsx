import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Container,
	Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectedArticle } from "../../features/articles/hooks/useSelectedArticle";

import "./ArticlePage.scss";

export default function ArticlePage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const numericId = id ? Number(id) : null;
	const { article, isLoading, error } = useSelectedArticle(
		Number.isFinite(numericId) ? numericId : null,
	);

	const handleBack = () => {
		// If user opened the page directly (no meaningful back history), go to Home.
		if (window.history.length <= 1) {
			navigate("/", { replace: true });
			return;
		}

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
}
