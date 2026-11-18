"""V3 unified publishing: reversible preflight and generic story scaffolding."""
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from scripts import publish_v3 as v3


class PublishingV3Tests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "dist/data").mkdir(parents=True)
        (self.root / "dist/share/ar").mkdir(parents=True)
        (self.root / "dist/share/en").mkdir(parents=True)
        (self.root / "dist/assets/stories/demo").mkdir(parents=True)
        (self.root / v3.INDEX).write_text(
            json.dumps({"schema_version": "3.0", "entries": []}) + "\n",
            encoding="utf-8")
        (self.root / "dist/sitemap.xml").write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            '  <url><loc>https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/</loc></url>\n'
            '</urlset>\n', encoding="utf-8")
        # Stand-in bytes for validating file guards; not a public image.
        self.cover = {}
        for lang in ("ar", "en"):
            path = self.root / ("dist/assets/stories/demo/" + lang + "-cover-v01.webp")
            payload = b"RIFF" + b"\x14\x00\x00\x00" + b"WEBP" + (b"test" * 30) + lang.encode()
            path.write_bytes(payload)
            self.cover[lang] = hashlib.sha256(payload).hexdigest()
        title_ar = "مغامرة وثائقية في شمال أوروبا"
        title_en = "A Documentary Journey in Northern Europe"
        self.record = {
            "schema_version": "3.0", "version": "V01", "editorial_approved": True,
            "route": "story/demo-north", "youtube_id": "AbCdEf12345",
            "youtube_url": "https://youtu.be/AbCdEf12345",
            "title_ar": title_ar, "title_en": title_en,
            "seo_title_ar": title_ar, "seo_title_en": title_en,
            "description_ar": "قصة رحلة وثائقية توضح الظروف والتجربة الشخصية بأسلوب واقعي دون مبالغة.",
            "description_en": "A documentary journey and personal account with verified details and no exaggeration.",
            "article_ar": title_ar + "\nبقلم صاحب القصة\n\n" +
                "هذه تجربة شخصية موثقة تشرح رحلة في الطبيعة وظروفها المختلفة بدقة ووضوح. " * 12,
            "article_en": title_en + "\nBy the author\n\n" +
                "A documented firsthand journey in northern nature, describing observations carefully. " * 12,
            "poster_asset_ar": "assets/stories/demo/ar-cover-v01.webp",
            "poster_asset_en": "assets/stories/demo/en-cover-v01.webp",
            "poster_sha256_ar": self.cover["ar"],
            "poster_sha256_en": self.cover["en"],
            "poster_width": 941, "poster_height": 1672,
            "poster_kind": "ai_illustration",
            "poster_note_ar": "الغلاف صورة توضيحية، وليس لقطة أصلية.",
            "poster_note_en": "Illustrative cover, not an original photograph.",
            "tags": "#KARIM_SAAB #Norway #Travel",
        }

    def test_plan_is_read_only_and_valid(self):
        original = (self.root / "dist/sitemap.xml").read_bytes()
        result = v3.report(self.record, self.root)
        self.assertTrue(result["ready"])
        self.assertEqual(result["state"], "READY")
        self.assertEqual((self.root / "dist/sitemap.xml").read_bytes(), original)
        self.assertFalse((self.root / v3.source_path(self.record)).exists())

    def test_preparation_generates_two_languages_and_index(self):
        result = v3.prepare(self.record, self.root, regenerate=False)
        self.assertEqual(result["state"], "BUILDING_REVIEW_ONLY")
        self.assertIn(v3.INDEX, result["changed"])
        index = v3.read_json(self.root / v3.INDEX)
        self.assertEqual(len(index["entries"]), 1)
        self.assertEqual(index["entries"][0]["source"], v3.source_path(self.record)[5:])
        saved = v3.read_json(self.root / v3.source_path(self.record))
        self.assertEqual(saved["article_ar"], self.record["article_ar"])
        self.assertEqual(saved["article_en"], self.record["article_en"])
        self.assertNotIn("drive_destinations", saved)
        for lang in ("ar", "en"):
            page = (self.root / "dist/share" / lang / v3.share_stem(self.record)).read_text("utf-8")
            self.assertIn('hreflang="ar"', page)
            self.assertIn('hreflang="en"', page)
            self.assertIn(self.record["poster_asset_" + lang], page)
            self.assertNotIn(self.record["poster_asset_" + ("en" if lang == "ar" else "ar")], page)
            self.assertIn('id="ks-seo-source-content"', page)
            self.assertIn(v3.SITE + "share/" + lang, (self.root / "dist/sitemap.xml").read_text("utf-8"))

    def test_replay_is_noop_and_changed_content_is_rejected(self):
        v3.prepare(self.record, self.root, regenerate=False)
        again = v3.prepare(self.record, self.root, regenerate=False)
        self.assertEqual(again["state"], "ALREADY_PREPARED")
        self.assertFalse(again["changed"])
        altered = dict(self.record, article_en=self.record["article_en"] + " An unapproved change.")
        with self.assertRaisesRegex(v3.PreflightError, "Existing V3 route"):
            v3.prepare(altered, self.root, regenerate=False)

    def test_invalid_video_and_unapproved_editorial_are_blocked(self):
        bad = dict(self.record, youtube_url="https://youtu.be.evil.invalid/AbCdEf12345")
        self.assertTrue(any("youtube_url" in issue for issue in v3.validate(bad, self.root)))
        bad = dict(self.record, editorial_approved=False)
        self.assertTrue(any("editorial_approved" in issue for issue in v3.validate(bad, self.root)))

    def test_missing_and_corrupted_poster_are_blocked(self):
        bad = dict(self.record, poster_sha256_ar="0" * 64)
        self.assertTrue(any("Cover hash mismatch" in issue for issue in v3.validate(bad, self.root)))
        (self.root / "dist/assets/stories/demo/en-cover-v01.webp").unlink()
        self.assertTrue(any("Missing en poster" in issue for issue in v3.validate(self.record, self.root)))

    def test_old_video_id_duplicate_is_blocked(self):
        (self.root / "dist/data/legacy.json").write_text(
            json.dumps({"youtube_id": self.record["youtube_id"], "route": "story/older"}))
        self.assertTrue(any("Existing story" in issue for issue in v3.validate(self.record, self.root)))

    def test_private_drive_ids_never_enter_public_assets(self):
        bad = dict(self.record, drive_destinations={"ar": "private", "en": "private"})
        self.assertTrue(any("Private archive destination" in issue for issue in v3.validate(bad, self.root)))
        bad = dict(self.record, poster_note_en="")
        self.assertTrue(any("Illustrative cover" in issue for issue in v3.validate(bad, self.root)))

    def test_escape_approved_text_without_editing_record(self):
        text_before = self.record["article_en"]
        self.record["article_en"] += " <a href='bad'> & additional owner-approved words."
        out = v3.static_share(self.record, "en")
        self.assertIn("&lt;a href=&#x27;bad&#x27;&gt;", out)
        self.assertIn("&amp; additional", out)
        self.assertEqual(self.record["article_en"], text_before + " <a href='bad'> & additional owner-approved words.")

    def test_main_branch_and_detached_head_rejected(self):
        from unittest.mock import patch
        from subprocess import CompletedProcess
        for value in ("main\n", "HEAD\n", "\n"):
            with self.subTest(branch=value):
                with patch.object(v3.subprocess, "run", return_value=CompletedProcess([], 0, value)):
                    with self.assertRaises(v3.PreflightError):
                        v3.assert_review_branch(self.root)

    def test_known_youtube_formats(self):
        for url in ("https://youtu.be/AbCdEf12345",
                    "https://www.youtube.com/watch?v=AbCdEf12345",
                    "https://youtube.com/shorts/AbCdEf12345"):
            self.assertEqual(v3.extract_youtube_id(url), "AbCdEf12345")


if __name__ == "__main__":
    unittest.main()
