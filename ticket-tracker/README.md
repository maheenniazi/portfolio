# 🎟 Ticket Tracker

A small Python bot that watches concert ticket prices across ticketing sites
and alerts you — in your terminal and as a desktop notification — the moment a
show you care about drops into your price range.

```
🎟  PRICE ALERT · Coldplay LA
   Coldplay: Music of the Spheres — SoFi Stadium, Los Angeles (2026-07-15T20:00:00)
   USD 138.40 (was $152.10)  via seatgeek
   https://seatgeek.com/...
```

## Quick start (no API keys needed)

```bash
cd ticket-tracker
pip install -r requirements.txt
cp watchlist.example.yaml watchlist.yaml
python -m tickettracker --demo --once --verbose
```

`--demo` runs against built-in fake inventory so you can see the whole
pipeline — matching, price history, alerts — working offline before wiring up
real data.

## Using real data

1. Get API keys (free tiers exist):
   - **SeatGeek** — https://seatgeek.com/account/develop
   - **Ticketmaster** (Discovery API) — https://developer.ticketmaster.com/
2. `cp .env.example .env` and paste your keys in.
3. Edit `watchlist.yaml` with the shows and prices you want.
4. Run it:

```bash
# single pass
python -m tickettracker --once

# keep watching, poll every 15 minutes
python -m tickettracker --interval 900
```

## Which sites actually work, and why

Ticketing sites vary enormously in how open their data is. This bot is
**API-first** by design — it integrates cleanly with the sites that offer
official APIs and treats the rest as pluggable slots you can fill if you
obtain the right access.

| Site | Status | Notes |
|------|--------|-------|
| **SeatGeek** | ✅ Working | Official Platform API; returns lowest price per event |
| **Ticketmaster** | ✅ Working | Official Discovery API; mostly primary/face-value inventory |
| **StubHub** | 🔌 Stub | Partner API is gated — drop credentials into the provider to enable |
| **Gametime** | 🔌 Stub | No public API; would need a scraper |
| **Viagogo** | 🔌 Stub | No public API, aggressive anti-bot — check ToS before scraping |

> **On scraping the gated sites:** it's technically possible but fragile
> (markup changes break it constantly), can get your IP blocked, and may
> violate each site's Terms of Service. The stubs in
> `tickettracker/providers/scrapers.py` share the same interface as the real
> providers, so if you obtain legitimate access you implement one method and
> everything else — matching, history, alerts — just works.

## How it works

```
watchlist.yaml ─▶ providers (SeatGeek, Ticketmaster, …)
                      │  search(query, city)
                      ▼
               TicketListing[]  ─▶  SQLite price history
                      │                 │
                      ▼                 ▼
                 watch.matches?    new all-time low?
                      └──────┬──────────┘
                             ▼
                   terminal + desktop alert
```

- **Price history** is kept in SQLite (`tickets.db`), so you build a record of
  how prices move over time.
- **De-duplication**: once an alert fires for an event, it won't fire again
  until the price drops to a *new low* — so a cheap ticket sitting in your
  range won't spam you every poll.
- **Resilience**: a flaky provider returns an empty list rather than crashing
  the sweep; providers with no credentials are skipped with a log line.

## Project layout

```
ticket-tracker/
├── tickettracker/
│   ├── cli.py            # argparse entry point (python -m tickettracker)
│   ├── config.py         # load watchlist YAML, build providers, .env loader
│   ├── models.py         # TicketListing + Watch dataclasses
│   ├── matcher.py        # the sweep: query → record → alert
│   ├── store.py          # SQLite price history + alert dedup
│   ├── notify.py         # terminal + cross-platform desktop notifications
│   └── providers/
│       ├── base.py       # Provider abstract base class
│       ├── seatgeek.py   # official API  ✅
│       ├── ticketmaster.py # official API ✅
│       ├── demo.py       # offline fake data for testing
│       └── scrapers.py   # StubHub / Gametime / Viagogo stubs 🔌
├── tests/test_core.py
├── watchlist.example.yaml
└── .env.example
```

## Tests

```bash
pip install pytest && pytest          # or, with no pytest:
python tests/test_core.py
```

## Running it on a schedule

For real use, run it as a background service rather than leaving a terminal
open:

- **cron** (every 15 min): `*/15 * * * * cd /path/to/ticket-tracker && python -m tickettracker --once`
- **systemd timer**, **launchd** (macOS), or a cloud scheduler also work.

## Ideas to extend

- Add email / Telegram / Discord notifiers (same `notify` pattern).
- Add a `--history EVENT` command to print price trends from SQLite.
- Add seat-level filtering (section, quantity) for providers that expose it.
- Implement one of the scraper stubs against a legitimate data source.
