import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Search, Table, Metrics } from "../components";

const GET_LOG = gql`
	query {
		log {
			log
			logType
			timestamp
			appName
			blockHeight
		}
	}
`;

export default function Explorer() {
	const [transactions, setTransactions] = useState([]);

	const [loadLog, { called, loading, data }] = useLazyQuery(GET_LOG, {
		onCompleted: (data) => {
			const transactions = data.log
				.map((logItem) => {
					const { blockHeight, timestamp, log } = logItem;
					if (logItem.appName === "logging_fungible" && logItem.logType === "OPERATION_EXECUTION_END") {
						const parsedLog = parseTransferString(log);
						return { block: blockHeight, timestamp, log: parsedLog };
					}
					return null;
				})
				.filter((transaction) => transaction !== null);

			setTransactions(transactions);
		},
	});

	function parseTransferString(inputString) {
		const ownerPattern = /owner:\sUser\(([a-f0-9]+)\)/;
		const amountPattern = /amount:\sAmount\((\d+)\)/;
		const chainIdPattern = /chain_id:\s([a-f0-9]+)/;
		const toOwnerPattern = /target_account:\sAccount\s{\schain_id:\s[a-f0-9]+,\sowner:\sUser\(([a-f0-9]+)\)/;
		const ownerMatch = inputString.match(ownerPattern);
		const amountMatch = inputString.match(amountPattern);
		const chainIdMatch = inputString.match(chainIdPattern);
		const toOwnerMatch = inputString.match(toOwnerPattern);

		if (!ownerMatch || !amountMatch || !chainIdMatch || !toOwnerMatch) {
			throw new Error("Invalid input string. Unable to parse the required fields.");
		}
		const result = {
			from: ownerMatch[1],
			to: toOwnerMatch[1],
			chain: chainIdMatch[1],
			amount: parseInt(amountMatch[1]) / 1000000000000000000,
		};

		return result;
	}

	if (called && loading) {
		return (
			<div role="status" class="max-w-7xl mx-auto py-8 mt-4 animate-pulse">
				<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
				<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
				<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
				<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
				<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
				<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
				<span class="sr-only">Loading...</span>
			</div>
		);
	}
	if (!called) {
		void loadLog();
	}
	return (
		<div className="max-w-7xl mx-auto py-8">
			<Search />
			<Metrics />
			<Table transactions={transactions} />
		</div>
	);
}
