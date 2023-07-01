use linera_sdk::base::{ContractAbi, ServiceAbi};
use serde::{Serialize, Deserialize};
use async_graphql::{scalar, InputObject, Request, Response, Enum};
use linera_sdk::base::ApplicationId;

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
    OperationExecutionStart,
    OperationExecutionEnd,
    ApplicationCallStart,
    ApplicationCallEnd,
    ApplicationCallHandleStart,
    ApplicationCallHandleEnd,
    MessageSent,
    MessageExecutionStart,
    MessageExecutionEnd,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct LogStatement {
    pub log_type: LogType,
    pub log: String,
    pub app: ApplicationId,
}

scalar!(LogStatement);
