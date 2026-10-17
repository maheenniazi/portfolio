# Pulse — a limit order book matching engine & backtester

A low-latency **limit order book (LOB) matching engine** written in modern
C++20, with an **event-driven backtester** and a sample **market-making
strategy** on top. It's the core of what every exchange and trading firm runs:
orders come in, the engine matches buyers and sellers by **price-time
priority**, and strategies trade against the resulting book.

- **~5 million orders/sec**, **p50 ≈ 110 ns / p99 ≈ 440 ns** per order on a
  single core (see [Benchmarks](#benchmarks)).
- Zero-allocation hot path (custom object pool), intrusive data structures,
  and a **lock-free SPSC queue** for threading market data to the engine.
- Clean under **AddressSanitizer, UndefinedBehaviorSanitizer, and
  ThreadSanitizer**; 12-test suite including a 20k-operation fuzz test and a
  1M-message concurrency test; built and tested on **GCC and Clang** in CI.

> Why this project exists: I wanted to learn the systems-programming toolkit
> that quant and C++ roles actually screen for — modern C++, lock-free
> concurrency, cache-aware design, CMake, sanitizers, benchmarking — by
> building something real instead of doing toy exercises. A matching engine is
> that "something real."

---

## How an order book works (the 60-second version)

A book holds resting **limit orders** on two sides — **bids** (buyers) and
**asks** (sellers). The best bid is the highest price someone will pay; the
best ask is the lowest price someone will sell at. When a new order arrives it
is matched against the opposite side under two rules, in order:

1. **Price priority** — better prices match first (cheapest ask for a buyer,
   highest bid for a seller).
2. **Time priority** — at the same price, the order that arrived first fills
   first (FIFO).

Anything that can't match immediately rests in the book (if its time-in-force
allows). That's it — every exchange is an elaboration of those two rules.

```
            ASKS (sellers)                         the engine matches an
    price   qty                                    incoming BUY against the
    103     300                                    lowest asks first, then
    102     150   <- best ask                      rests any remainder as a
   ----------------  spread                        new bid.
     99     100   <- best bid
     98     200
            BIDS (buyers)
```

## Architecture

```
   market data feed                strategy (market maker)
   (synthetic / CSV)                        |
          |                                 | buy/sell/cancel
          v                                 v
   +----------------+   SPSC queue   +------------------------+
   |  message feed  | -------------> |     OrderBook          |
   +----------------+  (lock-free)   |  price-time matching   |
                                     |  object pool, O(1)     |
                                     |  cancel via intrusive  |
                                     |  lists + hash index    |
                                     +-----------+------------+
                                                 | trades
                                                 v
                                     +------------------------+
                                     |     Backtester         |
                                     |  position / cash / P&L |----> results.csv
                                     +------------------------+           |
                                                                         v
                                                               python/tearsheet.py
                                                               (Sharpe, drawdown, plots)
```

## The matching engine

Core data structures (`include/pulse/order_book.hpp`):

| Concern | Structure | Cost |
|---|---|---|
| Price levels per side | `std::map<Price, PriceLevel>` (sorted) | best bid/ask in **O(1)**, insert level **O(log L)** |
| Orders within a level | intrusive doubly-linked FIFO | enqueue / dequeue **O(1)** |
| Find an order to cancel | `unordered_map<OrderId, Order*>` | cancel/modify **O(1)** |
| Order allocation | custom `ObjectPool<Order>` free list | no `new`/`delete` in the hot path |

Design decisions worth calling out:

- **Integer prices, never `double`.** Prices are an integer count of ticks.
  Exchanges quote on a discrete grid; floating point would introduce rounding
  bugs where `10.10 != 10.10`. (`include/pulse/types.hpp`)
- **Intrusive lists for O(1) cancel.** In real markets cancels vastly
  outnumber trades, so cancellation has to be cheap. Threading orders through
  `prev`/`next` pointers lets us unlink from the middle of a price-level queue
  without any search.
- **Object pool** instead of per-order heap allocation, so the steady-state
  cost of an order is a couple of pointer swaps and the nodes stay
  cache-friendly.
- **Strong types** (`enum class OrderId`) so the compiler refuses to let a
  price be passed where an id is expected.

Supported order types: **limit** and **market**, with time-in-force
**GTC** (rest the remainder), **IOC** (cancel the remainder), and **FOK**
(fill the whole order or nothing — pre-checked so no partial fills leak on a
kill). Plus `cancel` and `modify` (a size *decrease* keeps queue priority; a
price change or size *increase* loses it, matching real exchange semantics).

## Lock-free concurrency

`include/pulse/spsc_ring_buffer.hpp` is a single-producer / single-consumer
queue that hands messages from a feed thread to the matching thread **without a
lock**. The interesting part is the memory ordering: the producer writes the
payload then publishes the slot with a `release` store; the consumer reads the
slot index with an `acquire` load. That acquire/release pair guarantees the
consumer sees the payload once it sees the new index — get it wrong (e.g.
`relaxed`) and you get a data race that only corrupts messages under load on
some CPUs. The two atomic indices are padded to separate cache lines to avoid
**false sharing**. The `spsc_concurrent_producer_consumer` test pushes 1,000,000
items across two threads and is run under ThreadSanitizer in CI to prove it's
race-free.

## The backtester & market maker

The backtester (`src/backtester.cpp`) replays a market-data feed into the
engine and lets a `Strategy` quote against it, attributing every fill back to
the strategy to track **position**, **cash**, and mark-to-market **P&L**.

The sample strategy (`strategy/market_maker.hpp`) is an **inventory-aware,
post-only market maker**: it quotes a bid and ask around the mid, and **skews
both quotes against its inventory** — when it's long it lowers quotes to lean
toward selling, and vice versa — so its position stays bounded instead of
running away. That inventory-skew idea is the one every market-making interview
asks about.

Running it on a stationary (mean-reverting) synthetic market:

```
$ ./build/pulse_backtest 200000 7 results.csv
steps processed : 200000
strategy fills  : 6310
total P&L       : 105230.0 ticks-units
per-step Sharpe : 0.0172
max drawdown    : 4075.0 ticks-units
```

`scripts/param_sweep.sh` sweeps the maker's spread and requote cadence and
shows the fundamental trade-off — **a wider quoted spread earns more per fill
and suffers less adverse selection (higher P&L, lower drawdown) but trades less
often**:

```
half_spread  requote_thr  PnL          fills   max_drawdown
2            1            -37732.0     10687   44318.0
4            1            105230.0     6310     4075.0
6            1            196527.0     4385     2159.0
8            1            227745.0     3068     1390.0
```

(A pure random-walk market, or real trending flow via `CsvFeed`, is where
adverse selection bites and the naive maker loses — a deliberate talking point,
not a hidden one.)

## Benchmarks

`./build/pulse_bench 2000000` builds a realistic mixed workload (orders that
rest + orders that cross) and reports throughput and the **latency
distribution**, because tail latency (p99) matters more than the mean in
trading:

```
throughput      : ~5.2 M orders/s
per-order latency (nanoseconds)
  p50   :    ~110
  p99   :    ~440
  p99.9 :   ~2400
```

(Numbers from a single core; the long tail comes from the object pool growing a
new block and `std::map` rebalancing — a concrete next-step for optimization.)

## Build & run

Requires CMake ≥ 3.20 and a C++20 compiler (GCC 11+ / Clang 14+).

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j

ctest --test-dir build --output-on-failure   # run the test suite
./build/pulse_demo                            # guided tour of matching
./build/pulse_backtest                        # run the market-maker backtest
./build/pulse_bench                           # throughput + latency benchmark
./scripts/param_sweep.sh                      # strategy parameter sweep

python3 python/tearsheet.py results.csv       # analysis + chart (needs matplotlib)
```

Run the tests under sanitizers (what CI does):

```bash
cmake -S . -B build-asan -DCMAKE_BUILD_TYPE=Debug -DPULSE_SANITIZE=address,undefined
cmake --build build-asan -j --target pulse_tests && ./build-asan/pulse_tests

cmake -S . -B build-tsan -DCMAKE_BUILD_TYPE=Debug -DPULSE_SANITIZE=thread
cmake --build build-tsan -j --target pulse_tests && ./build-tsan/pulse_tests
```

## Project layout

```
include/pulse/      public headers (the engine is a reusable library)
  types.hpp           strong value types (OrderId, Price, Side, ...)
  order.hpp           the resting-order node + Trade event
  object_pool.hpp     free-list allocator for hot-path objects
  order_book.hpp      the price-time-priority book interface
  spsc_ring_buffer.hpp  lock-free single-producer/single-consumer queue
  feed.hpp            market-data feeds (synthetic + CSV replay)
  strategy.hpp        the Strategy / StrategyApi interface
  backtester.hpp      event-driven backtest harness + P&L
src/                  order_book.cpp, backtester.cpp
strategy/             market_maker.hpp (sample strategy)
apps/                 demo.cpp, backtest.cpp
bench/                bench_order_book.cpp
tests/                custom header-only test runner + test suites
python/               tearsheet.py (analysis & plotting)
scripts/              param_sweep.sh
```

## Roadmap / what I'd build next

- Pre-size the object pool and replace `std::map` with a flat array of price
  levels indexed by tick to flatten the latency tail.
- A binary wire protocol + a networked gateway that feeds the engine through
  the SPSC queue from a separate thread.
- More strategies (momentum, mean-reversion) and transaction-cost modelling.
- pybind11 bindings so strategies can be prototyped in Python against the C++
  engine.
