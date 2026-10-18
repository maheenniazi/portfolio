"""Core data structures shared across the tracker."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional


@dataclass(frozen=True)
class TicketListing:
    """A single set of tickets for sale, as returned by one provider.

    Prices are the lowest available price for the event/section at fetch
    time. Different providers expose different granularity; we normalise to
    "cheapest ticket you could buy right now" so watches can compare apples
    to apples.
    """

    provider: str           # e.g. "seatgeek", "ticketmaster"
    event_name: str
    venue: str
    city: str
    event_date: Optional[str]   # ISO date string, provider's local date
    price: float                # lowest available price, in `currency`
    currency: str = "USD"
    section: Optional[str] = None
    url: Optional[str] = None
    fetched_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )

    @property
    def fingerprint(self) -> str:
        """Stable id for an event+provider, used for price history + dedup.

        Deliberately excludes price and fetched_at so the same event tracked
        over time maps to one row of history.
        """
        key = f"{self.provider}|{self.event_name}|{self.venue}|{self.event_date}"
        return hashlib.sha1(key.encode("utf-8")).hexdigest()[:16]

    def describe(self) -> str:
        when = self.event_date or "date TBD"
        where = f"{self.venue}, {self.city}".strip(", ")
        sect = f" [{self.section}]" if self.section else ""
        return f"{self.event_name} — {where} ({when}){sect}"


@dataclass
class Watch:
    """A user's alert rule: notify me about X when it drops below $Y."""

    name: str                       # human label, e.g. "Coldplay LA"
    query: str                      # artist / event keywords to search
    max_price: float                # alert threshold
    city: Optional[str] = None      # optional city filter (case-insensitive)
    currency: str = "USD"
    providers: Optional[list[str]] = None  # None = all enabled providers

    def matches(self, listing: TicketListing) -> bool:
        """True if `listing` satisfies this watch."""
        if listing.price > self.max_price:
            return False
        if self.city and self.city.lower() not in listing.city.lower():
            return False
        if self.providers and listing.provider not in self.providers:
            return False
        # Keyword match: every whitespace-separated term must appear in the
        # event name (cheap but effective; providers already pre-filter by
        # query, this guards against loose API matches).
        hay = listing.event_name.lower()
        return all(term in hay for term in self.query.lower().split())
