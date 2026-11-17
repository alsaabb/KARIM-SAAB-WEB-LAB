"""Review gate for KARIM SAAB owner-approved Arabic/English Reindeer road documentary."""
import hashlib
import json
from pathlib import Path
import re
import unittest

ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/"dist"
DATA=json.loads((DIST/"data/reindeer-norway-v1.json").read_text(encoding="utf-8"))

class ReindeerPublication(unittest.TestCase):
    def test_canonical_id_and_language_pair(self):
        self.assertEqual(DATA["youtube_id"],"i72sAiafvDw")
        self.assertEqual(DATA["route"],"story/reindeer-close-call-norway")
        self.assertEqual(DATA["parent_route"],"stories-road")
        self.assertEqual(DATA["country"],"Norway")
        self.assertRegex(DATA["youtube_id"],r"^[A-Za-z0-9_-]{11}$")
        self.assertNotEqual(DATA["article_ar"],DATA["article_en"])
        self.assertTrue(DATA["article_ar"].startswith(DATA["title_ar"]+"\n"))
        self.assertTrue(DATA["article_en"].startswith(DATA["title_en"]+"\n"))
        self.assertIn("كلمة وتعقيب عبد الكريم بن ابراهيم الصعب:",DATA["article_ar"])
        self.assertIn("Personal Reflection by KARIM SAAB:",DATA["article_en"])
        self.assertTrue(DATA["article_ar"].endswith("النرويج.»"))
        self.assertTrue(DATA["article_en"].endswith("before you depart.\""))
        self.assertEqual(len(DATA["tags"].split()),10)

    def test_exact_owner_posters_and_language_specific_paths(self):
        self.assertEqual(DATA["poster_status"],"approved_and_published")
        self.assertNotEqual(DATA["poster_asset_ar"],DATA["poster_asset_en"])
        for lang in ("ar","en"):
            path=DIST/DATA["poster_asset_"+lang]
            payload=path.read_bytes()
            self.assertTrue(payload.startswith(b"RIFF") and payload[8:12]==b"WEBP")
            self.assertEqual(hashlib.sha256(payload).hexdigest(),DATA["poster_sha256_"+lang])
            self.assertGreater(len(payload),100000)
            self.assertLess(len(payload),250*1024)
            self.assertIn("/"+lang+"-cover-",str(path))

    def test_crawlable_full_articles_and_language_image_separation(self):
        for lang in ("ar","en"):
            share=(DIST/"share"/lang/"story-reindeer-close-call-norway.html").read_text(encoding="utf-8")
            other=DATA["poster_asset_"+("en" if lang=="ar" else "ar")]
            path=DATA["poster_asset_"+lang]
            self.assertIn("assets/stories/reindeer-close-call-norway/",share)
            self.assertIn(path,share)
            self.assertNotIn(other,share)
            self.assertIn(DATA["seo_title_"+lang],share)
            self.assertIn(DATA["description_"+lang],share)
            self.assertIn('hreflang="ar"',share)
            self.assertIn('hreflang="en"',share)
            self.assertIn('id="ks-seo-source-content"',share)
            self.assertIn("youtube-nocookie.com/embed/i72sAiafvDw",share)
            self.assertIn("og:image",share)
            self.assertIn('name="keywords"',share)
            other_lines=[x for x in DATA["article_"+("en" if lang=="ar" else "ar")].splitlines()[2:] if x.strip()]
            self.assertNotIn(other_lines[0],share)
        sitemap=(DIST/"sitemap.xml").read_text(encoding="utf-8")
        for lang in ("ar","en"):
            self.assertIn("/share/"+lang+"/story-reindeer-close-call-norway.html",sitemap)

    def test_site_template_and_sharing(self):
        index=(DIST/"index.html").read_text(encoding="utf-8")
        self.assertIn('src="reindeer-norway-v1.js?v=i72sAiafvDw-v1"',index)
        self.assertIn('href="reindeer-norway-v1.css?v=i72sAiafvDw-v1"',index)
        source=(DIST/"reindeer-norway-v1.js").read_text(encoding="utf-8")
        self.assertIn("ks-happ ks-sleeve ks-arctic ks-reindeer",source)
        self.assertIn("data-reindeer-play",source)
        self.assertIn("ks-sleeve-gold-play",source)
        self.assertIn("story/reindeer-close-call-norway",source)
        self.assertIn("story" ,source)


    def test_artwork_is_labeled_as_illustrative_and_norway_is_not_misattributed(self):
        js=(DIST/"reindeer-norway-v1.js").read_text(encoding="utf-8")
        self.assertIn("AI-assisted illustration",js)
        self.assertIn("ليس لقطة فوتوغرافية أصلية",js)
        self.assertIn("journey/legacy-11",js)
        self.assertIn("data-reindeer-norway-feature",js)
        sharing=(DIST/"bilingual-share-v1.js").read_text(encoding="utf-8")
        for platform in ("facebook","whatsapp","telegram","linkedin","pinterest","instagram","snapchat","tiktok"):
            self.assertIn(platform,sharing)
        self.assertIn("reindeer-close-call",sharing)

if __name__=="__main__":
    unittest.main()
