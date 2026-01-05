import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchIcon from "@mui/icons-material/Search";

import {
	Alert,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	CircularProgress,
	Divider,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import HighlightedText from "../../features/articles/components/HighlightedText";
import {
	selectFilteredArticles,
	selectKeywords,
} from "../../features/articles/store/articlesSelectors";
import { useArticlesStore } from "../../features/articles/store/useArticlesStore";
import { buildSnippetAroundMatch } from "../../features/articles/utils/filterArticles";

import "./HomePage.scss";
import "./ArticleCard.scss";

const FILTER_DEBOUNCE_MS = 200;
function ArticleCardImage(props: { src: string; alt: string }) {
	const { src, alt } = props;
	const [failed, setFailed] = useState(false);

	const hasImage = src.trim().length > 0 && !failed;

	if (!hasImage) {
		return (
			<div
				className="article-card__media article-card__media--placeholder"
				aria-hidden="true"
			/>
		);
	}

	return (
		<CardMedia
			className="article-card__media"
			component="img"
			image={src}
			alt={alt}
			loading="lazy"
			onError={() => setFailed(true)}
		/>
	);
}

export default function HomePage() {
	const navigate = useNavigate();

	const isLoading = useArticlesStore((s) => s.isLoading);
	const error = useArticlesStore((s) => s.error);

	const storeFilter = useArticlesStore((s) => s.filter);
	const setFilter = useArticlesStore((s) => s.setFilter);

	const filtered = useArticlesStore(selectFilteredArticles);
	const keywords = useArticlesStore(selectKeywords);

	const loadArticles = useArticlesStore((s) => s.loadArticles);
	const selectArticle = useArticlesStore((s) => s.selectArticle);

	// local input with debounce into store
	const [filterInput, setFilterInput] = useState(storeFilter);

	useEffect(() => {
		setFilterInput(storeFilter);
	}, [storeFilter]);

	useEffect(() => {
		const id = window.setTimeout(
			() => setFilter(filterInput),
			FILTER_DEBOUNCE_MS,
		);
		return () => window.clearTimeout(id);
	}, [filterInput, setFilter]);

	useEffect(() => {
		void loadArticles();
	}, [loadArticles]);

	const handleOpenArticle = (articleId: number) => {
		selectArticle(articleId);
		navigate(`/articles/${articleId}`);
	};

	const resultsLabel = useMemo(() => {
		if (isLoading) {
			return "Results: loading";
		}

		return `Results: ${filtered.length}`;
	}, [filtered.length, isLoading]);

	return (
		<div className="home-page">
			<div className="home-page__filter">
				<div className="home-page__label">Filter by keywords</div>

				<TextField
					value={filterInput}
					onChange={(e) => setFilterInput(e.target.value)}
					placeholder="Type keywords, e.g. space radar mission"
					size="small"
					fullWidth
					className="home-page__search"
					slotProps={{
						input: {
							className: "home-page__search-input",
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon
										className="home-page__search-icon"
										fontSize="small"
									/>
								</InputAdornment>
							),
						},
						htmlInput: {
							"aria-label": "Filter articles by keywords",
						},
					}}
				/>
			</div>

			{isLoading && (
				<output className="home-page__loader" aria-label="Loading articles">
					<CircularProgress />
				</output>
			)}

			{error && (
				<Alert severity="error" className="home-page__alert">
					{error}
				</Alert>
			)}

			{!isLoading && !error && (
				<>
					<div className="home-page__results" aria-live="polite">
						{resultsLabel}
					</div>
					<Divider className="home-page__divider" />

					{filtered.length === 0 ? (
						<Alert severity="info" className="home-page__alert">
							No articles found. Try different keywords.
						</Alert>
					) : (
						<div className="home-page__grid">
							{filtered.map(({ article }) => (
								<Card className="article-card" key={article.id} elevation={0}>
									<CardActionArea
										className="article-card__link"
										onClick={() => handleOpenArticle(article.id)}
										aria-label={`Open article: ${article.title}`}
									>
										<ArticleCardImage
											src={article.imageUrl ?? ""}
											alt={article.title}
										/>

										<CardContent className="article-card__content">
											<div className="article-card__date">
												<CalendarMonthOutlinedIcon className="article-card__date-icon" />
												<span>{article.publishedAtLabel || "-"}</span>
											</div>

											<Typography className="article-card__title">
												<HighlightedText
													text={article.title}
													keywords={keywords}
												/>
											</Typography>

											<Typography className="article-card__desc">
												<HighlightedText
													text={buildSnippetAroundMatch(
														article.description,
														keywords,
														100,
													)}
													keywords={keywords}
												/>
											</Typography>
										</CardContent>
									</CardActionArea>

									<CardActions className="article-card__actions">
										<Button
											className="article-card__read-more"
											onClick={(e) => {
												e.stopPropagation();
												handleOpenArticle(article.id);
											}}
											endIcon={<ArrowForwardIcon fontSize="small" />}
											aria-label={`Read more: ${article.title}`}
										>
											Read more
										</Button>
									</CardActions>
								</Card>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
