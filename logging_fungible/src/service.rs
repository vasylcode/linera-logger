// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::LoggingFungibleToken;
use async_graphql::{EmptySubscription, Object, Request, Response, Schema};
use async_trait::async_trait;
use logging_fungible::{Account, AccountOwner, Operation};
use linera_sdk::{
    base::{Amount, WithServiceAbi},
    QueryContext, Service, ViewStateStorage,
};
use std::sync::Arc;
use thiserror::Error;

linera_sdk::service!(LoggingFungibleToken);

impl WithServiceAbi for LoggingFungibleToken {
    type Abi = logging_fungible::LoggingFungibleTokenAbi;
}

#[async_trait]
impl Service for LoggingFungibleToken {
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    async fn query_application(
        self: Arc<Self>,
        _context: &QueryContext,
        request: Request,
    ) -> Result<Response, Self::Error> {
        let schema = Schema::build(self.clone(), MutationRoot {}, EmptySubscription).finish();
        let response = schema.execute(request).await;
        Ok(response)
    }
}

struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn transfer(
        &self,
        owner: AccountOwner,
        amount: Amount,
        target_account: Account,
    ) -> Vec<u8> {
        bcs::to_bytes(&Operation::Transfer {
            owner,
            amount,
            target_account,
        })
        .unwrap()
    }

    async fn claim(
        &self,
        source_account: Account,
        amount: Amount,
        target_account: Account,
    ) -> Vec<u8> {
        bcs::to_bytes(&Operation::Claim {
            source_account,
            amount,
            target_account,
        })
        .unwrap()
    }
}

/// An error that can occur during the contract execution.
#[derive(Debug, Error)]
pub enum Error {
    /// Invalid query argument; could not deserialize GraphQL request.
    #[error(
        "Invalid query argument; Fungible application only supports JSON encoded GraphQL queries"
    )]
    InvalidQuery(#[from] serde_json::Error),
}
