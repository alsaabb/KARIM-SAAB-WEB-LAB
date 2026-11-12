#!/usr/bin/env python3
"""Browser-only visual and interaction review of the unpublished After Sixty branch.

Serves the checked-out repository locally; no external deployment.
Captures 4 screenshots and reports layout measurements.
"""
import json
import pathlib
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT / "visual-review" / "after-sixty"
OUT.mkdir(parents=True,exist_ok=True)
HOST="http://127.0.0.1:8765/dist/index.html"
REPORT={}
server=subprocess.Popen(
    ["python3","-m","http.server","8765","--bind","127.0.0.1"],
    cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL
)
try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
        for name,width,height in [("desktop",1440,900),("mobile",390,844)]:
            page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1,
                                     locale="ar-SA",reduced_motion="reduce")
            errors=[]
            page.on("pageerror",lambda e: errors.append(str(e)))
            page.goto(HOST+"#/ar/about/after-sixty",wait_until="domcontentloaded",timeout=30000)
            page.locator(".ks60-grid .ks60-card").first.wait_for(timeout=20000)
            assert page.locator(".ks60-grid .ks60-card").count()==1,"Expected one approved episode"
            assert "الحياة بعد الستين" in page.locator(".ks60 h1").inner_text()
            assert page.locator("#ks60-results").inner_text().strip().endswith("1")
            cols=page.locator(".ks60-grid").evaluate("(el)=>getComputedStyle(el).gridTemplateColumns.split(' ').length")
            assert cols==(3 if name=="desktop" else 1),f"Bad {name} columns: {cols}"
            page.screenshot(path=str(OUT/f"{name}-library.png"),full_page=True)
            page.locator("#ks60-find").fill("غير موجود")
            assert page.locator(".ks60-card:visible").count()==0,"Search filtering broken"
            page.locator("#ks60-find").fill("")
            assert page.locator(".ks60-card:visible").count()==1,"Search reset broken"
            page.locator(".ks60-card").click()
            page.locator("#ks60-article-pane").wait_for(timeout=20000)
            assert "السعادة قرار ينبع من داخلك" in page.locator("#ks60-article-pane").inner_text()
            assert "الخلاصة: اترك أثراً قبل أن تغادر" in page.locator("#ks60-article-pane").inner_text()
            assert "#مغامرات_عبدالكريم_الصعب" in page.locator("#ks60-article-pane").inner_text()
            assert page.locator("#ks60-video-pane [data-chapter-target]").count()==3
            assert page.locator("#ks60-article-pane [data-seek]").count()==3
            assert page.locator('[data-source="drive"]').is_disabled(),"Unverified Drive fallback activated"
            video=page.locator("#ks60-video-pane").bounding_box()
            article=page.locator("#ks60-article-pane").bounding_box()
            if name=="desktop":
                assert abs((video["width"]/(video["width"]+article["width"]))-.4)<.05,"Desktop 40/60 split incorrect"
                assert page.locator("#ks60-video-pane").evaluate("(el)=>getComputedStyle(el).position")=="sticky"
                assert page.locator("#ks60-article-pane").is_visible()
                page.screenshot(path=str(OUT/f"{name}-episode.png"),full_page=True)
            else:
                assert page.locator('[data-view="video"]').is_visible()
                assert not page.locator("#ks60-article-pane").is_visible(),"Article should be tab-hidden first"
                page.locator('[data-view="article"]').click()
                assert page.locator("#ks60-article-pane").is_visible()
                assert not page.locator("#ks60-video-pane").is_visible()
                page.screenshot(path=str(OUT/f"{name}-episode-article.png"),full_page=True)
                page.locator("#ks60-article-pane [data-seek]").first.click()
                assert page.locator("#ks60-video-pane").is_visible(),"Timestamp did not switch to video"
                assert "start=58" in page.locator("#ks60-frame").get_attribute("src")
                page.screenshot(path=str(OUT/f"{name}-episode-video.png"),full_page=True)
            REPORT[name]={"columns":cols,"video_width":round(video["width"]),"article_width":round(article["width"]),
                          "headings":page.locator(".ks60 h1").all_text_contents(),
                          "page_errors":errors[:8]}
            page.close()
        browser.close()
    (OUT/"report.json").write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(REPORT,ensure_ascii=False,indent=2))
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
