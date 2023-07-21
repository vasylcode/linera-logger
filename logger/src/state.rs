use linera_sdk::views::{ViewStorageContext, LogView};
use linera_views::views::{GraphQLView, RootView};
use logger::LogStatement;

#[derive(RootView, GraphQLView)]
#[view(context = "ViewStorageContext")]
pub struct Logger {
    pub log: LogView<LogStatement>,
    //pub chains: SetView<ChainId>,
}
