import { useState, useEffect } from "react";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { Search, Table, Metrics } from "../components";

const GET_LOG = gql`
	query {
		log {
			log
			logType
			timestamp
			appName
			blockHeight
			otherChain
		}
	}
`;

const SUBSCRIPTION = gql`
	subscription {
		notifications
	}
`;

export default function Explorer() {
	const [transactions, setTransactions] = useState([]);
	const [metrics, setMetrics] = useState({ block: 0, tx: 0 });

	let [loadLog, { called, loading, data }] = useLazyQuery(GET_LOG, {
		onCompleted: (data) => {
			const transactions = data.log
				.map((logItem) => {
					const { log, blockHeight, timestamp, otherChain } = logItem;
					if (logItem.appName === "logging_fungible" && logItem.logType === "OPERATION_EXECUTION_END") {
						const parsedLog = parseTransaction(log);
						return { block: blockHeight, timestamp, log: parsedLog };
					} else if (logItem.appName === "logging_fungible" && logItem.logType === "MESSAGE_EXECUTION_END") {
						const parsedLog = parseCreditString(log);
						parsedLog.chain = otherChain;
						return { block: blockHeight, timestamp, log: parsedLog };
					}
					return null;
				})
				.filter((transaction) => transaction !== null);

			setTransactions(transactions);
		},
	});

	function parseTransaction(string) {
		const ownerPattern = /owner:\sUser\(([a-f0-9]+)\)/;
		const amountPattern = /amount:\sAmount\((\d+)\)/;
		const chainIdPattern = /chain_id:\s([a-f0-9]+)/;
		const toOwnerPattern = /target_account:\sAccount\s{\schain_id:\s[a-f0-9]+,\sowner:\sUser\(([a-f0-9]+)\)/;
		const ownerMatch = string.match(ownerPattern);
		const amountMatch = string.match(amountPattern);
		const chainIdMatch = string.match(chainIdPattern);
		const toOwnerMatch = string.match(toOwnerPattern);

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

	function parseCreditString(string) {
		const ownerPattern = /owner:\sUser\(([a-f0-9]+)\)/;
		const amountPattern = /amount:\sAmount\((\d+)\)/;
		const fromOwnerPattern = /from:\sUser\(([a-f0-9]+)\)/;

		const ownerMatch = string.match(ownerPattern);
		const amountMatch = string.match(amountPattern);
		const fromOwnerMatch = string.match(fromOwnerPattern);

		if (!ownerMatch || !amountMatch || !fromOwnerMatch) {
			throw new Error("Invalid Credit string. Unable to parse the required fields.");
		}

		const result = {
			from: fromOwnerMatch[1],
			to: ownerMatch[1],
			amount: parseInt(amountMatch[1]) / 1000000000000000000,
		};

		return result;
	}

	function parseMetrics(data) {
		const totalTx = Object.values(data).filter((item) => {
			return (
				(item.log.includes("Credit") || item.log.includes("Transfer")) &&
				(item.logType === "OPERATION_EXECUTION_END" || item.logType === "MESSAGE_EXECUTION_END")
			);
		});

		const lastTxBlock = totalTx.reduce((acc, item) => {
			return item.blockHeight > acc ? item.blockHeight : acc;
		}, 0);

		setMetrics((prevMetrics) => ({ ...prevMetrics, block: lastTxBlock, tx: totalTx.length }));
	}

	useEffect(() => {
		data && parseMetrics(data.log);
	}, [data]);

	useSubscription(SUBSCRIPTION, {
		onData: () => loadLog(),
	});

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
	if (!called) {
		void loadLog();
	}
	return (
		<div className="max-w-7xl mx-auto py-8">
			<Search />
			<Metrics block={metrics.block} tx={metrics.tx} chains={10} nodes={5} />
			<Table transactions={transactions} />
		</div>
	);
}
