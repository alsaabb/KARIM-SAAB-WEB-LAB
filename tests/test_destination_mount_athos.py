from pathlib import Path
import json
import re
import unittest

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/"dist"

class TestDestinationMountAthos(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads((DIST/"data/destination-mount-athos-greece.json").read_text(encoding="utf-8"))

    def test_source_exact_text_and_video_id(self):
        d=self.data
        self.assertEqual(d["youtube_id"], "zsYOR7WmvAQ")
        self.assertEqual(d["route"], "destination/mount-athos-greece")
        ar=d["langs"]["ar"]["full_text"]
        en=d["langs"]["en"]["full_text"]
        self.assertTrue(ar.startswith("العنوان: جبل آثوس"))
        self.assertTrue(en.startswith("Title: Mount Athos"))
        self.assertIn("تعقيب عبدالكريم بن إبراهيم الصعب:",ar)
        self.assertIn("Commentary by Abdulkarim bin Ibrahim Al-Saab:",en)
        self.assertIn("#مشاريع_الصعب #اترك_أثرا_قبل_الرحيل",ar)
        self.assertIn("#AlSaabProjects #LeaveAGoodImpactBeforeYouDepart",en)
        self.assertTrue(ar.endswith("#TravelDocumentary"))
        self.assertTrue(en.endswith("#اليونان"))
        self.assertGreater(len(ar),3900)
        self.assertGreater(len(en),4500)
        self.assertEqual(d["publishing"],"review_only")

    def test_share_canonical_hreflang_and_content(self):
        for lang in ("ar","en"):
            with self.subTest(lang=lang):
                p=DIST/"share"/lang/"destination-mount-athos-greece.html"
                html=p.read_text(encoding="utf-8")
                self.assertIn('rel="canonical"',html)
                self.assertIn('hreflang="ar"',html)
                self.assertIn('hreflang="en"',html)
                self.assertIn('property="og:image"',html)
                self.assertIn('zsYOR7WmvAQ',html)
                self.assertIn("index.html#/"+lang+"/destination/mount-athos-greece",html)
                self.assertIn("ks-seo-source-content",html)
                self.assertNotIn('name="robots" content="noindex',html)

    def test_sitemap_and_no_original_shell_replacement(self):
        s=(DIST/"sitemap.xml").read_text(encoding="utf-8")
        for lang in ("ar","en"):
            self.assertIn("dist/share/"+lang+"/destination-mount-athos-greece.html",s)
        page=(DIST/"index.html").read_text(encoding="utf-8")
        self.assertIn("destination-mount-athos-greece.js",page)
        self.assertIn("destination-mount-athos-greece.css",page)
        js=(DIST/"destination-mount-athos-greece.js").read_text(encoding="utf-8")
        self.assertIn("data-ks-athos-card",js)
        self.assertIn("youtube-nocookie.com/embed/",js)
        self.assertIn("data-ks-athos-copy",js)

if __name__=="__main__":
    unittest.main()
