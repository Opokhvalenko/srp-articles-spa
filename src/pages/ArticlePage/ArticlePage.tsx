import { Typography } from "@mui/material";
import type React from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import "./ArticlePage.scss";

const ArticlePage: React.FC = () => {
	const { id } = useParams;

	return (
		<Layout>
			<Typography variant="h4" component="h1" gutterBottom>
				Article #{id}
			</Typography>
			<Typography variant="body1"></Typography>
		</Layout>
	);
};

export default ArticlePage;
