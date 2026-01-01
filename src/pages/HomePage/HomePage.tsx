import { Typography } from "@mui/material";
import type React from "react";
import Layout from "../../components/layout/Layout";
import "./HomePage.scss";

const HomePage: React.FC = () => {
	return (
		<Layout>
			<Typography variant="h4" component="h1" gutterBottom>
				Articles
			</Typography>
			<Typography variant="body1"></Typography>
		</Layout>
	);
};

export default HomePage;
