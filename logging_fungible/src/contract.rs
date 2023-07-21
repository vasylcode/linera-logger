// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::LoggingFungibleToken;
use async_trait::async_trait;
use logging_fungible::{
    Account, AccountOwner, ApplicationCall, Destination, Message, Operation, SessionCall,
};
use linera_sdk::{
    base::{Amount, ApplicationId, Owner, SessionId, WithContractAbi},
    contract::system_api,
    ApplicationCallResult, CalleeContext, Contract, ExecutionResult, MessageContext,
    OperationContext, SessionCallResult, ViewStateStorage,
};
use std::str::{FromStr, from_utf8, Utf8Error};
use thiserror::Error;
use log::{info};
use logger_macro::*;

linera_sdk::contract!(LoggingFungibleToken);

impl WithContractAbi for LoggingFungibleToken {
    type Abi = logging_fungible::LoggingFungibleTokenAbi;
}

#[async_trait]
impl Contract for LoggingFungibleToken {
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    #[initialize(Self::logger_id()?)]
    async fn initialize(
        &mut self,
        context: &OperationContext,
        mut state: Self::InitializationArgument,
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        // If initial accounts are empty, creator gets 1M tokens to act like a faucet.
        if state.accounts.is_empty() {
            if let Some(owner) = context.authenticated_signer {
                state.accounts.insert(
                    AccountOwner::User(owner),
                    Amount::from_str("1000000").unwrap(),
                );
            }
        }
        self.initialize_accounts(state).await;
        Ok(ExecutionResult::default())
    }

    #[execute_operation(Self::logger_id()?)]
    async fn execute_operation(
        &mut self,
        context: &OperationContext,
        operation: Self::Operation,
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        let res = match operation {
            Operation::Transfer {
                owner,
                amount,
                target_account,
            } => {
                self.check_account_authentication(None, context.authenticated_signer, owner).await?;
                self.debit(owner, amount).await?;
                Ok(self
                    .finish_transfer_to_account(amount, target_account)
                    .await?)
            }

            Operation::Claim {
                source_account,
                amount,
                target_account,
            } => {
                self.check_account_authentication(
                    None,
                    context.authenticated_signer,
                    source_account.owner,
                ).await?;
                self.claim(source_account, amount, target_account).await
            }
        };
        res
    }
    
    #[execute_message(Self::logger_id()?)]
    async fn execute_message(
        &mut self,
        context: &MessageContext,
        message: Message,
    ) -> Result<ExecutionResult<Self::Message>, Self::Error> {
        let res = match message {
            Message::Credit { owner, amount } => {
                info!("{}", amount);
                self.credit(owner, amount).await;
                Ok(ExecutionResult::default())
            }
            Message::Withdraw {
                owner,
                amount,
                target_account,
            } => {
                self.check_account_authentication(None, context.authenticated_signer, owner).await?;
                self.debit(owner, amount).await?;
                Ok(self
                    .finish_transfer_to_account(amount, target_account)
                    .await?)
            }
        };
        res
    }

    #[handle_application_call(Self::logger_id()?)]
    async fn handle_application_call(
        &mut self,
        context: &CalleeContext,
        call: ApplicationCall,
        _forwarded_sessions: Vec<SessionId>,
    ) -> Result<ApplicationCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error>
    {
        let res = match call {
            ApplicationCall::Balance { owner } => {
                let mut result = ApplicationCallResult::default();
                let balance = self.balance(&owner).await;
                result.value = balance;
                Ok(result)
            }

            ApplicationCall::Transfer {
                owner,
                amount,
                destination,
            } => {
                self.check_account_authentication(
                    context.authenticated_caller_id,
                    context.authenticated_signer,
                    owner,
                ).await?;
                self.debit(owner, amount).await?;
                Ok(self
                    .finish_transfer_to_destination(amount, destination)
                    .await?)
            }

            ApplicationCall::Claim {
                source_account,
                amount,
                target_account,
            } => {
                self.check_account_authentication(
                    None,
                    context.authenticated_signer,
                    source_account.owner,
                ).await?;
                let execution_result = self.claim(source_account, amount, target_account).await?;
                Ok(ApplicationCallResult {
                    execution_result,
                    ..Default::default()
                })
            }
        };
        res
    }

    #[handle_session_call(Self::logger_id()?)]
    async fn handle_session_call(
        &mut self,
        _context: &CalleeContext,
        state: Self::SessionState,
        request: SessionCall,
        _forwarded_sessions: Vec<SessionId>,
    ) -> Result<SessionCallResult<Self::Message, Amount, Self::SessionState>, Self::Error> {
        match request {
            SessionCall::Balance => self.handle_session_balance(state).await,
            SessionCall::Transfer {
                amount,
                destination,
            } => {
                self.handle_session_transfer(state, amount, destination)
                    .await
            }
        }
    }
}

impl LoggingFungibleToken {
    fn logger_id() -> Result<ApplicationId<logger::LoggerAbi>, Error> {
        /*for app_id in system_api::required_application_ids() {
            info!("{}", bcs::to_bytes(&app_id.bytecode_id)?.into_iter().map(|b| format!("{:0>2x}", b)).collect::<String>());
            info!("{}", Self::parameters()?.serialized_logger_bytecode_id);
            if bcs::to_bytes(&app_id.bytecode_id)?.into_iter().map(|b| format!("{:0>2x}", b)).collect::<String>() == Self::parameters()?.serialized_logger_bytecode_id { 
                return Ok(app_id.with_abi::<logger::LoggerAbi>()); 
            }
        }
        return Err(Error::NoRequiredIdsError);*/
        Ok(bcs::from_bytes::<ApplicationId>(&hex::decode(Self::parameters()?.logger_application_id)?)?.with_abi::<logger::LoggerAbi>())
    }

    #[function(Self::logger_id()?)]
    async fn check_account_authentication(
        &mut self,
        authenticated_application_id: Option<ApplicationId>,
        authenticated_signer: Option<Owner>,
        owner: AccountOwner,
    ) -> Result<(), Error> {
        match owner {
            AccountOwner::User(address) if authenticated_signer == Some(address) => Ok(()),
            AccountOwner::Application(id) if authenticated_application_id == Some(id) => Ok(()),
            _ => Err(Error::IncorrectAuthentication),
        }
    }

    #[function(Self::logger_id()?)]
    async fn handle_session_balance(
        &mut self,
        balance: Amount,
    ) -> Result<SessionCallResult<Message, Amount, Amount>, Error> {
        let application_call_result = ApplicationCallResult {
            value: balance,
            execution_result: ExecutionResult::default(),
            create_sessions: vec![],
        };
        let session_call_result = SessionCallResult {
            inner: application_call_result,
            new_state: Some(balance),
        };
        Ok(session_call_result)
    }

    #[function(Self::logger_id()?)]
    async fn handle_session_transfer(
        &mut self,
        mut balance: Amount,
        amount: Amount,
        destination: Destination,
    ) -> Result<SessionCallResult<Message, Amount, Amount>, Error> {
        balance
            .try_sub_assign(amount)
            .map_err(|_| Error::InsufficientSessionBalance)?;

        let updated_session = (balance > Amount::zero()).then_some(balance);

        Ok(SessionCallResult {
            inner: self
                .finish_transfer_to_destination(amount, destination)
                .await?,
            new_state: updated_session,
        })
    }

    #[function(Self::logger_id()?)]
    async fn claim(
        &mut self,
        source_account: Account,
        amount: Amount,
        target_account: Account,
    ) -> Result<ExecutionResult<Message>, Error> {
        if source_account.chain_id == system_api::current_chain_id() {
            self.debit(source_account.owner, amount).await?;
            Ok(self
                .finish_transfer_to_account(amount, target_account)
                .await?)
        } else {
            let message = Message::Withdraw {
                owner: source_account.owner,
                amount,
                target_account,
            };
            Ok(ExecutionResult::default()
                .with_authenticated_message(source_account.chain_id, message))
        }
    }

    #[function(Self::logger_id()?)]
    async fn finish_transfer_to_destination(
        &mut self,
        amount: Amount,
        destination: Destination,
    ) -> Result<ApplicationCallResult<Message, Amount, Amount>, Error> {
        let mut result = ApplicationCallResult::default();
        match destination {
            Destination::Account(account) => {
                result.execution_result = self.finish_transfer_to_account(amount, account).await?;
            }
            Destination::NewSession => {
                result.create_sessions.push(amount);
            }
        }
        Ok(result)
    }

    #[function(Self::logger_id()?)]
    async fn finish_transfer_to_account(
        &mut self,
        amount: Amount,
        account: Account,
    ) -> Result<ExecutionResult<Message>, Error> {
        if account.chain_id == system_api::current_chain_id() {
            self.credit(account.owner, amount).await;
            Ok(ExecutionResult::default())
        } else {
            let message = Message::Credit {
                owner: account.owner,
                amount,
            };
            Ok(ExecutionResult::default().with_message(account.chain_id, message))
        }
    }
}

/// An error that can occur during the contract execution.
#[derive(Debug, Error)]
pub enum Error {
    /// Insufficient balance in source account.
    #[error("Source account does not have sufficient balance for transfer")]
    InsufficientBalance(#[from] state::InsufficientBalanceError),

    /// Insufficient balance in session.
    #[error("Session does not have sufficient balance for transfer")]
    InsufficientSessionBalance,

    /// Requested transfer does not have permission on this account.
    #[error("The requested transfer is not correctly authenticated.")]
    IncorrectAuthentication,

    /// Failed to deserialize BCS bytes
    #[error("Failed to deserialize BCS bytes")]
    BcsError(#[from] bcs::Error),

    /// Failed to deserialize JSON string
    #[error("Failed to serialize or deserialize JSON string bruh {0}")]
    JsonError(#[from] serde_json::Error),

    #[error("how did u even get this utf8 error (parameter)")]
    Utf8Error(#[from] Utf8Error),

    #[error("ur crate weird {0}")]
    FindCrateError(#[from] find_crate::Error),

    #[error("hecks {0}")]
    HexError(#[from] hex::FromHexError),

    #[error("cannot read ur toml {0}")]
    IoError(#[from] std::io::Error),

    #[error("cannot deserialize ur toml {0}")]
    TomlDeError(#[from] toml::de::Error),

    #[error("aaaaaaaaaaaaaaaaaaaaaaa")]
    NoRequiredIdsError,

    #[error("wheres ur manifest dir")]
    NotFoundManifestDir,

    #[error("wheres ur crate name in cargo.toml bruh")]
    NoNameInCargoToml
}
