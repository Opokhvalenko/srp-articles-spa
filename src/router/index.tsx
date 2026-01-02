import type React from "react";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ArticlePage = lazy(() => import("../pages/ArticlePage/ArticlePage"));

const AppRouter: React.FC = () => (
	<Layout>
		<Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/articles/:id" element={<ArticlePage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	</Layout>
);

export default AppRouter;
