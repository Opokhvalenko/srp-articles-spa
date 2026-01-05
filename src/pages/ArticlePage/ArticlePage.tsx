import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import HighlightedText from "../../features/articles/components/HighlightedText";
import { useSelectedArticle } from "../../features/articles/hooks/useSelectedArticle";
import { selectKeywords } from "../../features/articles/store/articlesSelectors";
import { useArticlesStore } from "../../features/articles/store/useArticlesStore";

import "./ArticlePage.scss";
import { useEffect, useMemo, useState } from "react";

export default function ArticlePage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const numericId = useMemo(() => {
		if (!id) {
			return null;
		}
		const parsed = Number(id);
		return Number.isFinite(parsed) ? parsed : null;
	}, [id]);

	const { article, isLoading, error } = useSelectedArticle(numericId);

	const keywords = useArticlesStore(selectKeywords);
	const [heroFailed, setHeroFailed] = useState(false);

	const handleBack = () => {
		// If user opened the page directly (no meaningful back history), go to Home.
		if (window.history.length <= 1) {
			navigate("/", { replace: true });
			return;
		}

		navigate(-1);
	};

	useEffect(() => {
		document.title = article?.title ? `Article: ${article.title}` : "Article";
	}, [article?.title]);

	if (isLoading) {
		return (
			<Box className="article-page">
				<Box
					className="article-page__loader"
					role="status"
					aria-label="Loading article"
				>
					<CircularProgress />
				</Box>
			</Box>
		);
	}

	if (error || !article) {
		return (
			<Box className="article-page">
				<Box className="article-page__container">
					<Paper className="article-page__paper" elevation={0}>
						<Stack spacing={2}>
							<Alert severity="error">{error ?? "Article not found."}</Alert>

							<Box>
								<Button variant="contained" onClick={handleBack}>
									Back to homepage
								</Button>
							</Box>
						</Stack>
					</Paper>
				</Box>
			</Box>
		);
	}

	const heroUrl = (article.imageUrl ?? "").trim();
	const hasHero = heroUrl.length > 0 && !heroFailed;

	return (
		<Box className="article-page">
			<Box className="article-page__container">
				{hasHero && (
					<Box className="article-page__hero">
						<img
							className="article-page__hero-image"
							src={heroUrl}
							alt={article.title}
							loading="lazy"
							onError={() => setHeroFailed(true)}
						/>
						<div className="article-page__hero-overlay" />
					</Box>
				)}

				<Paper
					className={`article-page__paper${
						hasHero ? " article-page__paper--overlap" : ""
					}`}
					elevation={0}
				>
					<Typography component="h1" className="article-page__title">
						<HighlightedText text={article.title} keywords={keywords} />
					</Typography>

					{article.publishedAtLabel && (
						<Typography className="article-page__meta">
							{article.publishedAtLabel}
						</Typography>
					)}

					<Typography className="article-page__description">
						<HighlightedText text={article.description} keywords={keywords} />
					</Typography>
				</Paper>

				<Box className="article-page__footer">
					<Button
						className="article-page__back"
						variant="text"
						onClick={handleBack}
						disableRipple
						disableFocusRipple
						aria-label="Back to homepage"
					>
						<span className="article-page__back-text">Back to homepage</span>
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
