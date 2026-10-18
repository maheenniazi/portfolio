"""Ticketmaster provider — uses the official Discovery API.

Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
Free API key from https://developer.ticketmaster.com/ . Note this is largely
primary/face-value inventory; resale coverage is limited, which is a known
constraint of the official API (see the project README).
"""

from __future__ import annotations

import os

import requests

from ..models import TicketListing
from .base import Provider

API_URL = "https://app.ticketmaster.com/discovery/v2/events.json"


class TicketmasterProvider(Provider):
    name = "ticketmaster"

    def __init__(self, api_key: str | None = None, timeout: float = 10.0):
        self.api_key = api_key or os.getenv("TICKETMASTER_API_KEY")
        self.timeout = timeout

    @property
    def available(self) -> bool:
        return bool(self.api_key)

    def search(self, query: str, city: str | None = None) -> list[TicketListing]:
        if not self.available:
            return []

        params = {
            "apikey": self.api_key,
            "keyword": query,
            "size": 25,
            "sort": "date,asc",
            "classificationName": "music",
        }
        if city:
            params["city"] = city

        try:
            resp = requests.get(API_URL, params=params, timeout=self.timeout)
            resp.raise_for_status()
            payload = resp.json()
        except (requests.RequestException, ValueError):
            return []

        events = (payload.get("_embedded") or {}).get("events", [])
        listings: list[TicketListing] = []
        for event in events:
            price = _lowest_price(event)
            if price is None:
                continue
            venue = _first_venue(event)
            dates = (event.get("dates") or {}).get("start") or {}
            listings.append(
                TicketListing(
                    provider=self.name,
                    event_name=event.get("name", ""),
                    venue=venue.get("name", ""),
                    city=((venue.get("city") or {}).get("name", "")),
                    event_date=dates.get("dateTime") or dates.get("localDate"),
                    price=price,
                    currency=_currency(event),
                    url=event.get("url"),
                )
            )
        return listings


def _lowest_price(event: dict) -> float | None:
    ranges = event.get("priceRanges") or []
    mins = [r.get("min") for r in ranges if r.get("min") is not None]
    return float(min(mins)) if mins else None


def _currency(event: dict) -> str:
    ranges = event.get("priceRanges") or []
    for r in ranges:
        if r.get("currency"):
            return r["currency"]
    return "USD"


def _first_venue(event: dict) -> dict:
    venues = (event.get("_embedded") or {}).get("venues") or []
    return venues[0] if venues else {}
