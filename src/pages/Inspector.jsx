import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";

const GET_LOG = gql`
	query {
		log {
			log
			logType
			timestamp
			appName
			blockHeight
			functionName
			app
			messagesSent
			otherChain
			fromBlockHeight
		}
	}
`;

export default function Inspector() {
	const [events, setEvents] = useState([]);

	console.log(events);

	let [loadLog, { called, loading }] = useLazyQuery(GET_LOG, {
		onCompleted: (data) => {
			const events = data.log
				.map((logItem, index) => {
					if (
						logItem.logType === "INITIALIZATION_START" ||
						logItem.logType === "OPERATION_EXECUTION_START" ||
						logItem.logType === "MESSAGE_EXECUTION_START"
					) {
						const name =
							logItem.appName +
							" " +
							logItem.logType.split("_")[0] +
							(logItem.logType[0] === "I" ? "" : ": " + logItem.log.split(" ")[0]);
						return {
							name,
							index,
							block: logItem.blockHeight,
						};
					}
					return null;
				})
				.filter(Boolean);
			setEvents(events);
		},
	});

	if (!called) {
		void loadLog();
	}

	// const contentData = [
	// 	{ id: 0, title: "Content 0", content: "This is the content for Button 0." },
	// 	{ id: 7, title: "Content 7", content: "This is the content for Button 7." },
	// 	{ id: 9, title: "Content 9", content: "This is the content for Button 9." },
	// 	{ id: 10, title: "Content 10", content: "This is the content for Button 10." },
	// ];

	// const [activeButton, setActiveButton] = useState(0);

	// const handleButtonClick = (buttonId) => {
	// 	setActiveButton(buttonId);
	// };

	// const activeButtonContent = contentData.find((data) => data.id === activeButton);

	if (called && loading) {
		return (
			<div role="status" className="max-w-7xl mx-auto py-8 mt-4 animate-pulse">
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
				<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
				<span className="sr-only">Loading...</span>
			</div>
		);
	}

	return (
		<div className="flex flex-1 max-w-7xl mx-auto py-83we">
			{/* <LeftSidebar events={events} activeButton={activeButton} handleButtonClick={handleButtonClick} /> */}
			<LeftSidebar events={events} />
			<Divider />
			{/* <RightContent activeButtonContent={activeButtonContent} /> */}
			<RightContent />
		</div>
	);
}

// const LeftSidebar = ({ events, activeButton, handleButtonClick }) => {
const LeftSidebar = ({ events }) => {
	return (
		<div className="w-1/4 overflow-y-auto h-screen overflow-hidden my-8 mx-6">
			<div className="flex flex-col mr-5">
				{events.map((event, index) => (
					<div key={event.index}>
						<figure className="flex flex-col items-center justify-center p-8 text-center bg-black rounded-xl dark:bg-gray-800 dark:border-gray-700">
							<blockquote className="max-w-2xl mx-auto mb-4 text-gray-500 lg:mb-8 dark:text-gray-400">
								<h3 className="text-lg font-semibold text-white dark:text-white">Block #{event.block}</h3>
							</blockquote>
							<div className="flex flex-1">
								<button
									type="button"
									// onClick={() => handleButtonClick(event.index)}
									className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
								>
									{event.name}
								</button>
							</div>
						</figure>
						{index !== events.length - 1 && (
							<div className="mx-auto h-[50px] min-h-[1em] w-0.5 self-stretch bg-gray-700 dark:bg-neutral-100 opacity-100 dark:opacity-80"></div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

// const RightContent = ({ activeButtonContent }) => {
// 	return (
// 		<div className="w-3/4 mx-6 my-8 h-screen">
// 			<h2 className="text-2xl font-semibold mb-4">{activeButtonContent.title}</h2>
// 			<p>{activeButtonContent.content}</p>
// 		</div>
// 	);
// };
const RightContent = () => {
	return (
		<div className="w-3/4 mx-6 my-8 h-screen">
			<p>To be continued...</p>
		</div>
	);
};

const Divider = () => {
	return (
		<div className="h-[auto] min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"></div>
	);
};
