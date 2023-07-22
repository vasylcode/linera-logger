import { useState } from "react";
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
						const parsedLog = extractData(log);
						return { block: blockHeight, timestamp, log: parsedLog };
					}
					return null;
				})
				.filter((transaction) => transaction !== null);

			setTransactions(transactions);
		},
	});

	function extractData(inputString) {
		function parseObject(objString) {
			const keyValuePairs = objString.split(",").map((pair) => pair.trim());
			const result = {};
			for (const pair of keyValuePairs) {
				const [key, value] = pair.split(":").map((item) => item.trim());
				if (key === "owner") {
					result.owner = value.match(/Owner\(([^)]+)\)/)[1];
				} else {
					result[key] = Number(value);
				}
			}
			return result;
		}

		const cleanedString = inputString.replace(/(Transfer|Credit)/g, "").trim();

		const ownerRegex = /Owner\(([a-fA-F0-9]+)\)/;
		const ownerMatch = cleanedString.match(ownerRegex);
		const owner = ownerMatch ? ownerMatch[1] : "";

		const amountRegex = /Amount\((\d+)\)/;
		const amountMatch = cleanedString.match(amountRegex);
		const amount = amountMatch ? amountMatch[1] : "";

		const targetAccountRegex = /target_account: Account {([^}]+)}/;
		const targetAccountMatch = cleanedString.match(targetAccountRegex);
		const targetAccount = targetAccountMatch ? parseObject(targetAccountMatch[1]).owner : null;

		const chainIdRegex = /chain_id: ([a-fA-F0-9]+)/;
		const chainIdMatch = cleanedString.match(chainIdRegex);
		const chain_id = chainIdMatch ? chainIdMatch[1] : "";

		return {
			from: owner,
			amount: Number(amount / 1000000000000000000),
			to: targetAccount,
			chain: chain_id,
		};
	}

	// const inputString =
	// 	"Transfer { owner: User(Owner(66ab9895a79a2a2d)), amount: Amount(500000000000000000000), target_account: Account { chain_id: 1db1936dad071759, owner: User(Owner(3514941bc663828d)) } }";

	// const extractedData = extractData(inputString);
	// console.log(inputString);
	// console.log(extractedData);

	if (called && loading) return <p>Loading ...</p>;
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
