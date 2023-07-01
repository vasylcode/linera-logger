
#![cfg_attr(target_arch = "wasm32", no_main)]

mod state;

use self::state::Logger;
use async_graphql::{Schema, EmptyMutation, EmptySubscription, Request, Response};
use async_trait::async_trait;
use linera_sdk::{base::WithServiceAbi, QueryContext, Service, ViewStateStorage};
use std::sync::Arc;
use thiserror::Error;

linera_sdk::service!(Logger);

impl WithServiceAbi for Logger {
    type Abi = logger::LoggerAbi;
}

#[async_trait]
impl Service for Logger {
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    async fn query_application(
        self: Arc<Self>,
        _context: &QueryContext,
        request: Request,
    ) -> Result<Response, Self::Error> {
        let schema = Schema::build(self.clone(), EmptyMutation, EmptySubscription).finish();
        let response = schema.execute(request).await;
        Ok(response)
    }
}

/// An error that can occur while querying the service.
#[derive(Debug, Error)]
pub enum Error {
    /// Query not supported by the application.
    #[error("Queries not supported by application")]
    QueriesNotSupported,

    /// Invalid query argument; could not deserialize request.
    #[error("Invalid query argument; could not deserialize request")]
    InvalidQuery(#[from] serde_json::Error),

    // Add error variants here.
}
