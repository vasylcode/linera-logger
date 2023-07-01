#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::Logger;
use async_trait::async_trait;
use linera_sdk::{
    base::{SessionId, WithContractAbi},
    ApplicationCallResult, CalleeContext, Contract, MessageContext,
    ExecutionResult, OperationContext, SessionCallResult, ViewStateStorage,
};
use thiserror::Error;
use logger::LogStatement;

linera_sdk::contract!(Logger);

impl WithContractAbi for Logger {
    type Abi = logger::LoggerAbi;
}

#[async_trait]
impl Contract for Logger {
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    async fn initialize(
        &mut self,
        context: &OperationContext,
        _argument: (),
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        self.log = linera_sdk::views::log_view::LogView::load(context).await.unwrap();
        Ok(ExecutionResult::default())
    }

    async fn execute_operation(
        &mut self,
        _context: &OperationContext,
        _operation: (),
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        Ok(ExecutionResult::default())
    }

    async fn execute_message(
        &mut self,
        _context: &MessageContext,
        _message: (),
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        Ok(ExecutionResult::default())
    }

    async fn handle_application_call(
        &mut self,
        _context: &CalleeContext,
        log_statement: LogStatement,
        _forwarded_sessions: Vec<SessionId>,
    ) -> Result<ApplicationCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error> {
        self.log.push(log_statement);
        Ok(ApplicationCallResult::default())
    }

    async fn handle_session_call(
        &mut self,
        _context: &CalleeContext,
        _session: (),
        _argument: (),
        _forwarded_sessions: Vec<SessionId>,
    ) -> Result<SessionCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error> {
        Ok(SessionCallResult::default())
    }
}

/// An error that can occur during the contract execution.
#[derive(Debug, Error)]
pub enum Error {
    /// Failed to deserialize BCS bytes
    #[error("Failed to deserialize BCS bytes")]
    BcsError(#[from] bcs::Error),

    /// Failed to deserialize JSON string
    #[error("Failed to deserialize JSON string")]
    JsonError(#[from] serde_json::Error),

    // Add more error variants here.
}
