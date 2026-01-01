import {
	Alert,
	Card,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material";
import type React from "react";
import Layout from "../../components/layout/Layout";
import { useArticles } from "../../features/articles/hooks/useArticles";
import "./HomePage.scss";

const HomePage: React.FC = () => {
	const { articles, isLoading, error } = useArticles();

	return (
		<Layout>
			<Typography variant="h4" component="h1" gutterBottom>
				Articles
			</Typography>

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

			{!isLoading && !error && (
				<div className="home-page__list">
					{articles.map((article) => (
						<Card
							key={article.id}
							className="home-page__card"
							variant="outlined"
						>
							<CardContent>
								<Typography variant="h6" component="h2" gutterBottom>
									{article.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{article.description}
								</Typography>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</Layout>
	);
};

export default HomePage;
