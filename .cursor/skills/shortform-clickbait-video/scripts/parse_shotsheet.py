#!/usr/bin/env python3
"""
parse_shotsheet.py - Parse the short-form screenplay sheet into an ordered shot list + registries.

This sheet layout (columns, order tolerant):
  Shot Number | (blank) | Camera Angle | Camera Movement | Dialogue | Character Reference |
  Location Reference | SFX / Audio Cue | Continuity Notes | VFX | Generation Prompt |
  Animation Prompt | Action | <last col header holds "vo: <drive-url>">
There is NO per-shot Duration column - shot length is set later from the shot's MULTI-VOICE
generated audio (dialogue + voiceover), per the skill's audio-first rule.

Emits parsed.json = {
  "format","total_runtime","vo_url",
  "assets":[{name,asset_type,ref_url,is_human}],
  "locations":[{name,norm,ref_url}],
  "shots":[{n,camera_angle,camera_movement,speaker,dialogue,is_vo,lip_sync,
            char_refs:[{name,url}],loc_ref:{name,url},sfx,continuity,vfx,
            gen_prompt,anim_prompt,action}]
}
Gate (HARD): every shot has a non-empty Generation Prompt AND Animation Prompt AND a resolved
location reference. WARN: a shot with no resolved character reference (insert/atmosphere shot).

Usage: python3 parse_shotsheet.py --shots SHOTS.txt [--characters C.txt] [--locations L.txt] \
          --json parsed.json
Deps: standard library only.
"""
import argparse, json, re, sys, unicodedata

URL_RE = re.compile(r"https?://[^\s|)]+")
SPEAKER_RE = re.compile(r"^\s*([A-ZÄÖÜ][A-ZÄÖÜ .()/'\-]{0,30}?)\s*(\(V\.?O\.?\))?\s*:", re.I)


def read_rows(path):
    rows = []
    for line in open(path, encoding="utf-8").read().splitlines():
        s = line.strip()
        if not s:
            continue
        if "|" in s:
            cells = [c.strip() for c in s.strip("|").split("|")]
            if cells and any(cells) and all((c == "" or re.fullmatch(r":?-+:?", c)) for c in cells):
                continue
            rows.append(cells)
        else:
            rows.append([c.strip() for c in s.split(",")])
    return rows


def clean(s):
    s = unicodedata.normalize("NFKC", s or "")
    return re.sub(r"\s+", " ", s.replace("\\_", "_").replace("\\*", "*").replace("\\-", "-")).strip()


def norm_loc(name):
    n = re.sub(r"[^A-Z0-9 ]", "", clean(name).upper().split("(")[0]).strip()
    return n


def find_header(rows, must):
    for i, r in enumerate(rows):
        low = [clean(c).lower() for c in r]
        if all(any(m in c for c in low) for m in must):
            return i, low
    return -1, None


def cidx(hl, *keys):
    for k in keys:
        for i, c in enumerate(hl):
            if k in c:
                return i
    return -1


def parse_side_tables(path):
    """Optional separate character/location canvases (same shapes as the pilot canvases)."""
    rows = read_rows(path)
    assets, locs = [], []
    hi, hl = find_header(rows, ["character", "asset_type"])
    if hi >= 0:
        ci = cidx(hl, "character_or_asset", "character"); ct = cidx(hl, "asset_type")
        co = cidx(hl, "original_cc_url", "original"); cr = cidx(hl, "resized_or_generation", "resized")
        for r in rows[hi + 1:]:
            if len(r) <= ci: continue
            nm = clean(r[ci])
            if not nm or "shot" in nm.lower(): break
            at = clean(r[ct]) if 0 <= ct < len(r) else ""
            o = URL_RE.search(r[co]) if 0 <= co < len(r) else None
            rs = URL_RE.search(r[cr]) if 0 <= cr < len(r) else None
            ref = rs.group(0) if rs else (o.group(0) if o else "")
            assets.append({"name": nm, "asset_type": at or "unknown", "ref_url": ref,
                           "is_human": at.lower() == "character"})
    hi, hl = find_header(rows, ["location"])
    if hi >= 0 and not any("character" in c for c in hl):
        cn = cidx(hl, "location")
        for r in rows[hi + 1:]:
            if len(r) <= cn: continue
            nm = clean(r[cn])
            if not nm: continue
            u = ""
            for c in r:
                m = URL_RE.search(c)
                if m: u = m.group(0); break
            locs.append({"name": nm, "norm": norm_loc(nm), "ref_url": u})
    return assets, locs


def refs_from_cell(cell):
    cell = clean(cell)
    urls = URL_RE.findall(cell)
    text = URL_RE.sub(" ", cell)
    names = [clean(x) for x in re.split(r"[;,/]| {2,}", text) if clean(x)]
    out, seen = [], set()
    for i, u in enumerate(urls):
        nm = names[i] if i < len(names) else ""
        out.append({"name": nm, "url": u}); seen.add(u)
    if not urls and names:                       # named-only ref (e.g. "Flames")
        out.append({"name": names[0], "url": ""})
    return out


def parse_meta(rows):
    total = fmt = vo = None
    for r in rows[:6]:
        j = " ".join(clean(c) for c in r)
        m = re.search(r"total runtime.*?([0-9]+(?:\.[0-9]+)?)", j, re.I)
        if m and total is None: total = float(m.group(1))
        m = re.search(r"\b(1:1|16:9|9:16|\d+x\d+)\b", j)
        if m and fmt is None: fmt = m.group(1)
    for r in rows:                                # vo link may sit in a header cell
        for c in r:
            if "vo" in clean(c).lower():
                m = URL_RE.search(c)
                if m: vo = m.group(0)
        if vo: break
    return total, fmt, vo


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--shots", required=True)
    ap.add_argument("--characters")
    ap.add_argument("--locations")
    ap.add_argument("--json", default="parsed.json")
    a = ap.parse_args()

    assets, locs = ([], [])
    if a.characters or a.locations:
        for p in filter(None, [a.characters, a.locations]):
            aa, ll = parse_side_tables(p)
            assets += aa; locs += ll

    rows = read_rows(a.shots)
    total, fmt, vo = parse_meta(rows)
    hi, hl = find_header(rows, ["shot number", "generation prompt"])
    if hi < 0:
        hi, hl = find_header(rows, ["shot", "generation prompt"])
    shots = []
    if hi >= 0:
        idx = {k: cidx(hl, *v) for k, v in {
            "n": ["shot number", "shot"], "cang": ["camera angle"], "cmov": ["camera movement"],
            "dlg": ["dialogue"], "char": ["character reference"], "loc": ["location reference"],
            "sfx": ["sfx", "audio cue"], "cont": ["continuity"], "vfx": ["vfx"],
            "gen": ["generation prompt"], "anim": ["animation prompt"], "act": ["action"],
        }.items()}

        def cell(r, k):
            i = idx[k]; return r[i] if 0 <= i < len(r) else ""

        for r in rows[hi + 1:]:
            nraw = clean(cell(r, "n"))
            if not re.match(r"^\d+$", nraw):
                continue
            dlg = clean(cell(r, "dlg"))
            sp = SPEAKER_RE.match(dlg)
            speaker = clean(sp.group(1)) if sp else ""
            is_vo = bool(sp and sp.group(2)) or "v.o" in dlg.lower()[:24]
            line = SPEAKER_RE.sub("", dlg).strip() if sp else dlg
            shots.append({
                "n": nraw, "camera_angle": clean(cell(r, "cang")),
                "camera_movement": clean(cell(r, "cmov")),
                "speaker": speaker, "dialogue": line, "is_vo": is_vo,
                "lip_sync": bool(line) and not is_vo,
                "char_refs": refs_from_cell(cell(r, "char")),
                "loc_ref": (refs_from_cell(cell(r, "loc")) or [{"name": "", "url": ""}])[0],
                "sfx": clean(cell(r, "sfx")), "continuity": clean(cell(r, "cont")),
                "vfx": clean(cell(r, "vfx")), "gen_prompt": clean(cell(r, "gen")),
                "anim_prompt": clean(cell(r, "anim")), "action": clean(cell(r, "act")),
            })

    out = {"format": fmt, "total_runtime": total, "vo_url": vo,
           "assets": assets, "locations": locs, "shots": shots}
    json.dump(out, open(a.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    hard, warn = [], []
    if not shots:
        hard.append("no shots parsed")
    for s in shots:
        if not s["gen_prompt"]: hard.append("shot %s: empty Generation Prompt" % s["n"])
        if not s["anim_prompt"]: hard.append("shot %s: empty Animation Prompt" % s["n"])
        if not (s["loc_ref"] and s["loc_ref"]["url"]):
            warn.append("shot %s: location reference has no URL" % s["n"])
        if not any(c["url"] for c in s["char_refs"]):
            warn.append("shot %s: no character reference URL (insert/atmosphere?)" % s["n"])

    speakers = sorted({s["speaker"] for s in shots if s["speaker"]})
    print("shots:%d  Format:%s  Total Runtime:%s  vo:%s" %
          (len(shots), fmt, total, "yes" if vo else "no"))
    print("speakers (for multi-voice TTS): %s" % speakers)
    print("lip-sync shots: %s" % [s["n"] for s in shots if s["lip_sync"]])
    print("V.O. shots: %s" % [s["n"] for s in shots if s["is_vo"]])
    if warn:
        print("WARNINGS:"); [print("  ~ " + w) for w in warn]
    if hard:
        print("QC: FAIL"); [print("  - " + p) for p in hard]; sys.exit(1)
    print("QC: PASS - every shot has a Generation Prompt, Animation Prompt and a location.")
    sys.exit(0)


if __name__ == "__main__":
    main()
