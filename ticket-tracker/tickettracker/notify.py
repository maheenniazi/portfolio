"""Notifications: always print to the terminal, optionally raise a native
desktop notification. No third-party dependency — we shell out to whatever
the OS provides (notify-send / osascript / PowerShell) and degrade silently
to terminal-only if none is available.
"""

from __future__ import annotations

import shutil
import subprocess
import sys

from .models import TicketListing

# ANSI colours, disabled when output isn't a TTY (e.g. piped to a file).
_TTY = sys.stdout.isatty()
_GREEN = "\033[32m" if _TTY else ""
_BOLD = "\033[1m" if _TTY else ""
_DIM = "\033[2m" if _TTY else ""
_RESET = "\033[0m" if _TTY else ""


def _format(watch_name: str, listing: TicketListing, prev_low: float | None) -> str:
    drop = ""
    if prev_low is not None and listing.price < prev_low:
        drop = f" (was ${prev_low:,.2f})"
    cur = listing.currency
    return (
        f"{_GREEN}{_BOLD}🎟  PRICE ALERT · {watch_name}{_RESET}\n"
        f"   {listing.describe()}\n"
        f"   {_BOLD}{cur} {listing.price:,.2f}{_RESET}{drop}"
        f"  via {listing.provider}\n"
        f"   {_DIM}{listing.url or ''}{_RESET}"
    )


def notify(watch_name: str, listing: TicketListing, prev_low: float | None = None,
           desktop: bool = True) -> None:
    """Emit an alert to the terminal and (optionally) the desktop."""
    print(_format(watch_name, listing, prev_low))
    if desktop:
        _desktop(
            title=f"🎟 {watch_name}: {listing.currency} {listing.price:,.0f}",
            body=listing.describe(),
        )


def info(msg: str) -> None:
    print(f"{_DIM}{msg}{_RESET}")


def _desktop(title: str, body: str) -> None:
    """Best-effort native notification; never raises."""
    try:
        if sys.platform == "darwin":
            # macOS via AppleScript.
            script = f'display notification {body!r} with title {title!r}'
            subprocess.run(["osascript", "-e", script], check=False,
                           capture_output=True, timeout=5)
        elif sys.platform.startswith("linux") and shutil.which("notify-send"):
            subprocess.run(["notify-send", title, body], check=False,
                           capture_output=True, timeout=5)
        elif sys.platform.startswith("win"):
            # Windows toast via PowerShell BurntToast-free balloon.
            ps = (
                "[reflection.assembly]::loadwithpartialname('System.Windows.Forms')"
                ">$null;"
                "$n=New-Object System.Windows.Forms.NotifyIcon;"
                "$n.Icon=[System.Drawing.SystemIcons]::Information;"
                "$n.Visible=$true;"
                f"$n.ShowBalloonTip(5000,{title!r},{body!r},"
                "[System.Windows.Forms.ToolTipIcon]::Info)"
            )
            subprocess.run(["powershell", "-NoProfile", "-Command", ps],
                           check=False, capture_output=True, timeout=5)
    except Exception:
        # Desktop notifications are a nice-to-have; terminal output already
        # carried the alert, so swallow any platform quirk.
        pass
