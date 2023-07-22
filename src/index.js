import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import App2 from "./App2";
import { BrowserRouter, Route, Routes, useParams, useSearchParams, Outlet, Link } from "react-router-dom";
import GraphQLProvider from "./graphql";
import { MantineProvider } from "@mantine/core";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path=":id" element={<OurEpicApp />} >
                    <Route path="explorer" element = {<GraphQLApp />} />
                    <Route path="inspector" element = {<GraphQLApp2 />} />
                </Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);

function OurEpicApp() {
    return (
        <>
            <nav>
                <Link to="explorer">Explorer</Link>
                <Link to="inspector">Inspector</Link>
            </nav>

            <Outlet />
        </>
    );
}

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

function GraphQLApp2() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	let port = searchParams.get("port");
	if (port == null) {
		port = 8080;
	}
	return (
		<GraphQLProvider appId={id} port={port}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<App2 />
			</MantineProvider>
		</GraphQLProvider>
	);
}
