# linera_logger

remember to use wsl for everything if u are on windows! caution: needs like 30 GB including linera-protocol

```
git clone -b master https://github.com/toshinari123/linera_logger
cd linera_logger/logger
cargo build --release
cd ../logging_fungible
cargo build --release
```
we will use multiple terminals, denoted by [terminal].

[local network]:
```
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
git checkout 8d2ad58366e780f2667bbc572684ea8f409d1544
cargo install --path linera-service
./scripts/run_local.sh
```
[linera commandline]:
```
cd linera-protocol
export LINERA_WALLET="$(realpath target/debug/wallet.json)"
export LINERA_STORAGE="rocksdb:$(dirname "$LINERA_WALLET")/linera.db"
export LINERA_WALLET_2="$(realpath target/debug/wallet_2.json)"
export LINERA_STORAGE_2="rocksdb:$(dirname "$LINERA_WALLET_2")/linera_2.db"
cd ../linera_logger
linera --wallet "$LINERA_WALLET" --storage "$LINERA_STORAGE" publich-bytecode logger/target/wasm32-unknown-unknown/release/logger_{contract,service
}.wasm
```
