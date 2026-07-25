"""Small dependency-free rate limiter suitable for the stateless demo API."""

from collections import defaultdict, deque
from time import monotonic

from fastapi import HTTPException

_requests: dict[str, deque[float]] = defaultdict(deque)


def enforce_rate_limit(client_id: str, limit: int = 30, window_seconds: int = 60) -> None:
    now = monotonic()
    attempts = _requests[client_id]
    while attempts and attempts[0] <= now - window_seconds:
        attempts.popleft()
    if len(attempts) >= limit:
        raise HTTPException(status_code=429, detail="Too many requests. Please try again in a minute.")
    attempts.append(now)
