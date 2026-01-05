import { Outlet, useLocation } from "react-router-dom";
import "./Layout.scss";

export default function Layout() {
	const { pathname } = useLocation();
	const isArticlePage = pathname.startsWith("/articles/");

	return (
		<div className="app">
			<div
				className={`app__container${isArticlePage ? " app__container--full" : ""}`}
			>
				<Outlet />
			</div>
		</div>
	);
}
