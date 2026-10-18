"""SQLite persistence: price history + alert de-duplication.

Two jobs:
  * record every observed price so you can see trends over time, and
  * remember which alerts already fired, so a price sitting under your
    threshold for days doesn't spam you every poll. We only re-alert when the
    price drops to a *new low* for that event+watch.
"""

from __future__ import annotations

import sqlite3
from contextlib import closing
from pathlib import Path

from .models import TicketListing

_SCHEMA = """
CREATE TABLE IF NOT EXISTS price_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    fingerprint TEXT NOT NULL,
    provider    TEXT NOT NULL,
    event_name  TEXT NOT NULL,
    venue       TEXT,
    city        TEXT,
    event_date  TEXT,
    price       REAL NOT NULL,
    currency    TEXT,
    url         TEXT,
    fetched_at  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_history_fp ON price_history(fingerprint);

CREATE TABLE IF NOT EXISTS alerts (
    watch_name    TEXT NOT NULL,
    fingerprint   TEXT NOT NULL,
    last_price    REAL NOT NULL,
    alerted_at    TEXT NOT NULL,
    PRIMARY KEY (watch_name, fingerprint)
);
"""


class Store:
    def __init__(self, path: str | Path = "tickets.db"):
        self.path = str(path)
        with closing(self._connect()) as conn:
            conn.executescript(_SCHEMA)
            conn.commit()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        return conn

    def record(self, listing: TicketListing) -> None:
        with closing(self._connect()) as conn:
            conn.execute(
                """INSERT INTO price_history
                   (fingerprint, provider, event_name, venue, city,
                    event_date, price, currency, url, fetched_at)
                   VALUES (?,?,?,?,?,?,?,?,?,?)""",
                (
                    listing.fingerprint, listing.provider, listing.event_name,
                    listing.venue, listing.city, listing.event_date,
                    listing.price, listing.currency, listing.url,
                    listing.fetched_at,
                ),
            )
            conn.commit()

    def should_alert(self, watch_name: str, listing: TicketListing) -> bool:
        """True if this is a fresh alert-worthy price.

        Fires when we've never alerted this watch+event, or when the current
        price is strictly below the last price we alerted on (a new low).
        """
        with closing(self._connect()) as conn:
            row = conn.execute(
                "SELECT last_price FROM alerts WHERE watch_name=? AND fingerprint=?",
                (watch_name, listing.fingerprint),
            ).fetchone()
        return row is None or listing.price < row["last_price"]

    def mark_alerted(self, watch_name: str, listing: TicketListing) -> None:
        with closing(self._connect()) as conn:
            conn.execute(
                """INSERT INTO alerts (watch_name, fingerprint, last_price, alerted_at)
                   VALUES (?,?,?,?)
                   ON CONFLICT(watch_name, fingerprint)
                   DO UPDATE SET last_price=excluded.last_price,
                                 alerted_at=excluded.alerted_at""",
                (watch_name, listing.fingerprint, listing.price, listing.fetched_at),
            )
            conn.commit()

    def lowest_seen(self, fingerprint: str) -> float | None:
        with closing(self._connect()) as conn:
            row = conn.execute(
                "SELECT MIN(price) AS low FROM price_history WHERE fingerprint=?",
                (fingerprint,),
            ).fetchone()
        return row["low"] if row and row["low"] is not None else None
