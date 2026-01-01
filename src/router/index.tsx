import type React from "react";
import { Route, Routes } from "react-router-dom";
import ArticlePage from "../pages/ArticlePage/ArticlePage";
import HomePage from "../pages/HomePage/HomePage";

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/article/:id" element={<ArticlePage />} />
		</Routes>
	);
};

export default AppRouter;
