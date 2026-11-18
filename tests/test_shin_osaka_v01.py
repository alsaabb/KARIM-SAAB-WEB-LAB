"""Immutable approval checks for the actual Shin-Osaka V01 bilingual release source."""
import hashlib
import html
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
ROUTE = "story/shin-osaka-greased-hands-victory"
SOURCE = ROOT / "dist/data/story-v3-shin-osaka-greased-hands-victory-v01.json"
VIDEO = "gNyXpyaZMs4"
CHECKSUMS = {
    "ar": {
        "article": "056b725a728c79c59036cca2f47bd6f7fca9e55318e89e2d7d6566a5e92b3c46",
        "webp": "27cac0a66e95fd65bad8ddcdfbd26566cc721ef0b53ff992141545c9cf38d272",
    },
    "en": {
        "article": "d2f64276d5107d606e5dc1e137359205eb50bb5d38ba7977ee9b61fbcec3c706",
        "webp": "ff0b30b3734cb57e6a3c983753ccc1d4e2f1fa56969e528e9813f17665d84abb",
    },
}


class ShinOsakaReleaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.story = json.loads(SOURCE.read_text(encoding="utf-8"))
        cls.index = json.loads((ROOT / "dist/data/story-publisher-v3-index.json").read_text(encoding="utf-8"))

    def test_single_approved_video_and_route(self):
        self.assertEqual(self.story["youtube_id"], VIDEO)
        self.assertEqual(self.story["route"], ROUTE)
        self.assertEqual(self.story["version"], "V01")
        self.assertEqual(self.story["poster_kind"], "ai_illustration")
        self.assertEqual(len([e for e in self.index["entries"] if e.get("youtube_id") == VIDEO]), 1)

    def test_exact_owner_approved_article_bytes_and_independent_cover_hashes(self):
        seen_assets = set()
        for lang in ("ar", "en"):
            article = self.story["article_" + lang]
            self.assertEqual(hashlib.sha256(article.encode("utf-8")).hexdigest(), CHECKSUMS[lang]["article"])
            self.assertTrue(article.startswith(self.story["title_" + lang] + "\n"))
            path = self.story["poster_asset_" + lang]
            self.assertNotIn(path, seen_assets)
            seen_assets.add(path)
            binary = (ROOT / "dist" / path).read_bytes()
            self.assertLessEqual(len(binary), 250 * 1024)
            self.assertEqual(hashlib.sha256(binary).hexdigest(), CHECKSUMS[lang]["webp"])
            self.assertEqual(self.story["poster_sha256_" + lang], CHECKSUMS[lang]["webp"])
            self.assertIn("غلاف توضيحي" if lang == "ar" else "AI-generated illustrative", self.story["poster_note_" + lang])

    def test_bilingual_static_previews_contain_every_original_line(self):
        for lang in ("ar", "en"):
            page = (ROOT / "dist/share" / lang / "story-shin-osaka-greased-hands-victory.html").read_text(encoding="utf-8")
            self.assertIn('id="ks-seo-source-content"', page)
            self.assertIn('hreflang="ar"', page)
            self.assertIn('hreflang="en"', page)
            self.assertIn(VIDEO, page)
            self.assertIn(self.story["poster_asset_" + lang], page)
            for line in filter(str.strip, self.story["article_" + lang].splitlines()):
                self.assertIn("<p>" + html.escape(line, quote=True) + "</p>", page)


if __name__ == "__main__":
    unittest.main()
