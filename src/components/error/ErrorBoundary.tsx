import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";

interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error("Unhandled UI err:", error, info);
	}

	private handleReLoad = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		return (
			<Container sx={{ py: 4 }}>
				<Typography variant="h5" gutterBottom>
					Something went wrong
				</Typography>

				<Alert severity="error" sx={{ mb: 2 }}>
					{this.state.error?.message ?? "Unexpected error."}
				</Alert>

				<Stack direction="row" spacing={2}>
					<Button variant="contained" onClick={this.handleReLoad}>
						Reload
					</Button>
					<Button variant="outlined" href="/">
						Go to Home
					</Button>
				</Stack>
			</Container>
		);
	}
}
