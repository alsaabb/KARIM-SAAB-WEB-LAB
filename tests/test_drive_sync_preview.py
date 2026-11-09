"""Safety and functionality tests for read-only Drive staging previews."""
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import drive_sync_preview as s


def record(status="approved", title="Demo heading", body="Test sample text with enough characters.", extras=""):
    return ("id: TEST-001\nstatus: " + status + "\ntitle: " + title +
            "\npublisher: Test publisher\n" + extras + "---BODY---\n" + body)


class PreviewTests(unittest.TestCase):
    def test_only_approved_items(self):
        self.assertIsNone(s.parse_document(record(status="draft"), "en"))
        self.assertIsNotNone(s.parse_document(record(), "en"))

    def test_escaped_html(self):
        item = s.parse_document(record(title="<img onerror=alert(1)>", body="<script>alert(1)</script> This text is long enough."), "en")
        output = s.render(item)
        self.assertNotIn("<script>alert(1)</script>", output)
        self.assertIn("&lt;script&gt;", output)
        self.assertIn('name="robots" content="noindex,nofollow"', output)

    def test_reject_bad_id(self):
        with self.assertRaises(ValueError):
            s.parse_document(record().replace("TEST-001", "../secrets"), "en")

    def test_reject_unsafe_url(self):
        with self.assertRaises(ValueError):
            s.parse_document(record(extras="source_url: javascript:alert(1)\n"), "en")

    def test_public_media_requires_rights(self):
        with self.assertRaises(ValueError):
            s.parse_document(record(extras="logo_url: https://example.org/logo.png\n"), "en")

    def test_generate_bilingual_fixture(self):
        with tempfile.TemporaryDirectory() as tmp:
            items = s.generate(s.load_fixture(), tmp)
            self.assertEqual(len(items), 2)
            self.assertTrue((Path(tmp) / "ar" / "demo-001.html").exists())
            self.assertTrue((Path(tmp) / "en" / "demo-001.html").exists())
            self.assertTrue((Path(tmp) / "manifest.json").exists())

    def test_draft_not_exported(self):
        with tempfile.TemporaryDirectory() as tmp:
            output = s.generate([("ar", record(status="draft"), "draft.txt")], tmp)
            self.assertEqual(output, [])
            self.assertFalse((Path(tmp) / "ar" / "test-001.html").exists())

    def test_duplicate_id_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                s.generate([("ar", record(), "one"), ("ar", record(), "two")], tmp)

    def test_never_write_published_files(self):
        with self.assertRaises(ValueError):
            s.generate([], ROOT / "dist" / "share" / "ar" / "staging")

if __name__ == "__main__":
    unittest.main()
