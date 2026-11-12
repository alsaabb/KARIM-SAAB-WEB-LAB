"""Release guardrails for the additive bilingual article/video sharing feature."""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

class BilingualSharingTests(unittest.TestCase):
    def test_assets_linked_to_published_app(self):
        html = (DIST / "index.html").read_text(encoding="utf-8")
        self.assertIn("bilingual-share-v1.css", html)
        self.assertIn("bilingual-share-v1.js", html)
        self.assertLess(html.index('after-sixty-v1.js'), html.index('bilingual-share-v1.js'))
    def test_share_panel_routes_and_language(self):
        js = (DIST / "bilingual-share-v1.js").read_text(encoding="utf-8")
        for expected in ('ks-share-v1','sharePage','makeTags','navigator.share',
                         'navigator.clipboard','MutationObserver','lang:lang',
                         "startsWith('content/')","startsWith('journey/')",
                         "startsWith('about/after-sixty/')","startsWith('about/happiness/video/')"):
            self.assertIn(expected, js)
    def test_scss_accessibility_and_mobile(self):
        css = (DIST / "bilingual-share-v1.css").read_text(encoding="utf-8")
        self.assertIn('@media(max-width:520px)', css)
        self.assertIn(':focus-visible', css)

if __name__ == "__main__":
    unittest.main()
