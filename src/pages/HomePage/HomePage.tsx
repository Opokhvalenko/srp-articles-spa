import {
	Alert,
	Card,
	CardContent,
	CircularProgress,
	TextField,
	Typography,
} from "@mui/material";
import type { FC } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HighlightedText from "../../features/articles/components/HighlightedText";
import {
	selectFilteredArticles,
	selectKeywords,
} from "../../features/articles/store/articlesSelectors";
import { useArticlesStore } from "../../features/articles/store/useArticlesStore";
import { truncateText } from "../../features/articles/utils/filterArticles";

import "./HomePage.scss";

const HomePage: FC = () => {
	const navigate = useNavigate();

	const isLoading = useArticlesStore((s) => s.isLoading);
	const error = useArticlesStore((s) => s.error);

	const filter = useArticlesStore((s) => s.filter);
	const setFilter = useArticlesStore((s) => s.setFilter);

	const filtered = useArticlesStore(selectFilteredArticles);
	const keywords = useArticlesStore(selectKeywords);

	const loadArticles = useArticlesStore((s) => s.loadArticles);
	const selectArticle = useArticlesStore((s) => s.selectArticle);

	useEffect(() => {
		void loadArticles();
	}, [loadArticles]);

	const handleOpenArticle = (id: number) => {
		selectArticle(id);
		navigate(`/articles/${id}`);
	};

	return (
		<>
			<Typography variant="h4" component="h1" gutterBottom>
				Articles
			</Typography>

			<div className="home-page__search">
				<TextField
					label="Filter by keywords"
					variant="outlined"
					fullWidth
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					placeholder="Type keywords, e.g. space radar mission"
					size="small"
				/>
			</div>

			{isLoading && (
				<div className="home-page__loader">
					<CircularProgress />
				</div>
			)}

			{error && (
				<Alert severity="error" className="home-page__alert">
					{error}
				</Alert>
			)}
			{!isLoading && !error && filtered.length === 0 && (
				<Alert severity="info" className="home-page__alert">
					No articles found. Try different keywords.
				</Alert>
			)}

			{!isLoading && !error && filtered.length > 0 && (
				<div className="home-page__list">
					{filtered.map(({ article }) => (
						<Card
							key={article.id}
							className="home-page__card"
							variant="outlined"
							onClick={() => handleOpenArticle(article.id)}
						>
							<CardContent>
								<Typography variant="h6" component="h2" gutterBottom>
									<HighlightedText text={article.title} keywords={keywords} />
								</Typography>
								<Typography variant="body2" color="text.secondary">
									<HighlightedText
										text={truncateText(article.description, 100)}
										keywords={keywords}
									/>
								</Typography>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</>
	);
};

export default HomePage;
