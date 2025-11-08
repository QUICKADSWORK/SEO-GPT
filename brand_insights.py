"""
Brand insights helpers

Provides utilities to derive a brand's Instagram display name using
the Google Gemini API and to fetch ad count data from BrandBooster.
"""

from __future__ import annotations

import logging
import os
import re
from functools import lru_cache
from typing import Any, Dict, Optional

import requests

DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL_NAME", "gemini-1.5-flash")


class BrandInsightsError(Exception):
    """Base exception for brand insights helpers."""


def _clean_display_name(raw_text: str) -> Optional[str]:
    if not raw_text:
        return None

    text = raw_text.strip()
    # Use first line only to avoid extra commentary.
    text = text.splitlines()[0].strip()

    if not text or text.upper() == "UNKNOWN":
        return None

    # Remove leading @ or quotes.
    text = re.sub(r'^["\'@#\s]+', "", text)
    text = re.sub(r'["\']+$', "", text).strip()

    # Reject if the answer contains obvious uncertainty phrases.
    uncertainty_markers = [
        "not sure",
        "i am not sure",
        "cannot determine",
        "unknown",
        "no official",
        "unsure",
        "n/a",
    ]
    lowered = text.lower()
    if any(marker in lowered for marker in uncertainty_markers):
        return None

    # Very short names (single character) are unlikely to be valid.
    if len(text) < 2:
        return None

    return text


def _post_gemini_request(prompt: str, api_key: str, model: str = DEFAULT_GEMINI_MODEL) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {
                        "text": prompt,
                    }
                ],
            }
        ],
        "safety_settings": [
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUAL_CONTENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        ],
    }
    response = requests.post(url, params={"key": api_key}, json=payload, timeout=20)
    response.raise_for_status()
    return response.json()


def _extract_text_from_gemini_response(response: Dict[str, Any]) -> Optional[str]:
    if not isinstance(response, dict):
        return None

    candidates = response.get("candidates") or []
    for candidate in candidates:
        content = candidate.get("content") or {}
        parts = content.get("parts") or []
        for part in parts:
            text = part.get("text")
            if text:
                return text
    return None


@lru_cache(maxsize=128)
def get_instagram_display_name(domain: str, api_key: Optional[str] = None) -> Optional[str]:
    """
    Infer the Instagram display name for a brand based on its domain.

    Args:
        domain: Website domain e.g. "nike.com"
        api_key: Gemini API key. Falls back to GEMINI_API_KEY env variable.
    """
    domain = (domain or "").strip()
    if not domain:
        return None

    resolved_api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not resolved_api_key:
        raise BrandInsightsError("Gemini API key is not configured.")

    prompt = (
        "You are a data enrichment assistant. "
        "Given a company's primary website domain, respond with the brand name as it appears on Instagram. "
        "Return only the display name text without the @ symbol, hashtags, quotes, or commentary. "
        "If you cannot determine it confidently, respond with UNKNOWN.\n"
        f"Domain: {domain}"
    )

    try:
        response = _post_gemini_request(prompt, resolved_api_key)
    except requests.HTTPError as exc:
        logging.exception("Gemini API HTTP error for domain %s: %s", domain, exc)
        raise BrandInsightsError(f"Gemini API error: {exc.response.text.strip() if exc.response else exc}") from exc
    except requests.RequestException as exc:
        logging.exception("Gemini API request error for domain %s: %s", domain, exc)
        raise BrandInsightsError(f"Gemini API request failed: {exc}") from exc

    text = _extract_text_from_gemini_response(response)
    return _clean_display_name(text or "")


def _find_first_key(data: Dict[str, Any], keys: tuple[str, ...]) -> Optional[Any]:
    for key in keys:
        if key in data and data[key] is not None:
            return data[key]
    return None


@lru_cache(maxsize=256)
def fetch_brandbooster_counts(brand_name: str, timeout: int = 20) -> Optional[Dict[str, Optional[int]]]:
    """
    Fetch ad counts from BrandBooster for the given brand name.

    Args:
        brand_name: Instagram display/brand name, e.g. "Nike"
        timeout: Request timeout in seconds.
    """
    brand_name = (brand_name or "").strip()
    if not brand_name:
        return None

    url = "https://api.brandbooster.ai/api/v1/research/brand-ads-count-public"
    try:
        response = requests.get(url, params={"brand_name": brand_name}, timeout=timeout)
        if response.status_code == 404:
            return None
        response.raise_for_status()
    except requests.HTTPError as exc:
        logging.exception("BrandBooster HTTP error for %s: %s", brand_name, exc)
        raise BrandInsightsError(f"BrandBooster API error: {exc.response.text.strip() if exc.response else exc}") from exc
    except requests.RequestException as exc:
        logging.exception("BrandBooster request error for %s: %s", brand_name, exc)
        raise BrandInsightsError(f"BrandBooster API request failed: {exc}") from exc

    data = response.json() or {}

    # Some responses wrap payloads in a "data" key.
    if isinstance(data, dict) and "data" in data and isinstance(data["data"], dict):
        data = data["data"]

    total = _find_first_key(
        data,
        ("total_ads_count", "total_ads", "total", "total_ad_count"),
    )
    active = _find_first_key(
        data,
        ("active_ads_count", "active_ads", "active", "active_ad_count"),
    )
    inactive = _find_first_key(
        data,
        ("inactive_ads_count", "inactive_ads", "inactive", "inactive_ad_count"),
    )

    def _to_int(value: Any) -> Optional[int]:
        if value is None or value == "":
            return None
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return None

    return {
        "total": _to_int(total),
        "active": _to_int(active),
        "inactive": _to_int(inactive),
    }


def get_brand_insights(domain: str, api_key: Optional[str] = None) -> Dict[str, Optional[Any]]:
    """
    Resolve Instagram display name and BrandBooster counts for a domain.

    Returns:
        Dictionary with keys `instagram_display_name` and `ad_counts`.
    """
    display_name = None
    ad_counts = None

    try:
        display_name = get_instagram_display_name(domain, api_key=api_key)
        if display_name:
            ad_counts = fetch_brandbooster_counts(display_name)
    except BrandInsightsError as exc:
        logging.warning("Brand insight lookup failed for %s: %s", domain, exc)
    except Exception as exc:  # noqa: BLE001
        logging.exception("Unexpected error resolving brand insights for %s", domain)

    return {
        "instagram_display_name": display_name,
        "ad_counts": ad_counts,
    }

