"""Placeholder providers for sites without a usable official API.

StubHub (partner-gated), Gametime (no public API), and Viagogo (no public
API, aggressive anti-bot) can't be integrated cleanly the way SeatGeek and
Ticketmaster can. Rather than ship fragile scrapers that break weekly — and
that may run afoul of each site's Terms of Service — we expose them as
ready-to-implement stubs sharing the same `Provider` contract.

To add a real source:
  1. Implement `search()` below (an official/partner API is strongly
     preferred over HTML scraping; check the site's ToS and robots.txt first).
  2. Return `TicketListing` objects — the matcher, store, and notifier need
     no changes.
  3. Register the class in `tickettracker.config.build_providers`.

Each stub reports `available = False`, so a normal run simply skips it with a
log line instead of erroring.
"""

from __future__ import annotations

from ..models import TicketListing
from .base import Provider


class _UnimplementedScraper(Provider):
    #: one-line reason shown to the user explaining why it's inactive
    reason = "not implemented"

    @property
    def available(self) -> bool:
        return False

    def search(self, query: str, city: str | None = None) -> list[TicketListing]:
        return []


class StubHubProvider(_UnimplementedScraper):
    name = "stubhub"
    reason = "needs StubHub partner API credentials"


class GametimeProvider(_UnimplementedScraper):
    name = "gametime"
    reason = "no public API; would require a (fragile) scraper"


class ViagogoProvider(_UnimplementedScraper):
    name = "viagogo"
    reason = "no public API; aggressive anti-bot, check ToS before scraping"
