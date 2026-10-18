"""Command-line entry point.

Examples
--------
    # One-off sweep using demo data (no API keys required)
    python -m tickettracker --demo --once

    # Watch continuously, polling every 15 minutes, using real APIs
    python -m tickettracker --watchlist watchlist.yaml --interval 900

    # See every price found, not just alerts
    python -m tickettracker --demo --once --verbose
"""

from __future__ import annotations

import argparse
import sys
import time
from datetime import datetime

from . import notify
from .config import build_providers, load_dotenv_if_present, load_watches
from .matcher import run_sweep
from .store import Store


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="tickettracker",
        description="Track concert ticket prices and alert when they drop "
                    "into your range.",
    )
    p.add_argument("-w", "--watchlist", default="watchlist.yaml",
                   help="path to watchlist YAML (default: watchlist.yaml)")
    p.add_argument("-d", "--db", default="tickets.db",
                   help="SQLite price-history file (default: tickets.db)")
    p.add_argument("--demo", action="store_true",
                   help="use built-in fake inventory; needs no API keys")
    p.add_argument("--once", action="store_true",
                   help="run a single sweep and exit")
    p.add_argument("--interval", type=int, default=900,
                   help="seconds between sweeps in watch mode (default: 900)")
    p.add_argument("--providers", nargs="+", metavar="NAME",
                   help="restrict to these providers (e.g. seatgeek ticketmaster)")
    p.add_argument("--no-desktop", action="store_true",
                   help="terminal alerts only, skip desktop notifications")
    p.add_argument("--verbose", "-v", action="store_true",
                   help="print every price found, not just alerts")
    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    load_dotenv_if_present()

    try:
        watches = load_watches(args.watchlist)
    except FileNotFoundError:
        print(f"Watchlist not found: {args.watchlist}\n"
              f"Copy watchlist.example.yaml to get started.", file=sys.stderr)
        return 2
    except Exception as exc:  # malformed yaml, missing fields, etc.
        print(f"Could not load watchlist: {exc}", file=sys.stderr)
        return 2

    providers = build_providers(args.providers, demo=args.demo)
    store = Store(args.db)
    desktop = not args.no_desktop

    notify.info(f"Loaded {len(watches)} watch(es); "
                f"providers: {', '.join(p.name for p in providers)}")

    def sweep() -> None:
        stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        notify.info(f"[{stamp}] sweeping…")
        result = run_sweep(watches, providers, store,
                           desktop=desktop, verbose=args.verbose)
        notify.info(f"  → {result.listings_seen} listing(s) checked, "
                    f"{result.alerts_fired} alert(s) fired")

    if args.once:
        sweep()
        return 0

    notify.info(f"Watching every {args.interval}s — Ctrl-C to stop.")
    try:
        while True:
            sweep()
            time.sleep(args.interval)
    except KeyboardInterrupt:
        notify.info("\nStopped.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
