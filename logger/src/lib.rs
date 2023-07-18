use linera_sdk::base::{ContractAbi, ServiceAbi, ApplicationId, BlockHeight, ChainId};
use serde::{Serialize, Deserialize};
use async_graphql::{SimpleObject, InputObject, Request, Response, Enum};

#[derive(Clone, Copy, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Serialize, Deserialize)]
pub struct LoggerAbi;

impl ContractAbi for LoggerAbi {
    type InitializationArgument = ();
    type Parameters = ();
    type Operation = ();
    type ApplicationCall = ApplicationCall;
    type Message = ();
    type SessionCall = ();
    type Response = Vec<LogStatement>;
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

#[derive(Debug, Deserialize, Serialize, Clone, SimpleObject, InputObject)]
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

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum ApplicationCall {
    Log {
        log_statement: LogStatement,
    },
    Query {
        log_type: Option<LogType>,
        keyword: String,
        app: Option<ApplicationId>,
        app_name: Option<String>,
    },
}
