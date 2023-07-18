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
use logger::{LogStatement, ApplicationCall};
use linera_sdk::views::views::View;

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
        _context: &OperationContext,
        _argument: (),
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        //self.log = linera_sdk::views::log_view::LogView::load(context).await.unwrap();
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
        argument: ApplicationCall,
        _forwarded_sessions: Vec<SessionId>,
    ) -> Result<ApplicationCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error> {
        match argument {
            ApplicationCall::Log { log_statement } => {
                self.log.push(log_statement);
                Ok(ApplicationCallResult::default())
            },
            ApplicationCall::Query {
                log_type,
                keyword,
                app,
                app_name,
            } => {
                let mut out = vec![];
                let log = self.log.read(0..self.log.count()).await?;
                for log_statement in log {
                    if let Some(log_type) = log_type {
                        if log_statement.log_type != log_type { continue; }
                    }
                    if !log_statement.log.contains(&keyword) { continue; }
                    if let Some(app) = app {
                        if log_statement.app != app { continue; }
                    }
                    if let Some(app_name) = app_name.clone() {
                        if log_statement.app_name != app_name { continue; }
                    }
                    out.push(log_statement);
                }
                Ok(ApplicationCallResult {
                    value: out,
                    execution_result: ExecutionResult::default(),
                    create_sessions: vec![],
                })
            }
        }
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

    #[error("view error {0}")]
    ViewError(#[from] linera_sdk::views::views::ViewError),

    // Add more error variants here.
}
