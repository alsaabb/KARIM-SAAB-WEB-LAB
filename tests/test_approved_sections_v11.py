"""Non-destructive release checks for KARIM SAAB products and video articles V1.1."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
PRODUCT_ASSETS = DIST / 'assets' / 'products-reference-v1.1'


class ApprovedSectionTests(unittest.TestCase):
    def test_product_images_have_actual_bundled_bytes(self):
        names = ('hero-bike-camp', 'journey-banner', 'perfumes', 'caps', 'tshirts',
                 'hoodies', 'artworks', 'vests', 'bags', 'mugs')
        for name in names:
            path = PRODUCT_ASSETS / (name + '.webp')
            self.assertTrue(path.is_file(), str(path))
            data = path.read_bytes()
            self.assertGreater(len(data), 1000, str(path))
            self.assertTrue(data.startswith(b'RIFF') and data[8:12] == b'WEBP', str(path))

    def test_products_source_and_safety(self):
        js = (DIST / 'karim-products.js').read_text(encoding='utf-8')
        css = (DIST / 'karim-products.css').read_text(encoding='utf-8')
        for label in ('product-perfumes', 'product-caps', 'product-tshirts',
                      'product-hoodies', 'product-artworks', 'product-vests',
                      'product-bags', 'product-mugs'):
            self.assertIn(label, js)
        self.assertIn('products-reference-v1.1/', js)
        self.assertIn('صور تصميمية مقتطعة', js)
        self.assertIn('ks-v11-grid', css)
        self.assertIn('@media(max-width:560px)', css)
        self.assertIn('ks-v11-store', js)

    def test_video_articles_guarded_by_approval(self):
        js = (DIST / 'karim-video-articles-v1.js').read_text(encoding='utf-8')
        source = (DIST / 'karim-video-articles-source-v1.js').read_text(encoding='utf-8')
        css = (DIST / 'karim-video-articles-v1.css').read_text(encoding='utf-8')
        self.assertIn("x.transcript_status==='approved'", js)
        self.assertIn("x.article_status==='approved'", js)
        self.assertIn('ks-va-caption', js)
        self.assertIn('ks-va-transcript-panel', js)
        self.assertIn('aria-expanded', js)
        self.assertIn('ks-va-section', css)
        self.assertIn('requires_review_mismatch', source)
        self.assertIn('unavailable_import_failed', source)
        self.assertNotIn('transcript_ar:', source)

    def test_script_load_order_and_existing_routes(self):
        page = (DIST / 'index.html').read_text(encoding='utf-8')
        required = ('karim-products.js', 'about-drive-source-v1.js',
                    'about-drive-layout-v1.js', 'karim-video-articles-source-v1.js',
                    'karim-video-articles-v1.js')
        positions = [page.index('<script src="' + name) for name in required]
        self.assertEqual(positions, sorted(positions))
        for name in ('karim-video-articles-v1.css', 'karim-products.css'):
            self.assertIn(name, page)
        about = (DIST / 'enhancements.js').read_text(encoding='utf-8')
        self.assertIn("route:'about/health'", about)
        self.assertIn("route:'about/happiness'", about)


if __name__ == '__main__':
    unittest.main()
