"""Static checks for sounaks.com. Run: pytest -q _tests
(Folders starting with "_" are not published by GitHub Pages.)"""
import re
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


def icon_link(html, url, img, alt):
    pattern = (r'<a class="os-btn" href="' + re.escape(url) + r'"[^>]*>\s*'
               r'<img src="wpimages/' + re.escape(img) + r'"[^>]*alt="' + re.escape(alt) + '"')
    return re.search(pattern, html) is not None


@pytest.mark.parametrize("page", APPS)
def test_os_icons_download_release_files(page):
    repo, tag, msi, dmg, deb = APPS[page]
    html = read(page)
    base = f"{GH}/{repo}/releases/download/{tag}"
    assert icon_link(html, f"{base}/{msi}", "os-windows.png", "Windows")
    assert icon_link(html, f"{base}/{dmg}", "os-macos.png", "macOS")
    assert icon_link(html, f"{base}/{deb}", "os-linux.png", "Ubuntu")


@pytest.mark.parametrize("page", APPS)
def test_octocat_icon_links_repository(page):
    repo = APPS[page][0]
    html = read(page)
    assert icon_link(html, f"{GH}/{repo}", "os-github.png", "GitHub repository")
    assert "wp69df82fc_06.png" not in html and "os-icons-github.png" not in html


@pytest.mark.parametrize("page", APPS)
def test_os_icons_behave_like_buttons(page):
    html = read(page)
    assert ".os-btn:hover" in html


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


def test_os_icon_images_exist():
    for name in ("github", "windows", "linux", "macos"):
        assert (ROOT / "wpimages" / f"os-{name}.png").is_file()


# --- Content updates (2026-10-14) ---
def test_index_shows_latest_versions():
    html = read("index.html")
    for current in ("PlanetHour v2.0", "DeskStop v1.1", "IndianGold v5.0"):
        assert html.count(current) == 2, current
    for old in ("PlanetHour v1.0", "DeskStop v1.0", "IndianGold v3.0"):
        assert old not in html


def test_index_indiangold_news_links_indiangold_page():
    assert '<a href="indiangold.html" style="text-decoration:underline;">IndianGold v5.0 released!</a>' in read("index.html")


def test_contact_email():
    assert 'href="mailto:admin@sounaks.com"' in read("contact.html")
    for page in PAGES:
        assert "hotmail" not in read(page), page


def test_indiangold_heading_without_version():
    html = read("indiangold.html")
    assert 'src="wpimages/indiangold-heading.png"' in html
    assert 'alt="IndianGold v3.0"' not in html


def test_indiangold_sidebar_without_java_and_7zip():
    html = read("indiangold.html")
    assert "java.com" not in html and "7-zip.org" not in html
    assert 'src="wpimages/indiangold-sidebar.png"' in html


def test_planethour_intro_mentions_desktop():
    assert "app for desktop computers and feature phones" in read("planethour.html")


# --- Screenshot galleries open in a slideshow popup (2026-10-14) ---
GALLERY_COUNTS = {"indiangold.html": 3, "planethour.html": 6, "deskstop.html": 7}
THUMB_RE = re.compile(
    r'<a class="ss-thumb" href="(wpimages/[^"]+)" data-gallery="[a-z]+" data-caption="[^"]+">'
    r'<img src="(wpimages/[^"]+)"')


@pytest.mark.parametrize("page", GALLERY_COUNTS)
def test_gallery_uses_slideshow(page):
    html = read(page)
    thumbs = THUMB_RE.findall(html)
    assert len(thumbs) == GALLERY_COUNTS[page]
    for full, thumb in thumbs:
        assert (ROOT / full).is_file() and (ROOT / thumb).is_file(), (full, thumb)
    assert '<script type="text/javascript" src="wpscripts/slideshow.js"></script>' in html
    assert "wplightbox" not in html and 'rel="wplbox' not in html


def test_slideshow_script_handles_keys_and_autoplay():
    js = read("wpscripts/slideshow.js")
    for needle in ("ArrowLeft", "ArrowRight", "Escape", "setInterval", "ss-overlay", "touchstart"):
        assert needle in js, needle


def test_new_app_screenshots():
    ig, ph = read("indiangold.html"), read("planethour.html")
    for name in ("ig-main", "ig-settings-units", "ig-settings-rates"):
        assert f"wpimages/{name}.png" in ig
    for name in ("ph-expanded", "ph-compact", "ph-settings"):
        assert f"wpimages/{name}.png" in ph


def test_indiangold_new_features_current():
    html = read("indiangold.html")
    assert "New in v5.0:" in html
    assert "Provision to show / hide weight unit" not in html


OLD_SCRIPTS = ["jspngfix.js", "jsFlashVer.js", "jquery-3.7.1.js", "jquery.wplightbox.js", "blank.gif"]


@pytest.mark.parametrize("page", PAGES)
def test_no_obsolete_scripts(page):
    # IE5.5/6 PNG fix, Flash detection and jQuery (only the old lightbox used it) are gone.
    html = read(page)
    for name in OLD_SCRIPTS + ["OnLoadPngFix", "blankSrc"]:
        assert name not in html, name


def test_obsolete_script_files_removed():
    for name in OLD_SCRIPTS:
        assert not (ROOT / "wpscripts" / name).exists(), name


def test_favicon_files():
    import struct
    ico = (ROOT / "favicon.ico").read_bytes()
    reserved, kind, count = struct.unpack_from("<HHH", ico)
    assert (reserved, kind) == (0, 1)
    sizes = {ico[6 + 16 * i] for i in range(count)}
    assert {16, 32, 48} <= sizes
    png = (ROOT / "apple-touch-icon.png").read_bytes()
    assert png[:8] == b"\x89PNG\r\n\x1a\n" and struct.unpack(">II", png[16:24]) == (180, 180)


@pytest.mark.parametrize("page", PAGES)
def test_favicon_links(page):
    html = read(page)
    assert '<link rel="icon" href="favicon.ico" sizes="16x16 32x32 48x48">' in html
    assert '<link rel="apple-touch-icon" href="apple-touch-icon.png">' in html


def test_no_unused_dependabot_config():
    # The site has no package manifests, so Dependabot has nothing to update.
    assert not (ROOT / ".github" / "dependabot.yaml").exists()
