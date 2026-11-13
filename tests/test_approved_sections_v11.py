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

    def test_approved_happiness_stories_replace_old_transcript_placeholders(self):
        import json
        content = json.loads((DIST / 'data/happiness-stories-v1.json').read_text(encoding='utf-8'))
        by_slug = {e['slug']: e for e in content['entries']}
        self.assertEqual(set(by_slug), {'happiness-not-for-sale', 'world-is-not-paradise'})
        self.assertEqual(by_slug['happiness-not-for-sale']['youtube_id'], 'fk3fYq2lljM')
        self.assertEqual(by_slug['world-is-not-paradise']['youtube_id'], 'e8YffqIamRI')
        for story in by_slug.values():
            self.assertTrue(story['title_ar'] and story['title_en'])
            self.assertGreaterEqual(len(story['sections']), 5)
            for part in story['sections']:
                self.assertEqual(len(part['paragraphs_ar']), len(part['paragraphs_en']))
                self.assertTrue(all(part['paragraphs_en']))
        js = (DIST / 'happiness-stories-v1.js').read_text(encoding='utf-8')
        self.assertIn('ks-happ-article-pane', js)
        self.assertIn('ks-happ-poster', js)
        self.assertIn("window.KARIM_HAPPINESS_STORIES", js)
        self.assertIn('ks-happ-player', (DIST / 'happiness-stories-v1.css').read_text(encoding='utf-8'))

    def test_current_about_master_v2_is_single_active_source(self):
        import json
        published = (DIST / 'index.html').read_text(encoding='utf-8')
        master = json.loads((DIST / 'data/about-master-v2.json').read_text(encoding='utf-8'))
        self.assertEqual(master['release'], 'KARIM_ABOUT_SOURCE_MASTER_V2.0_2026-11-13')
        self.assertEqual(master['schema_version'], '2.0')
        self.assertIn('KARIM_ABOUT_SOURCE_MASTER_V2.0_2026-11-13', published)
        self.assertEqual(len(master['items']), 23)
        original = (DIST / 'about-drive-source-v2.js').read_text(encoding='utf-8')
        self.assertIn('"schema_version":"2.0"', original)
        self.assertIn('"title_ar":"سعادة لا تُشترى"', original)
        self.assertIn('"title_ar":"الدنيا ليست جنة؟"', original)
        self.assertIn('about-drive-layout-v2.js', published)
        self.assertIn('shared-shell-v2.js', published)
        self.assertNotIn('karim-video-articles-v1', published)
        self.assertNotIn('ks-happiness-branch-v10-preview', published)
        self.assertNotIn('about-drive-source-v1', published)

    def test_script_load_order_and_existing_routes(self):
        page = (DIST / 'index.html').read_text(encoding='utf-8')
        required = ('karim-products.js', 'about-drive-source-v2.js',
                    'about-drive-layout-v2.js', 'after-sixty-v1.js',
                    'happiness-stories-v1.js', 'bilingual-share-v1.js',
                    'about-unified-shell-happiness-hub-v2.js')
        positions = [page.index('<script src="' + name) for name in required]
        self.assertEqual(positions, sorted(positions))
        for name in ('about-drive-layout-v2.css', 'happiness-stories-v1.css',
                     'karim-products.css', 'shared-shell-v2.css'):
            self.assertIn(name, page)
        about = (DIST / 'enhancements.js').read_text(encoding='utf-8')
        self.assertIn("route:'about/health'", about)
        self.assertIn("route:'about/happiness'", about)


if __name__ == '__main__':
    unittest.main()
