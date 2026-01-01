import type React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import "./Layout.scss";

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className="layout">
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" component="div">
						SPR Articles SPA
					</Typography>
				</Toolbar>
			</AppBar>

			<main className="layout__main">
				<Container maxWidth="md">{children}</Container>
			</main>
		</div>
	);
};

export default Layout;
