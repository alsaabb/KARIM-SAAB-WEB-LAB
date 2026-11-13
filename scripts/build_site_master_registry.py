#!/usr/bin/env python3
"""Build whole-site route/media inventory from checked-out repository. No network/write outside docs/registry."""
import argparse
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist"
IMAGE = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"}
VIDEO = {".mp4", ".webm", ".mov", ".m4v"}

def route_from_url(url):
    frag = unquote(urlsplit(url).fragment).lstrip("/")
    parts = frag.split("/", 1)
    if parts[0] in ("ar", "en"):
        return parts[1].strip("/") if len(parts) > 1 else ""
    return None

class Share(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.description, self.image, self.canonical = "", "", "", ""
        self.targets, self.noindex, self.titling = [], False, False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title": self.titling = True
        if tag == "meta":
            if a.get("name") == "robots" and "noindex" in a.get("content",""): self.noindex = True
            if a.get("name") == "description": self.description = a.get("content","")
            if a.get("property") == "og:image": self.image = a.get("content","")
        if tag == "link" and a.get("rel") == "canonical": self.canonical = a.get("href","")
        if tag == "a":
            r = route_from_url(a.get("href",""))
            if r is not None: self.targets.append(("btn" in a.get("class","").split(),r))
    def handle_data(self, data):
        if self.titling: self.title += data
    def handle_endtag(self, tag):
        if tag == "title": self.titling = False

def inferred_route(stem):
    if stem == "home": return ""
    if stem.startswith("content-"): return "content/" + stem[8:]
    if stem == "about-after-sixty": return "about/after-sixty"
    if stem.startswith("after-sixty-"): return "about/after-sixty/" + stem[12:]
    return stem

def asset_ref(url):
    if not isinstance(url,str): return None
    if "/dist/assets/" in url: return "assets/" + unquote(url.split("/dist/assets/",1)[1]).split("?",1)[0]
    if url.startswith("assets/"): return unquote(url.split("?",1)[0])
    return None

def build(root):
    dist = root/"dist"
    xml = ET.parse(dist/"sitemap.xml")
    sitemap = {e.text.strip() for e in xml.findall(".//{*}loc") if e.text}
    pages, used, missing, videos = {}, {}, set(), {}
    def ensure(route):
        if route not in pages:
            pages[route] = {
                "page_id":"ks-page-"+hashlib.sha256(("route:"+route).encode()).hexdigest()[:16],
                "route":route,
                "hash_urls":{lang:BASE+"/index.html#/"+lang+"/"+route for lang in ("ar","en")},
                "title":{"ar":None,"en":None},
                "share_urls":{"ar":None,"en":None},
                "share_files":{"ar":None,"en":None},
                "source_files":[],
                "editorial_status":"not_verified",
                "link_mapping":"unverified",
                "live_page_tested":False,
                "notes":[],
            }
        return pages[route]
    def use_asset(asset,route):
        if asset:
            used.setdefault(asset,set()).add(route)
            if not (dist/asset).is_file(): missing.add(asset)
    shares = sorted((dist/"share").glob("*/*.html"))
    for f in shares:
        lang = f.parent.name
        if lang not in ("ar","en"): continue
        h=Share();h.feed(f.read_text(encoding="utf-8"))
        selected = next((r for priority,r in h.targets if priority),None)
        if selected is None and h.targets: selected=h.targets[0][1]
        route = selected if selected is not None else inferred_route(f.stem)
        row=ensure(route)
        fpath=f.relative_to(root).as_posix()
        url=BASE+"/"+f.relative_to(dist).as_posix()
        if row["share_files"][lang]:
            row.setdefault("additional_share_pages",[]).append(
                {"language":lang,"file":fpath,"url":url,"sitemap":url in sitemap,"noindex":h.noindex})
        else:
            row["share_files"][lang]=fpath
            row["share_urls"][lang]=url
            row["title"][lang]=h.title.strip() or f.stem
        row["source_files"].append(fpath)
        if selected is not None: row["link_mapping"]="share_link_to_hash_route"
        else: row["notes"].append("Route inferred from filename: "+fpath)
        if h.noindex: row["notes"].append("Noindex alias: "+fpath)
        use_asset(asset_ref(h.image),route)
    source = (dist/"content.js").read_text(encoding="utf-8")
    source = re.sub(r"^\s*window\.KARIM_LIBRARY\s*=\s*","",source).strip().rstrip(";")
    library=json.loads(source)
    for key,item in library.items():
        route="content/"+key;row=ensure(route)
        row["title"]["ar"]=row["title"]["ar"] or item.get("ar")
        row["title"]["en"]=row["title"]["en"] or item.get("en")
        row["editorial_status"]=item.get("status") or "not_verified"
        row["source_files"].append("dist/content.js")
        use_asset(asset_ref(item.get("image")),route)
    about=json.loads((dist/"data/about-master-v2.json").read_text(encoding="utf-8"))
    for item in about.get("items",[]):
        route=item.get("route")
        if not route: continue
        row=ensure(route)
        row["title"]["ar"]=row["title"]["ar"] or item.get("title_ar")
        row["title"]["en"]=row["title"]["en"] or item.get("title_en")
        row["source_files"].append("dist/data/about-master-v2.json")
    def video_record(vid,route,source,drive_id=None,public=False):
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}",str(vid or "")): return
        key="youtube:"+vid
        row=videos.setdefault(key,{"media_id":key,"type":"youtube_video",
            "youtube_id":vid,"original_url":"https://www.youtube.com/watch?v="+vid,
            "used_by_routes":[],"source_files":[],"drive_file_ids":[],
            "playback_verified_on_real_device":False,"rights_verified":False,
            "drive_public_fallback_verified":False})
        row["used_by_routes"].append(route);row["source_files"].append(source)
        if drive_id: row["drive_file_ids"].append(drive_id)
        if public: row["drive_public_fallback_verified"]=True
        ensure(route)["source_files"].append(source)
    happiness=json.loads((dist/"data/happiness-stories-v1.json").read_text(encoding="utf-8"))
    for ep in happiness.get("entries",[]):
        video_record(ep.get("youtube_id"),ep.get("route") or "about/happiness/video/"+ep["slug"],
                    "dist/data/happiness-stories-v1.json",ep.get("drive_file_id"),
                    ep.get("drive_fallback_verified") is True)
    after=json.loads((dist/"data/after-sixty.json").read_text(encoding="utf-8"))
    for ep in after.get("episodes",[]):
        video_record(ep.get("youtube_id"),"about/after-sixty/"+ep["slug"],
                    "dist/data/after-sixty.json",ep.get("drive_video_file_id"),
                    ep.get("drive_fallback_verified") is True)
    assets=[]
    for f in sorted((dist/"assets").rglob("*")):
        if not f.is_file() or f.suffix.lower() not in IMAGE|VIDEO: continue
        rel=f.relative_to(dist).as_posix()
        assets.append({"media_id":"local:"+rel,
            "type":"image" if f.suffix.lower() in IMAGE else "video",
            "repository_path":"dist/"+rel,"public_url":BASE+"/"+rel,
            "used_by_routes_from_share_or_library":sorted(used.get(rel,set())),
            "source_status":"file_present","rights_and_origin":"not_verified"})
    for row in pages.values():
        row["source_files"]=sorted(set(row["source_files"]))
        row["notes"]=sorted(set(row["notes"]))
        if "additional_share_pages" in row:
            row["additional_share_pages"].sort(key=lambda x:(x["language"],x["file"]))
    for row in videos.values():
        for k in ("used_by_routes","source_files","drive_file_ids"):row[k]=sorted(set(row[k]))
    pagereg={
        "schema_version":"1.0","basis":"current git checkout; not evidence of live browser success",
        "page_count":len(pages),"share_html_count":len(shares),
        "sitemap_url_count":len(sitemap),
        "sources":["dist/share/ar/*.html","dist/share/en/*.html","dist/content.js",
                   "dist/data/about-master-v2.json","dist/sitemap.xml",
                   "dist/data/happiness-stories-v1.json","dist/data/after-sixty.json"],
        "pages":[pages[k] for k in sorted(pages)]}
    mediareg={
        "schema_version":"1.0","basis":"repository media presence and structured JSON URLs only",
        "local_asset_count":len(assets),"youtube_video_count":len(videos),
        "missing_referenced_public_assets":sorted(missing),
        "media":assets+[videos[k] for k in sorted(videos)]}
    report="\n".join([
        "# KARIM SAAB — Whole-site inventory (repository audit)","",
        "Do not treat sitemap presence as a verified live page. Do not treat an embedded",
        "YouTube ID as proof of playback, public Drive permissions, or media rights.","",
        "- Discovered unique routes: "+str(len(pages)),
        "- Static share pages (AR + EN, including aliases): "+str(len(shares)),
        "- Sitemap URLs: "+str(len(sitemap)),
        "- Existing content-library entries: "+str(len(library)),
        "- About-master entries: "+str(len(about.get("items",[]))),
        "- Local public media files: "+str(len(assets)),
        "- YouTube IDs from structured episode data: "+str(len(videos)),
        "- Missing referenced local public images: "+str(len(missing)),"",
        "## Missing referenced public images (no automatic replacement)",""
    ]+["- "+x for x in sorted(missing)] + ["",
        "## Limitations","",
        "- Routes are recovered from share-page links plus JSON source records.",
        "- CSS/JS dynamically assembled media links may not be exhaustively attributed.",
        "- Ownership, permissions, original media provenance, and real-device playback",
        "  require separate human/source verification.",
        "- Existing page/source identifiers remain authoritative; these registry IDs",
        "  are stable route fingerprints for cross-reference only.",""])
    return pagereg,mediareg,report

def main():
    p=argparse.ArgumentParser();p.add_argument("--write",action="store_true")
    p.add_argument("--check",action="store_true")
    p.add_argument("--root",type=Path,default=Path(__file__).resolve().parents[1])
    a=p.parse_args()
    if a.write==a.check:p.error("Choose --write or --check")
    x,y,report=build(a.root)
    files={
        "docs/registry/page_registry.json":json.dumps(x,ensure_ascii=False,sort_keys=True,indent=2)+"\n",
        "docs/registry/media_registry.json":json.dumps(y,ensure_ascii=False,sort_keys=True,indent=2)+"\n",
        "docs/registry/INVENTORY_REPORT.md":report}
    for path,content in files.items():
        f=a.root/path
        if a.check:
            if not f.exists() or f.read_text(encoding="utf-8")!=content:
                raise SystemExit("Stale inventory: "+path)
        else:
            f.parent.mkdir(parents=True,exist_ok=True)
            f.write_text(content,encoding="utf-8")
    print("Routes:",x["page_count"],"assets:",y["local_asset_count"],"videos:",y["youtube_video_count"])

if __name__=="__main__":main()
