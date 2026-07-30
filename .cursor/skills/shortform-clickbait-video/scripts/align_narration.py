#!/usr/bin/env python3
"""
align_narration.py - Align a single-narrator voiceover to the shot list (Audio Mode A).

The bundled narration is one continuous voice whose length will NOT match the sheet's shot lengths,
so proportional stretching makes the picture drift off the words. This detects the actual spoken
windows with voice-activity detection (webrtcvad; no model download) and assigns them to the shots
that carry dialogue/V.O., filling the gaps around them with the non-dialogue shots. The result is a
per-shot [start,end] map over the true audio timeline, so each shot sits on its narration beat.

Output: alignment.json = {master_dur, segments:[[s,e]...], shots:[{n,start,end,has_line}]}
Usage:
  pip install webrtcvad --break-system-packages
  python3 align_narration.py --audio assets/voiceover_MVS_FINN_ADULT_DE.mp3 --json parsed.json \
        [--out alignment.json] [--aggr 2] [--gap 0.35]
Notes:
  - Needs ffmpeg on PATH (decodes to 16k mono).
  - "has_line" shots (dialogue or V.O.) anchor to detected speech segments in order; remaining
    (silent) shots are distributed proportionally into the gaps between anchors by their sheet order.
  - If VAD finds fewer segments than dialogue lines, merge the long V.O. sentence-runs (they split);
    if more, raise --gap. Always sanity-check against the transcript by ear.
"""
import argparse, json, subprocess, wave, sys


def vad_segments(path, aggr, gap):
    import webrtcvad
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", path,
                    "-ar", "16000", "-ac", "1", "-sample_fmt", "s16", "/tmp/_vad16k.wav"], check=True)
    wf = wave.open("/tmp/_vad16k.wav", "rb")
    sr = wf.getframerate(); n = wf.getnframes(); pcm = wf.readframes(n)
    dur = n / sr
    vad = webrtcvad.Vad(aggr); fm = 30; fb = int(sr * fm / 1000) * 2
    segs = []; cur = None; sil = 0.0
    for i in range(0, len(pcm) - fb, fb):
        t = (i // 2) / sr
        sp = vad.is_speech(pcm[i:i + fb], sr)
        if sp:
            if cur is None: cur = [t, t]
            cur[1] = t + fm / 1000.0; sil = 0.0
        elif cur is not None:
            sil += fm / 1000.0
            if sil > gap:
                segs.append(cur); cur = None; sil = 0.0
    if cur: segs.append(cur)
    return dur, [s for s in segs if s[1] - s[0] >= 0.18]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audio", required=True)
    ap.add_argument("--json", required=True)
    ap.add_argument("--out", default="alignment.json")
    ap.add_argument("--aggr", type=int, default=2)
    ap.add_argument("--gap", type=float, default=0.35)
    a = ap.parse_args()
    shots = json.load(open(a.json, encoding="utf-8"))["shots"]
    dur, segs = vad_segments(a.audio, a.aggr, a.gap)
    line_idx = [i for i, s in enumerate(shots) if s.get("dialogue") or s.get("is_vo")]
    print("master %.2fs | %d speech segments | %d dialogue/VO shots"
          % (dur, len(segs), len(line_idx)))
    out = {"master_dur": round(dur, 3), "segments": [[round(x, 3), round(y, 3)] for x, y in segs],
           "shots": []}
    # anchor each dialogue/VO shot to a segment in order (clamp if counts differ)
    anchor = {}
    for k, si in enumerate(line_idx):
        seg = segs[min(k, len(segs) - 1)] if segs else [0, dur]
        anchor[si] = [round(seg[0], 3), round(seg[1], 3)]
    # fill: each shot spans from previous boundary to its anchor/next; silent shots share gaps
    bounds = [0.0]
    for i, s in enumerate(shots):
        bounds.append(anchor[i][1] if i in anchor else None)
    # resolve None boundaries by linear fill between known anchors
    known = [(i, b) for i, b in enumerate(bounds) if b is not None]
    for a1, a2 in zip(known, known[1:]):
        (i1, b1), (i2, b2) = a1, a2
        span = i2 - i1
        for j in range(i1 + 1, i2):
            bounds[j] = round(b1 + (b2 - b1) * (j - i1) / span, 3)
    for i, s in enumerate(shots):
        st = bounds[i] if bounds[i] is not None else round(dur * i / len(shots), 3)
        en = bounds[i + 1] if i + 1 < len(bounds) and bounds[i + 1] is not None else dur
        if en <= st: en = round(st + 0.4, 3)
        out["shots"].append({"n": s["n"], "start": st, "end": round(en, 3),
                             "has_line": bool(s.get("dialogue") or s.get("is_vo"))})
    json.dump(out, open(a.out, "w"), indent=1)
    print("wrote", a.out)
    if len(segs) != len(line_idx):
        print("WARNING: segment count != dialogue/VO count — verify the mapping by ear "
              "(long V.O. sentences often split into multiple segments).")


if __name__ == "__main__":
    main()
