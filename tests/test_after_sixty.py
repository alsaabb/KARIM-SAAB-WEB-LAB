#!/usr/bin/env python3
"""Read-only automated checks for Life After Sixty review branches."""
import copy
import json
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from after_sixty_drive_sync import validate_episode, validate_document

BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"


class AfterSixtyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / "dist/data/after-sixty.json").read_text(encoding="utf-8"))
        cls.episodes = cls.data["episodes"]
        cls.categories = {x["id"] for x in cls.data["categories"]}

    def test_episode_one_and_metadata(self):
        self.assertEqual(len(self.episodes), 1)
        ep = self.episodes[0]
        self.assertEqual(ep["id"], "after-sixty-01")
        self.assertEqual(ep["slug"], "sixty-is-not-a-waiting-room")
        self.assertEqual(ep["youtube_id"], "0YT1QXZT6mI")
        self.assertEqual(ep["duration_seconds"], 144)
        self.assertEqual(ep["reading_minutes"], 4)
        self.assertEqual([c["time_seconds"] for c in ep["chapters"]], [58, 90, 108])

    def test_content_is_explicitly_marked_incomplete(self):
        ep = self.episodes[0]
        self.assertFalse(ep["article_complete"])
        self.assertTrue(ep["metadata_approved"])
        self.assertEqual(ep["trailing_fragment"], "السعادة قرار")

    def test_no_unverified_drive_fallback(self):
        for ep in self.episodes:
            if not ep.get("drive_fallback_verified"):
                self.assertFalse(ep.get("drive_video_file_id"))

    def test_categories_and_unique_urls(self):
        self.assertEqual(len(self.episodes), len({ep["slug"] for ep in self.episodes}))
        self.assertEqual(len(self.episodes), len({ep["number"] for ep in self.episodes}))
        for ep in self.episodes:
            self.assertIn(ep["category_id"], self.categories)
            self.assertTrue(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", ep["slug"]))
            self.assertTrue(re.fullmatch(r"[A-Za-z0-9_-]{11}", ep["youtube_id"]))

    def test_approval_gate_requires_complete_verified_article(self):
        ep = copy.deepcopy(self.episodes[0])
        ep["approval_status"] = "APPROVED"
        with self.assertRaises(ValueError):
            validate_episode(ep, self.categories)
        ep["article_complete"] = True
        self.assertTrue(validate_episode(ep, self.categories))

    def test_google_doc_identity_gate(self):
        ep = self.episodes[0]
        sample = "\n".join([ep["title_ar"], ep["intro"][0]] +
                           [ch["title_ar"] for ch in ep["chapters"]])
        self.assertTrue(validate_document(ep, sample))
        with self.assertRaises(ValueError):
            validate_document(ep, "وثيقة غير مرتبطة بالحلقة")

    def test_static_share_pages_and_sitemap(self):
        sitemap = (ROOT / "dist/sitemap.xml").read_text(encoding="utf-8")
        for ep in self.episodes:
            for lang in ("ar", "en"):
                relative = "share/" + lang + "/after-sixty-" + ep["slug"] + ".html"
                page = ROOT / "dist" / relative
                self.assertTrue(page.exists(), relative)
                html = page.read_text(encoding="utf-8")
                absolute = BASE + relative
                self.assertIn('<meta property="og:url" content="' + absolute + '">', html)
                self.assertIn('<link rel="canonical" href="' + absolute + '">', html)
                self.assertIn(ep["youtube_id"], html)
                self.assertIn(absolute, sitemap)

    def test_site_loader(self):
        index = (ROOT / "dist/index.html").read_text(encoding="utf-8")
        self.assertIn("after-sixty-v1.css", index)
        self.assertIn("after-sixty-v1.js", index)
        frontend = (ROOT / "dist/after-sixty-v1.js").read_text(encoding="utf-8")
        self.assertIn("data/after-sixty.json", frontend)
        self.assertIn("ks60-video-pane", frontend)
        self.assertIn("data-chapter-target", frontend)
        self.assertIn("data-seek", frontend)


if __name__ == "__main__":
    unittest.main()
