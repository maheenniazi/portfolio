"""Provider interface.

Every ticket source implements `Provider.search()`. Official-API providers
(SeatGeek, Ticketmaster) and future scraper-based providers all share this
contract, so the matcher and CLI never need to know how the data was obtained.
"""

from __future__ import annotations

from abc import ABC, abstractmethod

from ..models import TicketListing


class Provider(ABC):
    #: short machine name, e.g. "seatgeek"
    name: str = "base"

    #: whether the provider is ready to run (keys present, etc.)
    @property
    def available(self) -> bool:
        return True

    @abstractmethod
    def search(self, query: str, city: str | None = None) -> list[TicketListing]:
        """Return current listings matching `query` (and optionally `city`).

        Implementations should swallow their own transient network errors and
        return an empty list rather than raising, so one flaky source never
        takes down the whole sweep. Genuinely broken configuration (bad key)
        may raise during construction instead.
        """
        raise NotImplementedError


class ProviderError(RuntimeError):
    """Raised for configuration problems worth surfacing to the user."""
