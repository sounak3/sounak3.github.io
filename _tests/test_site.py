"""Static checks for sounaks.com. Run: pytest -q _tests
(Folders starting with "_" are not published by GitHub Pages.)"""
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
CLIENT = "ca-pub-4004723948464629"
ADS_LINE = "google.com, pub-4004723948464629, DIRECT, f08c47fec0942fa0"
PAGES = sorted(p.name for p in ROOT.glob("*.html"))
# Pages built from the WebPlus layout carry the shared footer; buddha.html is a plain page.
FOOTER_PAGES = [p for p in PAGES if p != "buddha.html"]


def read(name):
    return (ROOT / name).read_text(encoding="utf-8", errors="replace")


def test_privacy_page_exists():
    assert "privacy.html" in PAGES


@pytest.mark.parametrize("page", PAGES)
def test_adsense_meta_and_script(page):
    html = read(page)
    assert f'<meta name="google-adsense-account" content="{CLIENT}">' in html
    assert f"adsbygoogle.js?client={CLIENT}" in html


@pytest.mark.parametrize("page", FOOTER_PAGES)
def test_viewport_fits_fixed_layout(page):
    # WebPlus pages are absolutely positioned at 1000px: let phones zoom to fit.
    assert '<meta name="viewport" content="width=1000">' in read(page)


def test_viewport_plain_page_reflows():
    assert '<meta name="viewport" content="width=device-width, initial-scale=1">' in read("buddha.html")


@pytest.mark.parametrize("page", FOOTER_PAGES)
def test_footer_year_and_privacy_link(page):
    html = read(page)
    assert "&#169; 2026 Sounak Choudhury" in html
    assert 'href="privacy.html"' in html


@pytest.mark.parametrize("page", PAGES)
def test_no_stale_copyright(page):
    assert "2024 Sounak" not in read(page)


def test_ads_txt():
    assert read("ads.txt").strip() == ADS_LINE


def test_robots_allows_crawlers():
    lines = [l.strip() for l in read("robots.txt").splitlines()]
    assert "Disallow: /" not in lines
    assert "User-agent: *" in lines


def test_privacy_covers_ads_and_facebook():
    html = read("privacy.html")
    for phrase in ("Google AdSense", "Facebook", "policies.google.com/technologies/partner-sites"):
        assert phrase in html
