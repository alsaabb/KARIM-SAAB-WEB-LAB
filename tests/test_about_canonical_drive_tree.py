"""Guard owner-approved single-source About Drive directory (23 page routes).
No Drive read/write is performed: this tests only the published static mirror.
"""
import json
import unittest
from pathlib import Path

DIST = Path(__file__).resolve().parents[1] / "dist"
ROOT_ID = "1sa2tExEXORyGtXUqRKJLko_SsOU61RVn"
INDEX_DOC_ID = "1TgnBGFR_IkT14F0vnXHcW072xEynD1yjKkvNKsw8gvA"

class CanonicalAboutDriveTests(unittest.TestCase):
    def setUp(self):
        self.about = json.loads((DIST / "data/about-master-v2.json").read_text(encoding="utf-8"))
        self.stories = json.loads((DIST / "data/happiness-stories-v1.json").read_text(encoding="utf-8"))
        self.sixty = json.loads((DIST / "data/after-sixty.json").read_text(encoding="utf-8"))

    def test_one_canonical_drive_root_and_current_index(self):
        self.assertEqual(self.about["canonical_drive_folder_id"], ROOT_ID)
        self.assertEqual(self.about["canonical_drive_index_doc_id"], INDEX_DOC_ID)
        self.assertEqual(self.stories["canonical_drive_about_root_id"], ROOT_ID)
        self.assertEqual(self.stories["canonical_drive_index_doc_id"], INDEX_DOC_ID)
        self.assertEqual(self.sixty["canonical_drive_about_root_id"], ROOT_ID)
        self.assertIn(ROOT_ID, self.about["canonical_drive_folder_url"])
        self.assertIn("single canonical", self.about["editorial_archive_policy"])

    def test_each_about_page_has_one_nonempty_folder_and_index_document(self):
        items=self.about["items"]
        self.assertEqual(len(items),23)
        self.assertEqual(len(set(i["route"] for i in items)),len(items))
        self.assertEqual(len(set(i["drive_folder_index_doc_id"] for i in items)),len(items))
        for item in items:
            self.assertTrue(item["source_folder_id"],item["route"])
            self.assertTrue(item["drive_folder_index_doc_id"],item["route"])
            self.assertIn(item["drive_folder_index_doc_id"],item["drive_folder_index_doc_url"])
            self.assertIn(item["source_folder_id"],item["source_folder_url"])
            self.assertNotEqual(item["source_folder_id"],ROOT_ID,item["route"])

    def test_approved_happiness_articles_mapped_without_duplicating_media(self):
        ids={"happiness-not-for-sale":"fk3fYq2lljM","world-is-not-paradise":"e8YffqIamRI"}
        byroute={x["route"]:x for x in self.about["items"]}
        self.assertEqual(len(self.stories["entries"]),2)
        for story in self.stories["entries"]:
            self.assertEqual(story["youtube_id"],ids[story["slug"]])
            item=byroute[story["route"]]
            self.assertEqual(item["source_folder_id"],story["approved_drive_folder_id"])
            self.assertEqual(item["published_article_ar_drive_doc_id"],story["approved_ar_article_drive_doc_id"])
            self.assertEqual(item["published_article_en_drive_doc_id"],story["approved_en_article_drive_doc_id"])
            self.assertEqual(item["approved_poster_drive_doc_id"],story["approved_drive_poster_doc_id"])
            self.assertEqual(item["approved_archive_zip_drive_file_id"],story["approved_drive_archive_zip_id"])
            self.assertEqual(item["drive_folder_index_doc_id"],story["approved_drive_links_doc_id"])
            self.assertEqual(item["article_language_status"],"approved_ar_en")
            self.assertTrue(all(
                len(section["paragraphs_ar"])==len(section["paragraphs_en"])
                for section in story["sections"]
            ))

    def test_after_sixty_v9_approved_article_docs_referenced(self):
        self.assertEqual(len(self.sixty["episodes"]),1)
        episode=self.sixty["episodes"][0]
        self.assertEqual(episode["english_translation_status"],"approved")
        self.assertEqual(episode["approved_archive_folder_id"],"1NGCiSe9PX4KW5HsLZe4ELOajjPtVPxPA")
        self.assertTrue(episode["approved_ar_article_drive_doc_id"])
        self.assertTrue(episode["approved_en_article_drive_doc_id"])
        self.assertTrue(episode["approved_drive_links_doc_id"])
        self.assertTrue(episode["approved_drive_poster_doc_id"])

    def test_compiled_mirror_matches_current_manifest(self):
        data=(DIST/"about-drive-source-v2.js").read_text(encoding="utf-8")
        prefix="window.KARIM_ABOUT_SOURCE = "
        self.assertIn(prefix,data)
        parsed=json.loads(data.split(prefix,1)[1].strip().rstrip(";"))
        self.assertEqual(parsed,self.about)

if __name__=="__main__":
    unittest.main()
