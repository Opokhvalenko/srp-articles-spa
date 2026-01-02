import {
	Alert,
	Card,
	CardContent,
	CircularProgress,
	TextField,
	Typography,
} from "@mui/material";
import type React from "react";
import { useNavigate } from "react-router-dom";
import HighlightedText from "../../features/articles/components/HighlightedText";
import { useArticleFilter } from "../../features/articles/hooks/useArticleFilter";
import { useArticles } from "../../features/articles/hooks/useArticles";
import type { Article } from "../../features/articles/types";
import { truncateText } from "../../features/articles/utils/filterArticles";

import "./HomePage.scss";

const HomePage: React.FC = () => {
	const { articles, isLoading, error } = useArticles();
	const navigate = useNavigate();
	const { query, setQuery, filteredArticles, keywords } =
		useArticleFilter(articles);

	const handleOpenArticle = (article: Article) => {
		navigate(`/articles/${article.id}`, { state: { article } });
	};

	const handleQueryChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	): void => {
		setQuery(event.target.value);
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
					value={query}
					onChange={handleQueryChange}
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

			{!isLoading && !error && filteredArticles.length > 0 && (
				<div className="home-page__list">
					{filteredArticles.map(({ article }) => (
						<Card
							key={article.id}
							className="home-page__card"
							variant="outlined"
							onClick={() => handleOpenArticle(article)}
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
