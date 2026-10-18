"""Unit tests for the matching + storage logic (no network required)."""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from tickettracker.matcher import run_sweep          # noqa: E402
from tickettracker.models import TicketListing, Watch  # noqa: E402
from tickettracker.providers.demo import DemoProvider  # noqa: E402
from tickettracker.store import Store                 # noqa: E402


def _listing(price, event="Coldplay: Music of the Spheres", city="Los Angeles"):
    return TicketListing(
        provider="demo", event_name=event, venue="SoFi Stadium",
        city=city, event_date="2026-07-15", price=price,
    )


def test_watch_matches_on_price_and_city():
    w = Watch(name="t", query="Coldplay", max_price=150, city="Los Angeles")
    assert w.matches(_listing(140))
    assert not w.matches(_listing(160))              # over budget
    assert not w.matches(_listing(100, city="Seattle"))  # wrong city


def test_watch_requires_all_query_terms():
    w = Watch(name="t", query="Taylor Swift", max_price=1000)
    assert w.matches(_listing(100, event="Taylor Swift Eras Tour"))
    assert not w.matches(_listing(100, event="Coldplay"))


def test_fingerprint_is_stable_across_price_changes():
    assert _listing(100).fingerprint == _listing(200).fingerprint


def test_should_alert_only_on_new_lows(tmp_path):
    store = Store(tmp_path / "t.db")
    w, lst = "watch", _listing(140)

    assert store.should_alert(w, lst) is True        # never alerted → yes
    store.mark_alerted(w, lst)
    assert store.should_alert(w, _listing(140)) is False  # same price → no
    assert store.should_alert(w, _listing(120)) is True   # new low → yes


def test_sweep_fires_alert_and_records_history(tmp_path):
    store = Store(tmp_path / "t.db")
    watches = [Watch(name="Coldplay", query="Coldplay", max_price=1000,
                     city="Los Angeles")]
    providers = [DemoProvider(seed=1)]  # deterministic prices

    result = run_sweep(watches, providers, store, desktop=False)
    assert result.listings_seen >= 1
    assert result.alerts_fired == 1                  # first match alerts once

    # Second identical sweep should not re-alert (price not a new low).
    result2 = run_sweep(watches, providers, store, desktop=False)
    assert result2.alerts_fired == 0


if __name__ == "__main__":
    import tempfile
    from pathlib import Path

    # Tiny runner so the suite works even without pytest installed.
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            if "tmp_path" in fn.__code__.co_varnames:
                with tempfile.TemporaryDirectory() as d:
                    fn(Path(d))
            else:
                fn()
            print(f"PASS {name}")
        except AssertionError as e:
            failures += 1
            print(f"FAIL {name}: {e}")
    sys.exit(1 if failures else 0)
