"""The sweep: query every provider for every watch, record prices, alert."""

from __future__ import annotations

from dataclasses import dataclass

from . import notify
from .models import TicketListing, Watch
from .providers import Provider
from .store import Store


@dataclass
class SweepResult:
    listings_seen: int = 0
    alerts_fired: int = 0


def run_sweep(watches: list[Watch], providers: list[Provider], store: Store,
              desktop: bool = True, verbose: bool = False) -> SweepResult:
    """One full pass over all watches × all available providers."""
    active = [p for p in providers if p.available]
    skipped = [p for p in providers if not p.available]
    for p in skipped:
        reason = getattr(p, "reason", "not configured")
        notify.info(f"  · skipping {p.name} ({reason})")

    result = SweepResult()
    seen_fp: set[str] = set()  # avoid double-recording the same event this pass

    for watch in watches:
        for provider in active:
            if watch.providers and provider.name not in watch.providers:
                continue
            for listing in provider.search(watch.query, watch.city):
                result.listings_seen += 1

                # Record price history once per event per sweep.
                if listing.fingerprint not in seen_fp:
                    store.record(listing)
                    seen_fp.add(listing.fingerprint)

                if verbose:
                    notify.info(
                        f"  {listing.provider}: {listing.event_name} "
                        f"— {listing.currency} {listing.price:,.2f}"
                    )

                if not watch.matches(listing):
                    continue
                if not store.should_alert(watch.name, listing):
                    continue

                prev_low = store.lowest_seen(listing.fingerprint)
                notify.notify(watch.name, listing, prev_low=prev_low,
                              desktop=desktop)
                store.mark_alerted(watch.name, listing)
                result.alerts_fired += 1

    return result
