import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import GraphQLProvider from "./graphql";
import { MantineProvider } from "@mantine/core";
import { NoMatch } from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path=":id/*" element={<GraphQLApp />} />
				<Route path="*" element={<NoMatch />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

function GraphQLApp() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	let port = searchParams.get("port");
	if (port == null) {
		port = 8080;
	}
	return (
		<GraphQLProvider appId={id} port={port}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<App />
			</MantineProvider>
		</GraphQLProvider>
	);
}
