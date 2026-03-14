"""
UNSW Handbook scraper — extracts Course Description and Learning Outcomes
for a fixed list of units by parsing the __NEXT_DATA__ JSON blob embedded
in each handbook page (Next.js SSR).

Usage:
    pip install httpx beautifulsoup4
    python scrape_unsw_units.py
Output:
    unsw_units_raw.json  (written next to this script)
"""

import json
import re
import time
from pathlib import Path

import httpx
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

YEAR = "2026"

# (course_code, study_level)
# The scraper will try the specified level first, then fallback to the other if 404.
UNITS: list[tuple[str, str]] = [
    # 1000 level
    ("COMP1511", "undergraduate"),
    ("COMP1521", "undergraduate"),
    ("COMP1531", "undergraduate"),
    ("COMP1010", "undergraduate"),
    ("COMP1337", "undergraduate"),
    ("COMP1911", "undergraduate"),
    ("MATH1081", "undergraduate"),
    
    # 2000 level
    ("COMP2511", "undergraduate"),
    ("COMP2521", "undergraduate"),
    ("COMP2041", "undergraduate"),
    ("COMP2111", "undergraduate"),
    ("COMP2121", "undergraduate"),
    ("DESN2000", "undergraduate"),

    # 3000 level & above
    ("COMP3121", "undergraduate"),
    ("COMP3311", "undergraduate"),
    ("COMP3331", "undergraduate"),
    ("COMP3411", "undergraduate"),
    ("COMP3900", "undergraduate"),
    ("COMP6080", "undergraduate"),
    
    # Postgraduate / Mixed
    ("COMP9021", "postgraduate"),
    ("COMP9311", "postgraduate"),
    ("COMP9313", "postgraduate"),
    ("COMP9331", "postgraduate"),
    ("COMP9414", "postgraduate"),
]

HANDBOOK_BASE = "https://www.handbook.unsw.edu.au"
OUTPUT_FILE = Path(__file__).parent / "unsw_units_raw.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-AU,en;q=0.9",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def build_url(code: str, level: str) -> str:
    return f"{HANDBOOK_BASE}/{level}/courses/{YEAR}/{code}"


def strip_html(raw: str) -> str:
    """Remove HTML tags and collapse whitespace."""
    if not raw or not isinstance(raw, str):
        return ""
    text = BeautifulSoup(raw, "html.parser").get_text(separator=" ")
    return re.sub(r"\s+", " ", text).strip()


def extract_next_data(html: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    tag = soup.find("script", {"id": "__NEXT_DATA__"})
    if not tag:
        return {}
    try:
        return json.loads(tag.string)
    except (json.JSONDecodeError, TypeError):
        return {}


def parse_page_content(pc: dict) -> dict:
    """Extract structured fields from the pageContent dict."""
    # Description: HTML string at pc["description"]
    description = strip_html(pc.get("description") or pc.get("overview") or "")

    # Learning outcomes: list of dicts at pc["unit_learning_outcomes"]
    raw_outcomes: list[dict] = pc.get("unit_learning_outcomes") or []
    learning_outcomes = [
        strip_html(item.get("description", ""))
        for item in raw_outcomes
        if item.get("description")
    ]

    return {
        "code": pc.get("code") or pc.get("cl_code", ""),
        "title": pc.get("title", ""),
        "credit_points": pc.get("credit_points", ""),
        "school": (pc.get("academic_org") or {}).get("value", ""),
        "faculty": (
            (pc.get("faculty_detail") or [{}])[0]
            .get("description", "")
        ),
        "description": description,
        "learning_outcomes": learning_outcomes,
    }


def scrape_unit(client: httpx.Client, code: str, level: str) -> dict:
    url = build_url(code, level)
    print(f"  GET {url}")

    try:
        resp = client.get(url, follow_redirects=True, timeout=20)
    except httpx.RequestError as exc:
        return {"code": code, "url": url, "level": level, "error": str(exc)}

    # Automatic level fallback on 404
    if resp.status_code == 404:
        alt_level = "postgraduate" if level == "undergraduate" else "undergraduate"
        print(f"  → 404, retrying as {alt_level} …")
        url = build_url(code, alt_level)
        print(f"  GET {url}")
        try:
            resp = client.get(url, follow_redirects=True, timeout=20)
            if resp.status_code == 200:
                level = alt_level
        except httpx.RequestError as exc:
            return {"code": code, "url": url, "level": level, "error": str(exc)}

    if resp.status_code != 200:
        return {"code": code, "url": url, "level": level, "error": f"HTTP {resp.status_code}"}

    data = extract_next_data(resp.text)
    if not data:
        return {"code": code, "url": url, "level": level, "error": "No __NEXT_DATA__ found"}

    pc = data.get("props", {}).get("pageProps", {}).get("pageContent", {})
    if not pc:
        return {"code": code, "url": url, "level": level, "error": "pageContent missing"}

    result = parse_page_content(pc)
    result["url"] = url
    result["level"] = level
    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    results = []

    with httpx.Client(headers=HEADERS) as client:
        for i, (code, level) in enumerate(UNITS):
            print(f"[{i+1}/{len(UNITS)}] {code}")
            result = scrape_unit(client, code, level)
            results.append(result)
            if i < len(UNITS) - 1:
                time.sleep(1.5)

    OUTPUT_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    print(f"\nSaved {len(results)} units → {OUTPUT_FILE}")

    ok = [r for r in results if "error" not in r]
    errors = [r for r in results if "error" in r]
    print(f"  Success: {len(ok)}  |  Errors: {len(errors)}")
    for r in errors:
        print(f"    ✗ {r['code']}: {r['error']}")


if __name__ == "__main__":
    main()
