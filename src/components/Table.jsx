export default function Table({ transactions }) {
	const convertTimestampToUTCDate = (timestamp) => {
		const dateObj = new Date(timestamp / 1000);
		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			timeZone: "UTC",
		};
		return dateObj.toLocaleString("en-US", options);
	};

	function formatHash(hash) {
		const first8Chars = hash.slice(0, 8);
		const last8Chars = hash.slice(-8);
		return `${first8Chars}...${last8Chars}`;
	}

	return (
		// max-w-[50%]
		<div className="">
			<h2 className="my-5 text-3xl font-bold dark:text-white">Latest Transactions</h2>
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3">
								Chain
							</th>
							<th scope="col" className="px-6 py-3">
								Amount
							</th>
							<th scope="col" className="px-6 py-3">
								Block
							</th>
							<th scope="col" className="px-6 py-3">
								Time
							</th>
							<th scope="col" className="px-6 py-3">
								From
							</th>
							<th scope="col" className="px-6 py-3">
								To
							</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx, index) => (
							<tr
								key={tx.log.amount + tx.timestamp + tx.block}
								className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
							>
								<th
									scope="row"
									className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
								>
									<a
										href={`#${tx.log.chain}`}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										{formatHash(tx.log.chain)}
									</a>
								</th>
								<td className="px-6 py-4">{tx.log.amount}</td>
								<td className="px-6 py-4">
									<a
										href={`#${tx.block}`}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										{tx.block}
									</a>
								</td>
								<td className="px-6 py-4">{convertTimestampToUTCDate(tx.timestamp)}</td>
								<td className="px-6 py-4">
									<a
										href={`#${tx.log.from}`}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										{formatHash(tx.log.from)}
									</a>
								</td>
								<td className="px-6 py-4">
									<a
										href={`#${tx.log.to}`}
										className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
									>
										{formatHash(tx.log.to)}
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
