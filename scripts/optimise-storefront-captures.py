#!/usr/bin/env python3
"""Reproducible, source-checked public storefront screenshots; draft branch only.

Uses the 19 November 2026 browser captures already stored in GitHub Actions
run 44490966868. Never generates a mock-up or implies verified client outcomes.
"""
from pathlib import Path
from PIL import Image
import json, re, hashlib, sys

RUN = 44490966868
DATE = "2026-11-19"
SKIP = ("axlrodd", "desktop")  # The recovered desktop view is almost empty.

def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: optimise-storefront-captures.py <capture-folder> <output-folder>")
    source, target = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    manifest = json.loads((source / "manifest.json").read_text())
    records = manifest["results"]
    script = Path(__file__).with_name("capture-storefronts.mjs").read_text()
    sites = re.findall(r"^\s*\['([a-z0-9-]+)',\s*'([^']+)',\s*'(https://[^']+)'\]", script, re.M)
    if len(sites) != 11 or len({s[0] for s in sites}) != 11 or len(records) != 24:
        raise SystemExit("Unexpected snapshot registry/manifest")
    by_key = {(r.get("slug"), r.get("device")): r for r in records}
    if len(by_key) != len(records):
        raise SystemExit("Duplicate captured site/device")
    target.mkdir(parents=True, exist_ok=True)
    published = []
    for slug, name, url in sites:
        for device, size, width in (("desktop", (1280,800),580), ("mobile",(390,844),190)):
            entry = by_key.get((slug, device))
            if not entry or entry.get("status") != "captured" or entry.get("name") != name or entry.get("url") != url or not entry.get("capturedAt", "").startswith(DATE):
                raise SystemExit(f"Capture metadata mismatch for {slug} {device}")
            if (slug, device) == SKIP:
                continue
            filename = slug + "-" + device + ".png"
            if entry.get("filename") != filename:
                raise SystemExit("Unexpected capture filename")
            original = source / filename
            data = original.read_bytes()
            if not data.startswith(bytes.fromhex("89504e470d0a1a0a")) or len(data) < 3000:
                raise SystemExit(f"Invalid screenshot {filename}")
            with Image.open(original) as im:
                im.load()
                if im.format != "PNG" or im.size != size:
                    raise SystemExit(f"Unexpected screenshot geometry: {filename}")
                clean = im.convert("RGB").resize((width, round(size[1]*width/size[0])), Image.Resampling.LANCZOS)
                output = target / (slug + "-" + device + ".webp")
                clean.save(output, format="WEBP", quality=70, method=6)
            if output.stat().st_size < 500:
                raise SystemExit("Optimised screenshot unexpectedly small")
            published.append({"slug":slug,"device":device,"name":name,
                              "filename":output.name,"capturedAt":entry["capturedAt"],
                              "size":output.stat().st_size,
                              "sha256":hashlib.sha256(output.read_bytes()).hexdigest()})
    if len(published) != 21:
        raise SystemExit("Unexpected publication count")
    provenance = {"sourceRun":RUN,"captured":DATE,"source":"Public homepages; self-reported work, not endorsements",
                  "excluded":"axlrodd-desktop (incomplete screenshot)","assets":published}
    (target / "capture-provenance.json").write_text(json.dumps(provenance, indent=2)+"\n")
    print(f"Prepared {len(published)} dated, first-party WebP previews for review")

if __name__ == "__main__":
    main()
