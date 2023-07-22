import { Routes, Route, Outlet, Link } from "react-router-dom";
import { Explorer, Inspector } from "./pages";
import { Navbar } from "./components";

export default function App() {
	return (
		<div className="dark:bg-black dark:text-white min-h-screen">
			<Navbar />
			<Routes>
				<Route path="explorer" element={<Explorer />} />
				<Route path="inspector" element={<Inspector />} />
			</Routes>
		</div>
	);
}
