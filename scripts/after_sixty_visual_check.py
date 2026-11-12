#!/usr/bin/env python3
"""After Sixty V1.1 — isolated responsive browser review (never deployed).
Saves desktop/mobile screenshots plus functional and layout measurements.
"""
import json
import pathlib
import subprocess
from playwright.sync_api import sync_playwright

ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/"visual-review"/"after-sixty"
OUT.mkdir(parents=True,exist_ok=True)
HOST="http://127.0.0.1:8765/dist/index.html"
REPORT={}
server=subprocess.Popen(["python3","-m","http.server","8765","--bind","127.0.0.1"],
                        cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
        for name,width,height in [("desktop",1440,900),("mobile",390,844)]:
            page=browser.new_page(viewport={"width":width,"height":height},device_scale_factor=1,
                                  locale="ar-SA",reduced_motion="reduce")
            errors=[]
            page.on("pageerror",lambda e: errors.append(str(e)))
            page.goto(HOST+"#/ar/about/after-sixty",wait_until="domcontentloaded",timeout=30000)
            card=page.locator(".ks60-grid .ks60-card").first
            card.wait_for(timeout=20000)
            assert page.locator(".ks60-grid .ks60-card").count()==1,"Expected the first episode"
            assert page.locator("#ks60-results").inner_text().strip().endswith("1")
            cols=page.locator(".ks60-grid").evaluate(
                "(el)=>getComputedStyle(el).gridTemplateColumns.split(' ').length"
            )
            assert cols==(3 if name=="desktop" else 1),f"Bad {name} grid: {cols}"
            page.screenshot(path=str(OUT/f"{name}-library.png"),full_page=True)
            page.locator("#ks60-find").fill("قيمة بحث غير موجودة")
            assert page.locator(".ks60-card:visible").count()==0,"Search filtering broken"
            page.locator("#ks60-find").fill("")
            assert page.locator(".ks60-card:visible").count()==1,"Search reset broken"
            card.click()
            article=page.locator("#ks60-article-pane")
            article.wait_for(state="visible",timeout=20000)
            video=page.locator("#ks60-video-pane")
            player=page.locator("#ks60-player")
            poster=page.locator(".ks60-poster")
            assert poster.is_visible(),"YouTube poster missing at initial render"
            fallback=page.locator(".ks60-external-watch a")
            assert fallback.count()==1, "External watch fallback missing"
            assert fallback.get_attribute("href")=="https://www.youtube.com/watch?v=0YT1QXZT6mI"
            assert fallback.get_attribute("target")=="_blank"
            assert poster.locator(".ks60-poster-play").is_visible(),"Gold play button missing"
            assert poster.locator(".ks60-poster-image").get_attribute("src").endswith("/maxresdefault.jpg")
            assert page.locator("#ks60-frame").count()==0,"YouTube should load only on play"
            assert player.get_attribute("data-orientation")=="vertical","Short portrait format missing"
            assert abs((player.bounding_box()["width"]/player.bounding_box()["height"])-(9/16))<.02
            assert page.locator('[data-source="drive"]').is_disabled(),"Unverified Drive source enabled"
            assert article.evaluate("(el)=>getComputedStyle(el).backgroundColor")=="rgb(249, 248, 246)"
            assert article.evaluate("(el)=>getComputedStyle(el).color")=="rgb(26, 26, 26)"
            assert "السعادة قرار ينبع من داخلك" in article.inner_text()
            assert "الخلاصة: اترك أثراً قبل أن تغادر" in article.inner_text()
            assert "#مغامرات_عبدالكريم_الصعب" in article.inner_text()
            assert page.locator("#ks60-video-pane [data-chapter-target]").count()==3
            assert article.locator("[data-seek]").count()==3
            video_box=video.bounding_box()
            article_box=article.bounding_box()
            source_box=page.locator(".ks60-source-controls").bounding_box()
            player_box=player.bounding_box()
            assert source_box["y"]>=player_box["y"]+player_box["height"]-1,"Source controls must follow video"
            if name=="desktop":
                ratio=video_box["width"]/(video_box["width"]+article_box["width"])
                assert abs(ratio-.4)<.05,f"Desktop split not 40/60: {ratio}"
                assert video.evaluate("(el)=>getComputedStyle(el).position")=="sticky"
                assert page.locator(".ks60-chapters").get_attribute("open") is not None
            else:
                assert article.is_visible(),"Mobile article hidden behind a tab"
                assert video.is_visible(),"Mobile video hidden behind a tab"
                assert page.locator(".ks60-mobile-switch:visible").count()==0
                assert article_box["y"]>video_box["y"],"Article must follow the video in mobile flow"
                assert page.locator(".ks60-chapters").get_attribute("open") is None,"Chapters must start collapsed on mobile"
                assert page.locator(".ks60-chapters summary").is_visible()
                page.locator(".ks60-chapters summary").click()
                assert page.locator(".ks60-chapters").get_attribute("open") is not None
                page.locator('[data-chapter-target="capital-of-experience"]').click()
                assert page.locator(".ks60-chapters").get_attribute("open") is None
            launcher=page.locator("#ks-ai-site-link")
            assert launcher.bounding_box()["width"]<=56, "AI launcher overlaps reading layout"
            page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
            page.wait_for_timeout(100)
            page.screenshot(path=str(OUT/f"{name}-episode-poster.png"),full_page=True)
            # Article and poster stay in DOM simultaneously. Seek starts the YouTube iframe.
            article.locator("[data-seek]").first.click()
            iframe=page.locator("#ks60-frame")
            iframe.wait_for(state="attached",timeout=5000)
            assert "start=58" in iframe.get_attribute("src")
            assert "autoplay=1" in iframe.get_attribute("src")
            assert article.is_visible(),"Article unexpectedly hidden after seeking"
            assert video.is_visible(),"Video unexpectedly hidden after seeking"
            page.screenshot(path=str(OUT/f"{name}-episode-playing.png"),full_page=True)
            REPORT[name]={
                "grid_columns":cols,
                "portrait_ratio":"9:16",
                "desktop_video_share":round(video_box["width"]/(video_box["width"]+article_box["width"]),3) if name=="desktop" else None,
                "video_visible_initially":True,
                "article_visible_initially":True,
                "poster_visible_before_click":True,
                "source_buttons_below_video":True,
                "article_background":"#F9F8F6",
                "seek_from_article":"00:58",
                "page_errors":errors[:8],
            }
            assert not errors,"Page script errors: "+repr(errors[:5])
            page.goto(HOST+"#/en/about/after-sixty/sixty-is-not-a-waiting-room",wait_until="domcontentloaded",timeout=30000)
            article_en=page.locator("#ks60-article-pane")
            article_en.wait_for(state="visible",timeout=20000)
            assert article_en.get_attribute("lang")=="en","English article language missing"
            assert article_en.get_attribute("dir")=="ltr","English article still right-to-left"
            assert "I often receive private messages" in article_en.inner_text(),"Full English introduction missing"
            assert "Making Peace with the Past" in article_en.inner_text(),"English chapters missing"
            assert page.locator(".ks60-language-note").count()==0,"Old Arabic-only warning still visible"
            assert page.locator(".ks60-poster").is_visible(),"English route lost video poster"
            assert page.locator(".ks60-external-watch a").is_visible(),"English route lacks YouTube fallback"
            REPORT[name]["english_article_complete"]=True
            page.screenshot(path=str(OUT/f"{name}-english-article.png"),full_page=True)
            page.close()
        browser.close()
    (OUT/"report.json").write_text(json.dumps(REPORT,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(REPORT,ensure_ascii=False,indent=2))
finally:
    server.terminate()
    try:server.wait(timeout=5)
    except subprocess.TimeoutExpired:server.kill()
