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


# --- Download links point at GitHub releases (2026-10-14) ---
GH = "https://github.com/sounak3"
APPS = {
    "deskstop.html": ("desktime", "1.1", "DeskStop-1.1.msi", "DeskStop-1.1.dmg", "deskstop_1.1-release_amd64.deb"),
    "indiangold.html": ("indiangold", "5.0", "IndianGold-5.0.msi", "IndianGold-5.0.dmg", "indiangold_5.0-release_amd64.deb"),
    "planethour.html": ("planethour", "v2.0", "PlanetHour-2.0.msi", "PlanetHour-2.0.dmg", "planethour_2.0-release_amd64.deb"),
}
LICENSES = {
    "deskstop.html": f"{GH}/desktime/blob/main/LICENSE.md",
    "indiangold.html": f"{GH}/indiangold/blob/master/LICENSE.md",
    "planethour.html": f"{GH}/planethour/blob/main/LICENSE",
}


@pytest.mark.parametrize("page", APPS)
def test_download_button_opens_latest_release(page):
    repo = APPS[page][0]
    assert f'href="{GH}/{repo}/releases/latest"' in read(page)


@pytest.mark.parametrize("page", APPS)
def test_os_icons_download_release_files(page):
    repo, tag, msi, dmg, deb = APPS[page]
    html = read(page)
    for name, alt in ((msi, "Windows"), (dmg, "macOS"), (deb, "Ubuntu")):
        assert f'href="{GH}/{repo}/releases/download/{tag}/{name}" alt="{alt}"' in html


@pytest.mark.parametrize("page", APPS)
def test_octocat_icon_links_repository(page):
    repo = APPS[page][0]
    html = read(page)
    assert f'href="{GH}/{repo}" alt="GitHub repository"' in html
    assert "wpimages/os-icons-github.png" in html
    assert "wpimages/wp69df82fc_06.png" not in html


@pytest.mark.parametrize("page", APPS)
def test_license_link_points_at_repo(page):
    assert f'href="{LICENSES[page]}"' in read(page)


def test_indiangold_no_old_zip_or_java_requirement():
    html = read("indiangold.html")
    for old in ("sw/IndianGold_v3.0.zip", "sw/IndianGoldv3_source_files.zip", "Java Runtime Environment 1.4"):
        assert old not in html


def test_indiangold_source_button_opens_repository():
    assert f'<a href="{GH}/indiangold" id="btn_5"' in read("indiangold.html")


def test_planethour_keeps_phone_downloads():
    html = read("planethour.html")
    assert 'href="sw/planethour.jar"' in html
    assert 'href="sw/planethour_mini.jar"' in html
    assert "PlanetHour v2.0 for Desktop" in html


def test_os_icon_image_exists():
    assert (ROOT / "wpimages" / "os-icons-github.png").is_file()
