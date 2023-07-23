import { Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function Metrics({ block, tx, chains, nodes }) {
	return (
		<div className="flex justify-between items-center py-8 gap-10">
			<div className="flex-1 py-6 px-16 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-50">
				<div className="flex items-center justify-center gap-2">
					<div className="text-lg font-medium text-gray-500 dark:text-gray-50">Latest Block</div>
					<Tooltip label="The current latest block on the chain." withArrow arrowSize={6}>
						<IconInfoCircle className="cursor-pointer text-gray-500 dark:text-gray-50" width="20" />
					</Tooltip>
				</div>
				<div className="flex items-center justify-center pt-2">
					<div className="text-2xl font-bold">{block}</div>
				</div>
			</div>

			<div className="flex-1 py-6 px-16 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-50">
				<div className="flex items-center justify-center gap-2">
					<div className="text-lg font-medium text-gray-500 dark:text-gray-50">Total TX</div>
					<Tooltip label="The number of total transactions on the chain." withArrow arrowSize={6}>
						<IconInfoCircle className="cursor-pointer text-gray-500 dark:text-gray-50" width="20" />
					</Tooltip>
				</div>
				<div className="flex items-center justify-center pt-2">
					<div className="text-2xl font-bold ">{tx}</div>
				</div>
			</div>

			<div className="flex-1 py-6 px-16 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-50">
				<div className="flex items-center justify-center gap-2">
					<div className="text-lg font-medium text-gray-500 dark:text-gray-50">Total Chains</div>
					<Tooltip label="The number of total chains." withArrow arrowSize={6}>
						<IconInfoCircle className="cursor-pointer text-gray-500 dark:text-gray-50" width="20" />
					</Tooltip>
				</div>
				<div className="flex items-center justify-center pt-2">
					<div className="text-2xl font-bold">{chains}</div>
				</div>
			</div>

			<div className="flex-1 py-6 px-16 bg-gray-50 rounded-lg shadow-md dark:bg-gray-700 dark:text-gray-50">
				<div className="flex items-center justify-center gap-2">
					<div className="text-lg font-medium text-gray-500 dark:text-gray-50">Total Nodes</div>
					<Tooltip label="The number of all nodes registered on the chain." withArrow arrowSize={6}>
						<IconInfoCircle className="cursor-pointer text-gray-500 dark:text-gray-50" width="20" />
					</Tooltip>
				</div>
				<div className="flex items-center justify-center pt-2">
					<div className="text-2xl font-bold">{nodes}</div>
				</div>
			</div>
		</div>
	);
}
