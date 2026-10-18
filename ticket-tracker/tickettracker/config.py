"""Load watches from YAML and build the set of active providers."""

from __future__ import annotations

import os
from pathlib import Path

from .models import Watch
from .providers import (
    DemoProvider,
    GametimeProvider,
    Provider,
    SeatGeekProvider,
    StubHubProvider,
    TicketmasterProvider,
    ViagogoProvider,
)

# Registry of every provider the bot knows about. Order is the sweep order.
_REGISTRY: dict[str, type[Provider]] = {
    "seatgeek": SeatGeekProvider,
    "ticketmaster": TicketmasterProvider,
    "stubhub": StubHubProvider,
    "gametime": GametimeProvider,
    "viagogo": ViagogoProvider,
    "demo": DemoProvider,
}


def load_watches(path: str | Path) -> list[Watch]:
    """Parse a watchlist YAML file into Watch objects."""
    import yaml  # imported lazily so --help works without PyYAML installed

    data = yaml.safe_load(Path(path).read_text()) or {}
    watches = []
    for raw in data.get("watches", []):
        watches.append(
            Watch(
                name=raw["name"],
                query=raw["query"],
                max_price=float(raw["max_price"]),
                city=raw.get("city"),
                currency=raw.get("currency", "USD"),
                providers=raw.get("providers"),
            )
        )
    if not watches:
        raise ValueError(f"No watches found in {path}")
    return watches


def build_providers(names: list[str] | None = None,
                    demo: bool = False) -> list[Provider]:
    """Instantiate providers.

    * `demo=True` returns only the offline DemoProvider (no keys needed).
    * `names` restricts to a subset; otherwise every registered provider is
      built and the unavailable ones (missing keys / stubs) are filtered out
      by the caller via `Provider.available`.
    """
    if demo:
        return [DemoProvider()]

    chosen = names or [n for n in _REGISTRY if n != "demo"]
    providers: list[Provider] = []
    for name in chosen:
        cls = _REGISTRY.get(name)
        if cls is None:
            raise ValueError(f"Unknown provider: {name!r}")
        providers.append(cls())
    return providers


def load_dotenv_if_present(path: str | Path = ".env") -> None:
    """Minimal .env loader (so API keys work without extra dependencies)."""
    p = Path(path)
    if not p.exists():
        return
    for line in p.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
