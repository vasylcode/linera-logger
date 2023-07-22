import { useState } from "react";

export default function Inspector() {
	const buttons = [
		{ id: 1, block: "123" },
		{ id: 2, block: "456" },
	];

	const contentData = [
		{ id: 1, title: "Content 1", content: "This is the content for Button 1." },
		{ id: 2, title: "Content 2", content: "This is the content for Button 2." },
	];

	const [activeButton, setActiveButton] = useState(buttons[0].id);

	const handleButtonClick = (buttonId) => {
		setActiveButton(buttonId);
	};

	const activeButtonContent = contentData.find((data) => data.id === activeButton);

	return (
		<div className="flex flex-1 max-w-7xl mx-auto py-83we">
			<LeftSidebar buttons={buttons} activeButton={activeButton} handleButtonClick={handleButtonClick} />
			<Divider />
			<RightContent activeButtonContent={activeButtonContent} />
		</div>
	);
}

const LeftSidebar = ({ buttons, activeButton, handleButtonClick }) => {
	return (
		<div className="w-1/4 overflow-y-auto h-screen overflow-hidden my-8 mx-6">
			{buttons.map((button) => (
				<button
					key={button.id}
					onClick={() => handleButtonClick(button.id)}
					className={`py-2 px-4 rounded-md ${
						activeButton === button.id ? "bg-blue-500 text-white" : "bg-white text-black"
					}`}
				>
					{button.label}
				</button>
			))}
			<div className="flex flex-col mr-5">
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
				<div class="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
				<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
					<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
						<h3 className="text-lg font-semibold text-white dark:text-white">Block #123</h3>
					</blockquote>
					<div className="flex flex-1">
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							init
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							op
						</button>
						<button
							type="button"
							className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
						>
							msg
						</button>
					</div>
				</figure>
			</div>
		</div>
	);
};

const RightContent = ({ activeButtonContent }) => {
	return (
		<div className="w-3/4 mx-6 my-8 h-screen">
			<h2 className="text-2xl font-semibold mb-4">{activeButtonContent.title}</h2>
			<p>{activeButtonContent.content}</p>
		</div>
	);
};

const Divider = () => {
	return (
		<div className="h-[auto] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"></div>
	);
};
