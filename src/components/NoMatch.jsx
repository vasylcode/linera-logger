import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";

export default function NoMatch() {
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState("");

	const handleChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleButtonClick = () => {
		navigate(`/${inputValue}/explorer`);
	};

	return (
		<div className="flex items-center justify-center dark:bg-black min-h-screen">
			<div className="flex flex-col gap-4">
				<h1 className="my-2 text-gray-800 font-bold text-2xl text-center dark:text-white">
					Paste your application ID below to start...
				</h1>
				<input
					type="text"
					className="border border-gray-400 w-full px-4 py-2 rounded-md mr-2"
					placeholder="Your App ID"
					value={inputValue}
					onChange={handleChange}
				/>
				<button
					type="button"
					onClick={handleButtonClick}
					className="text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
				>
					GO!
				</button>
				<div>
					<img src="https://i.ibb.co/ck1SGFJ/Group.png" />
				</div>
			</div>
		</div>
	);
}
