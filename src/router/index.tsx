import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ArticlePage from "../pages/ArticlePage/ArticlePage";
import HomePage from "../pages/HomePage/HomePage";

const AppRouter: React.FC = () => (
	<BrowserRouter>
		<Layout>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/article/:id" element={<ArticlePage />} />
			</Routes>
		</Layout>
	</BrowserRouter>
);

export default AppRouter;
