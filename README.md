# linera_logger

remember to use wsl for everything if u are on windows! caution: needs like 30 GB including linera-protocol

check u have dependencies: https://linera.dev/getting_started/installation.html#dependencies

build linera-protocol:
```
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
git checkout 8d2ad58366e780f2667bbc572684ea8f409d1544
cargo install --path linera-service
```

git clone this to same folder as linera-protocol and build:
```
git clone -b master https://github.com/toshinari123/linera_logger
cd linera_logger/logger
cargo build --release --target wasm32-unknown-unknown
cd ../logger_macro
cargo build
cd ../logging_fungible
cargo build --release --target wasm32-unknown-unknown
```
we will use multiple terminals, denoted by [terminal].

if you have services running make sure to close them now
[local network]:
```
./linera-logger/run.sh
```
[linera service 1]:
```
cd linera-protocol
export LINERA_WALLET="$(realpath target/debug/wallet.json)"
export LINERA_STORAGE="rocksdb:$(dirname "$LINERA_WALLET")/linera.db"
linera --wallet "$LINERA_WALLET" --storage "$LINERA_STORAGE" service --port 8080
```
[linera service 2]:
```
cd linera-protocol
export LINERA_WALLET_2="$(realpath target/debug/wallet_2.json)"
export LINERA_STORAGE_2="rocksdb:$(dirname "$LINERA_WALLET_2")/linera_2.db"
linera --wallet "$LINERA_WALLET_2" --storage "$LINERA_STORAGE_2" service --port 8081
```
[frontend]:
```
cd linera_logger/logging_fungible/web-frontend
npm install
npm start
```
[linera commandline]:
```
cd linera-protocol
export LINERA_WALLET="$(realpath target/debug/wallet.json)"
export LINERA_STORAGE="rocksdb:$(dirname "$LINERA_WALLET")/linera.db"
export LINERA_WALLET_2="$(realpath target/debug/wallet_2.json)"
export LINERA_STORAGE_2="rocksdb:$(dirname "$LINERA_WALLET_2")/linera_2.db"
linera --wallet "$LINERA_WALLET" --storage "$LINERA_STORAGE" wallet show
linera --wallet "$LINERA_WALLET_2" --storage "$LINERA_STORAGE_2" wallet show
```

