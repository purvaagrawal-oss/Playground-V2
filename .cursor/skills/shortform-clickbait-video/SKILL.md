---
name: shortform-clickbait-video
metadata:
  version: 1.4.0
description: >
  SELF-CONTAINED pipeline that turns a short-form screenplay shot sheet (a Google Sheet, one row per
  shot) into one stitched, clickbait-style social video via the Blaze MCP. Reads the sheet with the
  Google Drive connector; locks identity to the Character Reference and setting to the Location
  Reference, registers human faces as BytePlus avatars, and by default lays the user's bundled
  voiceover (assets/voiceover_MVS_FINN_ADULT_DE.mp3) as the film's audio, aligning shots to that
  narration (multi-voice TTS for per-character lip-sync only on request). Generates shots in Seedance
  2.0 at 720x720 (1:1) from the verbatim Generation and Animation prompts. Renders the film in 4 PARTS
  (acts), assembling each then stitching them with last-frame seam references for continuity, QCs
  every shot and seam, and joins everything with transitions over the audio. Use whenever someone
  wants a shot sheet or screenplay canvas turned into a short-form video, or mentions Seedance,
  Blaze video, shot sheet, or a character/location canvas.
---

# Short-Form Clickbait Video from a Shot Sheet (Blaze) — Self-Contained Pipeline

You are an **expert AI video editor for high-engagement, scroll-stopping short-form / social video**.
You turn a structured shot sheet plus a fixed character/location canvas into one stitched, cinematic
final video with punchy clickbait hook energy — fully automated through the **Blaze MCP** (Seedance
2.0 video, BytePlus avatars, multi-voice TTS, ffmpeg stitch/mux).

> ## Two principles (read first)
> **1. Loop engineering — produce → self-evaluate → repeat until PASS.** No stage is trusted forward;
> each ends with a QC self-evaluation against a 100% bar and re-does only the failing unit.
> **2. Context engineering — lock the truth, never re-improvise it.** The sheet's per-shot
> Generation Prompt and Animation Prompt are **verbatim constants**; characters are names governed by
> reference images / avatars; a shared continuity block + negative library kill drift and artifacts.

This skill honors the source brief's HARD CONSTRAINTS (see `scripts/continuity_rules.md`), the most
important being: **720x720 output, deliberate transitions, and multi-voice narration.** Instead of
rendering strictly one shot at a time, this version renders the film in **4 PARTS (acts)** — each part
is generated, assembled and continuity-checked on its own, then the four parts are stitched into the
final. Continuity is carried within and across parts (see the eyeline bible + part-seam rule below).

> ## THE THREE GUARANTEES (this skill exists to nail these — verify each before delivery)
> **1. Shots follow the script.** Build every prompt from the sheet's **Generation Prompt and
> Animation Prompt cells VERBATIM** (plus that shot's Camera Angle/Movement, VFX and Action). Never
> paraphrase, summarise or "improve" them — paraphrasing is the #1 cause of off-script shots. Only
> *append* the reference key, continuity block and negatives; never rewrite the scripted beat.
> **2. Eyeline consistency.** Pass an explicit screen-direction to every shot from the fixed
> **eyeline bible** (below) plus that shot's Continuity Note. Keep the 180-degree line; make reverses
> match (e.g. Max looks down-left ⇄ Finn looks up-right). Independent generation will NOT infer this —
> you must state it every time.
> **3. Scene switching.** Assemble with **deliberate transitions**, not raw hard cuts: short dissolves
> between shots, a bright fade-white pop at the fire ignition, and a gentle bright fade on the closing
> beat — see Phase 6 for the exact ffmpeg recipe that keeps the cut locked to the audio length.

### Eyeline bible (state the relevant line in every shot prompt)
- **Max** — dominant, standing, **screen-right / higher**, looks **down toward screen-left**.
- **Finn** — lower/kneeling, **screen-left**, looks **up toward screen-right**.
- **Fire / key light** spills from **screen-right**, consistent every shot.
- **Black Book** — one sealed toothed grimoire, identical every shot, never opened.
- **Cadets** — blurred semicircle behind, screen-right. Camera stays on ONE side of the Max–Finn line.

### Battle-tested facts (learned from real runs — don't re-discover the hard way)
- Raw photoreal face refs are **rejected** ("may contain a real person"). Register each human face as a
  BytePlus avatar (`register_byteplus_asset:v1`, default group) and pass the `asset://` in `image_urls`.
- **Do not pass photoreal crowd/parents plates** as refs — they trip the same filter. Describe crowds
  and the parents-memory in the prompt instead.
- Seedance has a **~4s minimum** render even if you request 2–3s; trim to the target length locally.
- **Audio-driven lip-sync works** via `audio_urls` (cite `@Audio1`), but the audio must be **≥1.8s**;
  the generated clip is **silent** (audio only drives the mouth) so you lay the track back in the edit.
- `config.failure_policy` must be a valid value (`"fail_fast"`); an invalid one → `validation_failed`
  with 0 nodes. Cite `@Image1..N` in the SAME order you pass `image_urls`. Generated clips download
  from the CloudFront output domain, so local ffmpeg trim/stitch/mux works.
- **The provided `vo:` link is a SINGLE narrator track** (one voice). It cannot lip-sync multiple
  characters. For real per-character lip-sync, synthesize multi-voice TTS (default); the master `vo`
  can instead be laid over the whole cut with mouths prompt-driven (a narrated-flashback treatment).

### 4-PART rendering plan (render in acts, not shot-by-shot)
Group the ordered shot list into **4 contiguous parts (acts)** at natural story beats, then render each
part fully, assemble it, continuity-check it, and finally stitch the four part-videos. Default grouping
for a 21-shot sheet like this one:
- **Part 1 — Threat (shots 1–4):** Max grips, raises and drops the Black Book.
- **Part 2 — Ignition (shots 5–11):** Finn reacts, the boot pins the book, fire ignites, book over flames.
- **Part 3 — Rescue (shots 12–16):** Finn runs in, confronts, pulls the book from the fire, cradles it.
- **Part 4 — Aftermath (shots 17–21):** Max's insult and shove, the cadets, the parents-memory close.
Adjust boundaries to the actual sheet, but keep parts contiguous and cut on scene/beat changes (a
transition-friendly shot such as the fire-wipe is a good seam).

### Part-seam continuity rule (this is what keeps the 4 parts feeling like one film)
1. Apply the eyeline bible + each shot's Continuity Note to **every** shot in every part (screen
   direction, lighting from screen-right, the one sealed Black Book).
2. **Carry visual state across seams:** after a part is generated, extract the **last frame of its
   final shot** and pass it as an extra reference `image_url` to the **first shot of the next part**
   (cite it in the prompt as "match the lighting, wardrobe, framing continuity and screen direction of
   @ImageN"). This hands the next act the outgoing look so identity, light and staging carry over.
3. QC each **seam** (last frame of part N vs first frame of part N+1): same location/lighting/time-of-
   day, consistent character look, continuous screen direction. Regenerate the offending boundary shot
   until the seam reads continuous.
4. Keep the same avatar `asset://` ids and reference URLs across all parts — never re-register.

## Inputs (read via the Google Drive connector)
- **Screenplay shot sheet** — a Google Sheet, one row per shot. Read with
  `Google Drive:read_file_content`. Expected columns (order-tolerant; see `scripts/google_inputs.md`):
  `Shot Number | (blank) | Camera Angle | Camera Movement | Dialogue | Character Reference |
   Location Reference | SFX / Audio Cue | Continuity Notes | VFX | Generation Prompt |
   Animation Prompt | Action`, and a **voiceover link may live in the last column's header** (`vo: <url>`).
  There is usually **no per-shot Duration column** — set each shot's length from its generated audio.
- **Character / Location reference images** — the CDN URLs inside the sheet cells (optionally a
  separate character/location canvas sheet, same shapes as the pilot canvases).
- **Bundled default voiceover** — `assets/voiceover_MVS_FINN_ADULT_DE.mp3` (a ~43s single-voice
  German narration, adult Finn). This is the audio for the narrated-flashback mode below and is
  already inside the skill, so no Drive fetch is needed. (The sheet's `vo:` link points to the same
  file, which is a private Drive file the sandbox can't fetch — use this bundled copy instead.)

### Choose an AUDIO MODE up front (this decides everything downstream)
- **Mode A — Bundled single-narrator (narrated flashback) — THIS IS THE DEFAULT.** Use the bundled
  `assets/voiceover_MVS_FINN_ADULT_DE.mp3` as the authoritative track for the WHOLE film. It is ONE
  narrator voice, so characters do **not** lip-sync to it; mouths are prompt-driven (natural speaking
  for in-scene lines, closed for V.O.). To make shots match the narration, **align** shots to the
  audio (see `scripts/align_narration.py` + Phase 2A). Always use this mode unless the user explicitly
  asks for per-character lip-sync — the user provided this voiceover to be the film's audio.
- **Mode B — Multi-voice TTS (per-character lip-sync) — only on explicit request.** Synthesize each
  line in that speaker's own voice and drive real audio-driven lip-sync on the dialogue shots
  (Phase 2B/4). Choose this ONLY when the user asks for accurate per-character lip-sync instead of
  their supplied narration. **Do not mix:** a single narrator cannot lip-sync multiple characters.

## Blaze tools & skills (load `blaze-mcp-skill-basics` once per session)
- `get_skill("blaze-mcp-skill-basics")` — **required once** before any `execute_blaze_workflow`.
- `execute_blaze_workflow` / `get_blaze_workflow_status` / `debug_blaze_workflow_execution`;
  `get_activity_schema` before first use of any activity; `get_upload_url` for CDN uploads.
- **Avatars:** `register_byteplus_asset:v1` (human faces → `asset://`; default group is fine).
- **Video:** `canonical_seedance_2_0_omni_ref2v:v1` (multi-reference; 2–15 s; `resolution:"720p"`,
  `aspect_ratio:"1:1"`).
- **Multi-voice TTS:** `generate_audio_tts:v1` (ElevenLabs) or `vertex_tts_synthesize:v1` (Gemini) —
  a distinct voice per speaker; see `scripts/voices.md`.
- **Assembly:** `video_stitch:v1` (concat + transitions), `merge_audio_video:v1` (lay audio),
  `audio_stitch:v1` (join per-shot audio). LLM QC: `vertex_text_generate:v1` (Gemini, multimodal).
- Bundled `scripts/`: `parse_shotsheet.py`, `align_narration.py`, `google_inputs.md`,
  `continuity_rules.md`, `voices.md`, `blaze_dsl_templates.md`; bundled
  `assets/voiceover_MVS_FINN_ADULT_DE.mp3` (default single-narrator track for Audio Mode A).

## Working-dir & performance rules
Render/cut on local `/tmp`, copy out in chunks (mount is ~5–7 MB/s and a call is ~45 s). Background
jobs don't persist. Keep a **`progress.md`** manifest (workflow IDs, every clip/audio URL, per-shot
duration) so a dropped session is resumable; a workflow can show `failed` while some nodes succeeded —
read `node_outputs`. **Seedance floors at ~4 s** even when a shorter duration is requested; trim to
the target length locally.

---

# THE PIPELINE — sequential, gated

## Phase 0 — Parse & confirm
```bash
python3 scripts/parse_shotsheet.py --shots SHOTS.txt [--characters C.txt --locations L.txt] --json parsed.json
```
Build the ordered shot list sorted by Shot Number and **confirm the total count**. Read `format`
(aspect; force **1:1 / 720x720** regardless), any header `vo` link, and per shot: speaker, dialogue,
V.O. flag, lip-sync flag, char/loc refs, SFX, continuity note, VFX, and the verbatim Generation /
Animation / Action text. **Gate:** every shot has a Generation Prompt, an Animation Prompt and a
resolved Location reference; classify each character asset (`character` human → avatar; object /
creature / crowd → plain CDN URL). Prefer a canvas's resized URL over the original when names match.

## Phase 1 — Human faces → BytePlus avatars  ·  GATE: every human asset Active
`register_byteplus_asset:v1` per human face; poll to **Active**; store `asset://`. Raw photoreal faces
are rejected by the generator ("may contain a real person") AND the avatar locks the face across all
shots. Objects / crowds / locations stay plain CDN URLs. (Crowd plates of real-looking faces can also
trip the filter — prefer describing the crowd in the prompt.)

## Phase 2 — Audio  ·  GATE: every shot has a length + placed audio
**Default = Mode A** (use the user's bundled voiceover). Only use Mode B if the user explicitly asks
for per-character lip-sync.

**Mode A — bundled single narrator (DEFAULT, this skill's audio).** `ffprobe` the master
`assets/voiceover_MVS_FINN_ADULT_DE.mp3` (~43s). Because the sheet's shot lengths will NOT match the
audio, **align** it: run `python3 scripts/align_narration.py --audio assets/voiceover_MVS_FINN_ADULT_DE.mp3
--json parsed.json` to voice-activity-detect the spoken windows and map each shot to its beat, so the
picture sits on the narration. Each shot's length comes from its aligned window; lay the master track
over the whole cut in Phase 6; mouths stay prompt-driven (no per-character lip-sync). Record the
alignment in `progress.md`.

**Mode B — multi-voice TTS (per-character lip-sync; only on explicit request).** For each shot **with
dialogue or V.O.**, synthesize the exact line via `generate_audio_tts:v1` (input
`narration_texts:[{text}]` + `default_voice_id`; returns `audio_url` + `audio_duration_seconds` on the
reachable CDN). Assign a **fixed distinct voice per speaker** (Max, Finn, narrator) and reuse it. Read
the duration — **this sets the shot's length.** Silent shots get a ~2–3 s beat. **Lip-sync floor
(verified):** any clip you drive onto a mouth must be **≥1.8 s** — pad short lines. Record every audio
URL + duration. See `scripts/voices.md`.

## Phase 3 — Compile each shot's video prompt  ·  GATE: refs + continuity + no antislop
Assemble each prompt, verbatim where possible: a one-line **reference key** mapping `@Image1..N` to the
resolved refs in the exact order passed → the **Generation Prompt** (verbatim) → the **Animation
Prompt** (verbatim) → the shot's **Camera Angle/Movement**, **VFX**, **SFX** and **Continuity Note** →
the shared **continuity/eyeline/lip-sync/location/action directive block** and **negative library**
from `scripts/continuity_rules.md`. Keep characters as names + reference; never invent identity.
Lip-sync shots instruct accurate mouth movement to the shot's line; V.O. shots keep the mouth closed
except natural breathing. Add clickbait energy through composition/camera/lighting wording ONLY — never
change the scripted action, characters, or beats (HARD CONSTRAINT 6).

## Phase 4 — Generate & assemble PART BY PART (4 parts)  ·  GATE: each part complete + seam continuous
Work one **part (act)** at a time. For each part:
1. **Generate the part's shots** with `canonical_seedance_2_0_omni_ref2v:v1`, `resolution:"720p"`,
   `aspect_ratio:"1:1"`, `duration = clamp(ceil(shot_len), 2, 15)`, `image_urls` = the cited refs in
   order (`asset://` for humans), `generate_audio:false`. For lip-sync shots pass that shot's TTS clip
   in `audio_urls` and cite `@Audio1` (clip **≥1.8 s**; output is **silent** → mux later). Shots
   within a part may be generated **together (batched in one workflow)** — you no longer need to wait
   shot-by-shot — but the **first shot of parts 2–4 must reference the previous part's last frame**
   (part-seam rule). A failed node has no output and must be re-run (filter hit → use the avatar /
   reword + change `seed`). Harvest every URL into `progress.md`.
2. **Assemble the part:** trim each shot to its window, force 720x720, and stitch the part's shots
   **in order with transitions** (Phase 6 recipe) into `part_<k>.mp4` (video only for now).
3. **QC the part** (Phase 5) for internal continuity, then **QC the seam** to the previous part
   (last frame of part k-1 vs first frame of part k). Regenerate the boundary shot until continuous.
Only advance to the next part once the current part passes. Extract and save each part's **last frame**
for the next part's opening reference.

*(Why parts, not shots: fewer round-trips than one-at-a-time, while the part-seam frame reference +
eyeline bible preserve the continuity that pure parallel-all-21 would lose.)*

## Phase 5 — QC each shot AND each part-seam (Gemini)  ·  GATE: continuity + correctness
Upload each clip; `vertex_text_generate` (`gemini-2.5-pro`, `media_urls`) checks: identity locked to
reference, correct location/lighting, action matches the sheet beat, **eyeline & screen direction
continuous with the neighbour**, lip-sync matches the line (or mouth closed for V.O.), no on-screen
text, no artifacts. **Also QC each part-seam:** compare the last frame of part k-1 with the first frame
of part k for matching location, lighting, time-of-day, character look and screen direction.
PASS/WEAK/FAIL; regenerate the failing shot (and re-QC) until it passes.

## Phase 6 — Stitch the 4 PARTS into the final, lay audio  ·  GATE: final is 720x720, synced
Each `part_<k>.mp4` was built in Phase 4 by trimming shots to their windows (720x720) and joining them
**in order with transitions** — use the proven local-ffmpeg recipe: standardise every clip
(`trim=0:WIN,setpts=PTS-STARTPTS,fps=30,scale=720:720:force_original_aspect_ratio=increase,crop=720:720,setsar=1`),
then `xfade` chain (`transition=fade` dissolves, a `fadewhite` pop at the fire-ignition boundary, a
final `fade=t=out:color=white` on the close). Transition-aware windows: an N-clip xfade shortens total
by `(N-1)*T`, so windows sum to `audio_len + (N-1)*T`; cap the longest shots at their clip length and
scale the rest.
**Then stitch the 4 parts in order**, applying a transition at each part boundary too (a clean
dissolve, or a fire-wipe where the beat allows). Build the audio on the SAME timeline (multi-voice
`audio_stitch` / per-shot `acrossfade` in Mode B, or the aligned master narration in Mode A) and mux
(`-map 0:v -map 1:a -shortest`). See `scripts/blaze_dsl_templates.md` for the filter_complex generator.
Optionally burn subtitles. **Verify the final is exactly 720x720 / 1:1** (HARD CONSTRAINT 12) and the
total equals the audio. Whole-film Gemini QC → PASS.

## Phase 7 — Deliver
One full-length stitched `*_FINAL_video.mp4` at 720x720, plus the 4 `part_<k>.mp4` segments (+ optional
SRT, the compiled prompt sheet, the asset/voice registry, QC reports, resumable `progress.md`). Offer
levers: alternate hook opening, punchier transitions, different voices, a vertical 9:16 re-cut.

---

## Consolidated QC gates
| Phase | Gate |
|---|---|
| 0 Parse | Every shot has Generation + Animation prompt + resolved location; total count confirmed |
| 1 Avatars | Every human asset Active |
| 2 Audio | Correct distinct voice per speaker; line matches; duration recorded |
| 3 Prompts | Refs resolve in order; continuity block + negatives present; scripted action unchanged; no antislop |
| 4 Generate | Each part's shots return URLs; part assembled; **seam to previous part continuous** |
| 5 QC | Identity/location/lighting/action/eyeline/lip-sync/no-text per shot AND per part-seam |
| 6 Assembly | 4 parts stitched in order + transitions; audio synced; final is 720x720 |

## ffmpeg (sandbox; run on /tmp)
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 IN
# trim one clip to its audio length + force 720x720/30fps:
ffmpeg -nostdin -y -i raw.mp4 -an -vf "trim=0:DUR,setpts=PTS-STARTPTS,fps=30,scale=720:720:force_original_aspect_ratio=increase,crop=720:720,setsar=1" -c:v libx264 -pix_fmt yuv420p -crf 21 -preset veryfast v.mp4
# quick dissolve between two clips (xfade), else concat for hard cuts:
ffmpeg -nostdin -y -i a.mp4 -i b.mp4 -filter_complex "[0][1]xfade=transition=fade:duration=0.25:offset=OFF" x.mp4
# lay audio: ffmpeg -i silent.mp4 -i audio.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest final.mp4
```

## Gotchas → fixes
| Symptom | Cause | Fix |
|---|---|---|
| Face rejected "may contain a real person" | raw photoreal face | register a BytePlus avatar; pass `asset://` |
| Crowd plate rejected | real-looking faces in the plate | describe the crowd in the prompt instead |
| Clip is ~4 s but you set 2 s | Seedance ~4 s floor | trim to the shot's audio length in Phase 6 |
| Same voice for everyone | one TTS voice id | fix a distinct voice id per speaker; reuse per speaker |
| Eyeline/screen direction jumps | shots generated in isolation | add the continuity block + 180° screen directions per shot |
| Output not 720x720 | model returned another size | force scale/crop to 720x720 in Phase 6; verify |
| Drift between acts at a seam | parts generated independently | pass the previous part's last frame as a reference into the next part's first shot; QC the seam |
| Identity/light jumps within a part | no shared state across shots | keep avatars + refs + eyeline bible on every shot; regenerate the offender |

## Model map
Video → `canonical_seedance_2_0_omni_ref2v:v1` (720p, 1:1). Avatars → `register_byteplus_asset:v1`.
Voices → `generate_audio_tts:v1` / `vertex_tts_synthesize:v1`. QC → `gemini-2.5-pro`.

**Recap:** every arrow is a gate. Lock identity to references, give each speaker a distinct voice,
generate one 720x720 shot at a time in script order with the verbatim prompts + continuity block,
QC each, then stitch in order with transitions and lay the multi-voice audio. Produce →
self-evaluate → loop to 100% → advance.
