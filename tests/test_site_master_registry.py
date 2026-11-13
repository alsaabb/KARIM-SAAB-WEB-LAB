"""Site-wide non-destructive inventory tests."""
import unittest
from pathlib import Path
from scripts.build_site_master_registry import build, route_from_url, asset_ref

ROOT=Path(__file__).resolve().parents[1]

class MasterInventoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pages,cls.media,cls.report=build(ROOT)
        cls.routes={x["route"]:x for x in cls.pages["pages"]}

    def test_parser_hash_routes(self):
        self.assertEqual(route_from_url("https://example.com/index.html#/ar/stories-road"),"stories-road")
        self.assertEqual(route_from_url("https://example.com/index.html#/en/"),"")
        self.assertIsNone(route_from_url("https://example.com/video"))
        self.assertEqual(asset_ref("https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/assets/a.png"),"assets/a.png")

    def test_inventory_covers_existing_website(self):
        self.assertGreaterEqual(self.pages["sitemap_url_count"],400)
        self.assertGreaterEqual(self.pages["share_html_count"],400)
        self.assertGreaterEqual(self.pages["page_count"],70)
        for route in ("","stories-road","about/after-sixty","about/happiness",
                      "content/cycling","about/after-sixty/sixty-is-not-a-waiting-room"):
            self.assertIn(route,self.routes)
        self.assertTrue(self.routes["stories-road"]["share_files"]["ar"])

    def test_every_share_page_is_counted(self):
        actual=list((ROOT/"dist/share").glob("*/*.html"))
        included=sum(
            len([f for f in p["share_files"].values() if f])+
            len(p.get("additional_share_pages",[]))
            for p in self.pages["pages"])
        self.assertEqual(included,len(actual))

    def test_unique_and_stable_page_ids(self):
        ids=[p["page_id"] for p in self.pages["pages"]]
        self.assertEqual(len(ids),len(set(ids)))
        second,_,_=build(ROOT)
        self.assertEqual(self.pages,second)

    def test_all_public_assets_registered(self):
        self.assertGreaterEqual(self.media["local_asset_count"],25)
        ids=[m["media_id"] for m in self.media["media"]]
        self.assertEqual(len(ids),len(set(ids)))
        for m in self.media["media"]:
            if m["type"]=="image":
                self.assertEqual(m["rights_and_origin"],"not_verified")

    def test_video_records_do_not_assert_private_rights(self):
        self.assertGreaterEqual(self.media["youtube_video_count"],3)
        vids=[v for v in self.media["media"] if v["type"]=="youtube_video"]
        self.assertIn("0YT1QXZT6mI",[v["youtube_id"] for v in vids])
        for v in vids:
            self.assertFalse(v["playback_verified_on_real_device"])
            self.assertFalse(v["rights_verified"])
            self.assertNotIn("drive_file_ids",v)

    def test_master_docs_exist(self):
        self.assertTrue((ROOT/"docs/KARIM_SAAB_WEBSITE_MASTER.md").exists())
        self.assertTrue((ROOT/"docs/KARIM_SAAB_WEBSITE_CHANGELOG.md").exists())

if __name__=="__main__":
    unittest.main()
