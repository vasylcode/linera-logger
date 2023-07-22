import { useState } from "react";

export default function Inspector() {
	const buttons = [
		{ id: 1, label: "Button 1" },
		{ id: 2, label: "Button 2" },
		// Add more buttons if needed
	];

	const contentData = [
		{ id: 1, title: "Content 1", content: "This is the content for Button 1." },
		{ id: 2, title: "Content 2", content: "This is the content for Button 2." },
		// Add more content data for each button
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
		<div className="w-1/4 overflow-y-auto h-screen my-8 mx-6">
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
		<div class="h-[auto] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"></div>
	);
};
