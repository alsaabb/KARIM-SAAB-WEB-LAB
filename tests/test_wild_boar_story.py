"""Read-only checks for the owner-approved Greek wild boar story."""
import json
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
BASE="https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist"

class WildBoarStoryTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads((ROOT/"dist/data/stories-road-v1.json").read_text(encoding="utf-8"))
    def test_poster_source_is_drive_story_folder_not_unapproved_public_link(self):
        d=self.data
        self.assertEqual(d["poster_source"],"owner_designated_poster_in_same_story_folder")
        self.assertIn(d["poster_status"],("awaiting_owner_poster","approved_and_published"))
        # No direct Drive preview URL, because public-site img tags cannot reliably
        # render private Drive images and should never change Drive permissions.
        if d["poster_status"]=="awaiting_owner_poster":
            self.assertIsNone(d["poster_asset"])
        else:
            import re
            path=d["poster_asset"]
            self.assertRegex(path,r"^assets/stories/wild-boar-greece/[A-Za-z0-9._-]+\.(webp|png|jpg|jpeg|avif)$")
            public=(ROOT/"dist"/path).resolve()
            self.assertTrue(public.is_relative_to((ROOT/"dist/assets/stories/wild-boar-greece").resolve()))
            self.assertTrue(public.is_file())
            self.assertGreater(public.stat().st_size,1000)
            self.assertLess(public.stat().st_size,800000,"Owner poster should be mobile-optimized")
            self.assertEqual(public.suffix,".webp")
            self.assertEqual(public.read_bytes()[:4],b"RIFF")
            self.assertEqual(public.read_bytes()[8:12],b"WEBP")
            self.assertEqual(d["poster_web_dimensions"],{"width":941,"height":1672})
            self.assertEqual(d["poster_web_file_bytes"],public.stat().st_size)
            self.assertEqual(d["poster_kind"],"owner_designated_composite_editorial_poster_not_a_documentary_photo")
        self.assertIn("stories-road/card",d["poster_shared_for"])
        self.assertIn("bilingual-share-og-image",d["poster_shared_for"])
        # A future approved poster must also be the social preview for BOTH languages.
        if d["poster_status"]=="approved_and_published":
            public=BASE+"/"+d["poster_asset"]
            for lang in ("ar","en"):
                share=(ROOT/"dist/share"/lang/"story-wild-boar-greece.html").read_text(encoding="utf-8")
                self.assertIn('property="og:image" content="'+public+'"',share)
                self.assertIn('name="twitter:image" content="'+public+'"',share)


    def test_original_sources_and_video_id(self):
        d=self.data
        self.assertEqual(d["slug"],"wild-boar-greece")
        self.assertEqual(d["route"],"story/wild-boar-greece")
        self.assertEqual(d["parent_route"],"stories-road")
        self.assertEqual(d["youtube_id"],"SVdg9IxoS4k")
        self.assertEqual(d["youtube_url"],"https://youtube.com/shorts/SVdg9IxoS4k")
        self.assertEqual(d["video_orientation"],"vertical")
        self.assertFalse(d["drive_video_fallback_verified"])
        for lang in ("ar","en"):
            item=d["langs"][lang]
            self.assertGreaterEqual(len(item["sections"]),20)
            self.assertEqual(len(item["hashtags"]),13)
            self.assertEqual(item["video_link"],"https://youtube.com/shorts/SVdg9IxoS4k")
            self.assertTrue(item["title"])
            self.assertTrue(item["byline"])
            self.assertTrue(all(isinstance(s["text"],str) and s["text"].strip() and s["type"] in {"heading","paragraph"} for s in item["sections"]))
    def test_approved_original_phrase_integrity(self):
        ar="\n".join(x["text"] for x in self.data["langs"]["ar"]["sections"])
        en="\n".join(x["text"] for x in self.data["langs"]["en"]["sections"])
        for phrase in (
          "شمال جزيرة إيفيا اليونانية",
          "دراجتي البيضاء TREK FX3",
          "قبل أن يستيقظ",
          "أصوات الخنزير البري قطعت الصمت!",
          "الشجاعة ليست في تحدي الحيوانات البرية",
          "كل طريق يحمل حكاية",
        ):
            self.assertIn(phrase, ar)
        for phrase in (
          "northern Evia, Greece", "white TREK FX3",
          "before he woke up", "The moment the silence broke",
          "True courage is not challenging a wild animal",
          "every road carries a story",
        ):
            self.assertIn(phrase,en)
        self.assertEqual(sum(x["type"]=="heading" for x in self.data["langs"]["ar"]["sections"]),2)
        self.assertEqual(sum(x["type"]=="heading" for x in self.data["langs"]["en"]["sections"]),2)
    def test_html_assets_and_share_links(self):
        html=(ROOT/"dist/index.html").read_text(encoding="utf-8")
        for f in ("wild-boar-story-v1.js","wild-boar-story-v1.css"):
            self.assertIn(f,html)
            self.assertTrue((ROOT/"dist"/f).is_file())
        js=(ROOT/"dist/wild-boar-story-v1.js").read_text(encoding="utf-8")
        self.assertIn("story/wild-boar-greece",js)
        self.assertIn("stories-road",js)
        self.assertIn("youtube-nocookie.com/embed/",js)
        self.assertIn("data-wb-play",js)
        self.assertNotIn("1hSHvYCj516iyIqCiswPRa2uMV2aNtDpQ",js)
    def test_searchable_bilingual_share_pages(self):
        xml=ET.parse(ROOT/"dist/sitemap.xml")
        urls=[item.text for item in xml.findall(".//{*}loc") if item.text]
        for lang in ("ar","en"):
            path=ROOT/"dist/share"/lang/"story-wild-boar-greece.html"
            txt=path.read_text(encoding="utf-8")
            public=BASE+"/share/"+lang+"/story-wild-boar-greece.html"
            self.assertIn(public,urls)
            self.assertIn('rel="canonical" href="'+public+'"',txt)
            self.assertIn('property="og:url" content="'+public+'"',txt)
            self.assertIn('property="og:type" content="article"',txt)
            self.assertIn("youtube.com/shorts/SVdg9IxoS4k",txt)
            self.assertIn("#/"+lang+"/story/wild-boar-greece",txt)
            self.assertIn(self.data["langs"][lang]["title"],txt.replace("&#39;","'"))
        self.assertEqual(len(urls),len(set(urls)))
    def test_master_generator_includes_new_route_and_video(self):
        from scripts.build_site_master_registry import build
        pages,media,report=build(ROOT)
        story=next(p for p in pages["pages"] if p["route"]=="story/wild-boar-greece")
        self.assertEqual(story["editorial_status"],"owner_approved_bilingual")
        self.assertIn("dist/data/stories-road-v1.json",story["source_files"])
        self.assertTrue(story["share_files"]["ar"] and story["share_files"]["en"])
        vid=next(m for m in media["media"] if m["media_id"]=="youtube:SVdg9IxoS4k")
        self.assertEqual(vid["used_by_routes"],["story/wild-boar-greece"])
        self.assertFalse(vid["playback_verified_on_real_device"])
        self.assertNotIn("drive_file_ids",vid)

if __name__=="__main__":unittest.main()
