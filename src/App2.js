import { useState } from "react";
import { gql, useLazyQuery, useSubscription } from "@apollo/client";
import { Search, Table, Metrics } from "./components";

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

function App2() {
	const [blocks, setBlocks] = useState([]);

	const [loadLog, { called, loading, data }] = useLazyQuery(GET_LOG, {
		onCompleted: (data) => {
			var index = 0;
            const blocks = data.log
	            .reduce((accum, logItem) => {
		            if (logItem.blockHeight == accum.length) {
			            accum.push([]);
		            }
                    if (logItem.logType === "INITIALIZATION_START") {
		                accum[logItem.blockHeight].push((logItem.appName + " initialization", index));
                    } else if (logItem.logType === "OPERATION_EXECUTION_START") {
		                accum[logItem.blockHeight].push((logItem.appName + " operation: " + logItem.log.split(' ')[0], index));
                    } else if (logItem.logType === "MESSAGE_EXECUTION_START") {
		                accum[logItem.blockHeight].push((logItem.appName + " message: " + logItem.log.split(' ')[0], index));
                    } 
                    index += 1;
	            }, []);
			setBlocks(blocks);
		},
	});

    //each entry in blocks[i] will be clickable and the content shown to the right will be generated wiht index
    //blocks is in the forn  [[(name, index)]] where name is the string shown in the blocks  

	if (called && loading) return <p>Loading ...</p>;
	if (!called) {
		void loadLog();
	}
	return (
		<div className="App dark:bg-black min-h-screen">
			<div className="max-w-7xl mx-auto py-8">
				<h1>hello</h1>
			</div>
		</div>
	);
}

export default App2;
