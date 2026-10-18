"""SeatGeek provider — uses the official SeatGeek Platform API.

Docs: https://platform.seatgeek.com/
Requires a client id (and optional secret). Get one at
https://seatgeek.com/account/develop . The /events endpoint returns a
`stats.lowest_price` field that is exactly what we want.
"""

from __future__ import annotations

import os

import requests

from ..models import TicketListing
from .base import Provider

API_URL = "https://api.seatgeek.com/2/events"


class SeatGeekProvider(Provider):
    name = "seatgeek"

    def __init__(self, client_id: str | None = None, client_secret: str | None = None,
                 timeout: float = 10.0):
        self.client_id = client_id or os.getenv("SEATGEEK_CLIENT_ID")
        self.client_secret = client_secret or os.getenv("SEATGEEK_CLIENT_SECRET")
        self.timeout = timeout

    @property
    def available(self) -> bool:
        return bool(self.client_id)

    def search(self, query: str, city: str | None = None) -> list[TicketListing]:
        if not self.available:
            return []

        params = {
            "client_id": self.client_id,
            "q": query,
            "per_page": 25,
            "sort": "datetime_local.asc",
        }
        if self.client_secret:
            params["client_secret"] = self.client_secret
        if city:
            params["venue.city"] = city

        try:
            resp = requests.get(API_URL, params=params, timeout=self.timeout)
            resp.raise_for_status()
            payload = resp.json()
        except (requests.RequestException, ValueError):
            # Network blip or unparseable body — skip this source this round.
            return []

        listings: list[TicketListing] = []
        for event in payload.get("events", []):
            stats = event.get("stats") or {}
            price = stats.get("lowest_price")
            if price is None:
                continue  # no tickets currently listed
            venue = event.get("venue") or {}
            listings.append(
                TicketListing(
                    provider=self.name,
                    event_name=event.get("short_title") or event.get("title", ""),
                    venue=venue.get("name", ""),
                    city=venue.get("city", ""),
                    event_date=event.get("datetime_local"),
                    price=float(price),
                    currency="USD",
                    url=event.get("url"),
                )
            )
        return listings
