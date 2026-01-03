import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const ArticlePage = lazy(() => import("../pages/ArticlePage/ArticlePage"));

export default function AppRouter() {
	return (
		<Layout>
			<Suspense
				fallback={
					<Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
						<CircularProgress />
					</Box>
				}
			>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/articles/:id" element={<ArticlePage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Suspense>
		</Layout>
	);
}
