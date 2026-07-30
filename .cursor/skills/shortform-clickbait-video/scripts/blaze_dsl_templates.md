# Blaze DSL templates (copy-paste into `execute_blaze_workflow`)

> Load `get_skill("blaze-mcp-skill-basics")` once per session. Use `config.failure_policy:"fail_fast"`
> (an invalid policy value causes `validation_failed` with 0 nodes). Poll `get_blaze_workflow_status`;
> completed nodes carry outputs under `node_outputs` even if the workflow later `failed`. Check field
> names with `get_activity_schema` before first use. Reference `@ImageN` in the SAME order as `image_urls`.

## 1. Register a human face as a BytePlus avatar — Phase 1
```json
{"config":{"failure_policy":"fail_fast","timeout_seconds":1800},"dsl_version":"2.0","input":{},
 "nodes":{"reg":{"activity":"register_byteplus_asset:v1","input_map":{
    "image_url":"<face_cdn_url>","asset_name":"<show>-<char>-v1",
    "asset_group_id":"group-20260710135340-t2m7q"},"timeout":{"start_to_close_seconds":400}}},
 "output_map":{"asset_uri":"$.nodes.reg.output.asset_uri"}}
```
Returns `asset://<id>`. Objects / crowds / locations stay plain CDN URLs.

## 2. Multi-voice TTS for one shot — Phase 2 (distinct voice per speaker)
```json
{"config":{"failure_policy":"fail_fast"},"dsl_version":"2.0","input":{},
 "nodes":{"tts":{"activity":"generate_audio_tts:v1","input_map":{
    "text":"<exact line from Dialogue>","voice_id":"<voice for this speaker>","language":"de"},
    "timeout":{"start_to_close_seconds":300}}},
 "output_map":{"audio":"$.nodes.tts.output.audio_url"}}
```
`ffprobe` the audio → shot length. (Alt: `vertex_tts_synthesize:v1`.)

## 3. Generate ONE shot — Phase 4 (720x720; do the NEXT shot only after this verifies)
```json
{"config":{"failure_policy":"fail_fast","timeout_seconds":1200},"dsl_version":"2.0","input":{},
 "nodes":{"shot":{"activity":"canonical_seedance_2_0_omni_ref2v:v1","input_map":{
    "image_urls":["asset://<Max>","<book_url>","<location_url>"],
    "duration":<clamp(ceil(audio_sec),2,15)>,"resolution":"720p","aspect_ratio":"1:1",
    "generate_audio":false,
    "prompt":"Reference: @Image1 is <Name> (render face to this reference); @Image2 is <prop>; @Image3 is the <location>. <GENERATION PROMPT verbatim>. <ANIMATION PROMPT verbatim>. Camera: <Camera Angle>, <Camera Movement>. VFX: <VFX>. Continuity: <Continuity Note + shared continuity block + screen-direction/eyeline>. Negative: no subtitles, no on-screen text, no duplicated cast likenesses, no extreme eyeball close-up, no glowing eye, no glowing orb, no opening the sealed book, no identity drift."},
    "timeout":{"start_to_close_seconds":700}}},
 "output_map":{"video":"$.nodes.shot.output.videos[0].url"}}
```
**One shot per workflow, in Shot Number order.** Verify the URL before submitting the next
(HARD CONSTRAINT 10). Filter hit → use the avatar / reword + change `seed`.

## 3b. Generate a lip-sync shot (audio-driven, VERIFIED) — Phase 4
Pass the shot's TTS clip (≥1.8 s) in `audio_urls` and cite `@Audio1`. Output is SILENT (mux later).
```json
{"config":{"failure_policy":"fail_fast"},"dsl_version":"2.0","input":{},
 "nodes":{"shot":{"activity":"canonical_seedance_2_0_omni_ref2v:v1","input_map":{
    "image_urls":["asset://<Max>","<stone_url>"],
    "audio_urls":["<tts_clip_url_geq_1p8s>"],
    "duration":4,"resolution":"720p","aspect_ratio":"1:1","generate_audio":false,
    "prompt":"Reference key: @Image1 is <Name>; @Image2 is the <location>; @Audio1 is <Name>'s spoken line. <GENERATION verbatim>. <ANIMATION verbatim>. <Name>'s mouth, jaw and lips LIP-SYNC ACCURATELY to @Audio1, matching phonemes and timing. Continuity: <eyeline line>. Negative: no subtitles, no on-screen text, no identity drift."},
    "timeout":{"start_to_close_seconds":700}}},
 "output_map":{"video":"$.nodes.shot.output.videos[0].url"}}
```

## 3c. Scene-switching stitch (local ffmpeg xfade generator) — Phase 6
```python
# win[n] = transition-aware window (sum == audio_len + (N-1)*T). T=0.25
L=[win[n] for n in order]; T=0.25; fc=[]; prev="[0:v]"; run=L[0]
for i in range(1,len(L)):
    trans="fadewhite" if i==FIRE_IGNITION_BOUNDARY else "fade"
    fc.append(f"{prev}[{i}:v]xfade=transition={trans}:duration={T}:offset={run-T:.3f}[v{i}]")
    run=run+L[i]-T; prev=f"[v{i}]"
fc.append(f"{prev}fade=t=out:st={run-0.5:.3f}:d=0.5:color=white[vout]")
# ffmpeg -i x_01..x_N -filter_complex ";".join(fc) -map [vout] silent.mp4
# then: ffmpeg -i silent.mp4 -i audio.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -shortest final.mp4
```
Each input `x_NN.mp4` is pre-standardised to 720x720/30fps/SAR1 and trimmed to `win[n]`.

## 3d. Part-based generation + seam continuity (4-PART mode) — Phase 4
Generate each part's shots in ONE workflow (batched). For parts 2–4, first extract the previous part's
last frame and host it, then pass it as an extra reference into the part's FIRST shot:
```bash
# last frame of the previous part's final shot:
ffmpeg -nostdin -y -i part_prev_lastshot.mp4 -vf "select=eq(n\,0)" -vsync 0 -update 1 seam_prev.png
# host seam_prev.png (get_upload_url / your CDN) -> <seam_url>
```
```json
// first shot of the next part cites the seam frame as a continuity reference:
"image_urls":["asset://<char>","<...refs>","<seam_url>"],
"prompt":"... @Image<last> is the previous shot's final frame — match its lighting, wardrobe, time of day and screen direction exactly for a seamless continuation. ..."
```
Then assemble the part (xfade recipe in 3c), QC the part and the seam, and only then start the next part.

## 4. Per-shot QC (Gemini) — Phase 5
Upload the clip; `vertex_text_generate` `gemini-2.5-pro` with `media_urls`: identity locked, correct
location/lighting, action matches the beat, eyeline & screen direction continuous, lip-sync matches
(or mouth closed for V.O.), NO on-screen text, no artifacts. End with a VERDICT line; regenerate FAIL.

## 5. Stitch in order with transitions + lay audio — Phase 6
```json
{"config":{"failure_policy":"fail_fast"},"dsl_version":"2.0","input":{},
 "nodes":{
  "stitch":{"activity":"video_stitch:v1","input_map":{
     "video_urls":["<shot1>","<shot2>","..."],"transition":"<fade|cut>"},
     "timeout":{"start_to_close_seconds":600}},
  "voice":{"activity":"audio_stitch:v1","input_map":{"audio_urls":["<a1>","<a2>","..."]},
     "timeout":{"start_to_close_seconds":300}},
  "mux":{"activity":"merge_audio_video:v1","input_map":{
     "video_url":"$.nodes.stitch.output.video_url","audio_url":"$.nodes.voice.output.audio_url"},
     "depends_on":["stitch","voice"],"timeout":{"start_to_close_seconds":400}}},
 "output_map":{"final":"$.nodes.mux.output.video_url"}}
```
(Check each activity's schema for exact field names; some builds want `videos`/`clips` or a
per-boundary `transitions` array.) For frame-accurate transitions/trims, download the clips
(CloudFront outputs are reachable) and use local ffmpeg `xfade` + `concat`, then `merge_audio_video`.
Finish by verifying the final is **720x720**.
