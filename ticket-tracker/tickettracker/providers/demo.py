"""Demo provider — deterministic fake inventory so the bot runs with no keys.

This lets you try the full pipeline (watch matching, price history, dedup,
notifications) offline. Prices drift slightly each call so you can watch
history accumulate and alerts fire when a price dips under a threshold.
"""

from __future__ import annotations

import random

from ..models import TicketListing
from .base import Provider

_CATALOG = [
    # (event, venue, city, base_price)
    ("Coldplay: Music of the Spheres", "SoFi Stadium", "Los Angeles", 140.0),
    ("Taylor Swift | The Eras Tour", "MetLife Stadium", "East Rutherford", 420.0),
    ("Olivia Rodrigo: GUTS Tour", "Madison Square Garden", "New York", 115.0),
    ("Hozier", "The Greek Theatre", "Los Angeles", 95.0),
    ("Fred again..", "Climate Pledge Arena", "Seattle", 160.0),
]


class DemoProvider(Provider):
    name = "demo"

    def __init__(self, seed: int | None = None):
        # A fixed seed makes a single run reproducible; omit for live drift.
        self._rng = random.Random(seed)

    def search(self, query: str, city: str | None = None) -> list[TicketListing]:
        terms = query.lower().split()
        out: list[TicketListing] = []
        for name, venue, ecity, base in _CATALOG:
            if terms and not all(t in name.lower() for t in terms):
                continue
            if city and city.lower() not in ecity.lower():
                continue
            # +/- 20% jitter around the base price.
            price = round(base * self._rng.uniform(0.8, 1.2), 2)
            out.append(
                TicketListing(
                    provider=self.name,
                    event_name=name,
                    venue=venue,
                    city=ecity,
                    event_date="2026-07-15T20:00:00",
                    price=price,
                    currency="USD",
                    url="https://example.com/demo-event",
                )
            )
        return out
