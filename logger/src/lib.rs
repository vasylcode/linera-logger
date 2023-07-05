use linera_sdk::base::{ContractAbi, ServiceAbi, ApplicationId, BlockHeight, ChainId};
use serde::{Serialize, Deserialize};
use async_graphql::{Object, Request, Response, Enum};

#[derive(Clone, Copy, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Serialize, Deserialize)]
pub struct LoggerAbi;

impl ContractAbi for LoggerAbi {
    type InitializationArgument = ();
    type Parameters = ();
    type Operation = ();
    type ApplicationCall = LogStatement;
    type Message = ();
    type SessionCall = ();
    type Response = ();
    type SessionState = ();
}

impl ServiceAbi for LoggerAbi {
    type Query = Request;
    type QueryResponse = Response;
    type Parameters = ();
}

#[derive(Debug, Deserialize, Serialize, Clone, Enum, Copy, Eq, PartialEq)]
pub enum LogType {
    InitializationStart,
    InitializationEnd,
    OperationExecutionStart,
    OperationExecutionEnd,
    ApplicationCallStart,
    ApplicationCallEnd,
    ApplicationCallHandleStart,
    ApplicationCallHandleEnd,
    SessionCallStart,
    SessionCallEnd,
    SessionCallHandleStart,
    SessionCallHandleEnd,
    MessageSent,
    MessageExecutionStart,
    MessageExecutionEnd,
    QueryStart,
    QueryEnd,
    FunctionStart,
    FunctionEnd,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct LogStatement {
    pub log_type: LogType,
    pub log: String,
    pub block_height: BlockHeight,      //current block height, only applies to operation or
                                        //message handle
    pub other_chain: ChainId,           //the from chainid when handling message or the to chainid
                                        //when sending message
    pub from_block_height: BlockHeight, //only when handling message
    pub app: ApplicationId,
    pub app_name: String,
}

#[Object]
impl LogStatement {
    async fn log_type(&self) -> LogType { self.log_type }
    async fn log(&self) -> String { self.log.clone() }
    async fn block_height(&self) -> BlockHeight { self.block_height }
    async fn other_chain(&self) -> ChainId { self.other_chain }
    async fn from_block_height(&self) -> BlockHeight { self.from_block_height }
    async fn app(&self) -> ApplicationId { self.app }
    async fn app_name(&self) -> String { self.app_name.clone() }
}
