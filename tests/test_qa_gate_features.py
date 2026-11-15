"""Regression checks for the read-only QA asset / bilingual validators."""
import unittest

from scripts.qa_gate import ARABIC_SCRIPT, DIST, iter_static_assets, english_strings


class SecurityGateFeatureTests(unittest.TestCase):
    def test_static_asset_detection(self):
        markup = (
            '<img src="assets/hero-ar-approved.webp">'
            'background:url("assets/products-reference-v1.1/hero-bike-camp.webp")'
            'const file="assets/books/prophet-english.pdf";'
        )
        self.assertEqual(set(iter_static_assets(markup)), {
            "assets/hero-ar-approved.webp",
            "assets/products-reference-v1.1/hero-bike-camp.webp",
            "assets/books/prophet-english.pdf",
        })
        self.assertTrue(all((DIST / name).is_file() for name in iter_static_assets(markup)))

    def test_static_missing_asset_is_detectable(self):
        ref = next(iter(iter_static_assets('<img src="assets/no-such-qa-fixture.webp">')))
        self.assertFalse((DIST / ref).is_file(), "Test-only missing asset must not exist")

    def test_runtime_asset_templates_are_not_misinterpreted(self):
        self.assertEqual(list(iter_static_assets('const image="assets/" + fileName;')), [])
        self.assertEqual(list(iter_static_assets("const image='assets/' + item.image;")), [])

    def test_english_fields_detect_arabic_script_even_in_paragraph_arrays(self):
        self.assertTrue(ARABIC_SCRIPT.search("An Arabic leak: السلام"))
        self.assertFalse(ARABIC_SCRIPT.search("Official English book title"))
        self.assertTrue(any(ARABIC_SCRIPT.search(x) for x in english_strings([
            "First English paragraph", {"paragraph": "اختبار عربي"}
        ])))
        self.assertFalse(any(ARABIC_SCRIPT.search(x) for x in english_strings(["English only"])))

    def test_existing_vendor_files_are_present(self):
        for name in ("leaflet.css", "leaflet.js", "images/marker-icon.png",
                     "images/marker-icon-2x.png", "images/marker-shadow.png",
                     "images/layers.png", "images/layers-2x.png", "LICENSE"):
            self.assertTrue((DIST / "assets/vendor/leaflet" / name).is_file(), name)


if __name__ == "__main__":
    unittest.main()
