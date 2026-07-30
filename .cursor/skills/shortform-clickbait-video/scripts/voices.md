# Multi-voice narration (HARD CONSTRAINT 11: different voices per character)

Goal: each speaking character has a FIXED, DISTINCT voice, reused across every shot; V.O. narrator is
its own voice. Respect punctuation and dialogue breaks so pacing is natural.

## Steps
1. From `parsed.json`, collect the distinct `speaker` values (e.g. MAX, FINN) and note which lines are
   V.O. (narrator) vs in-scene (character).
2. Assign one voice id per speaker up front and keep a registry (`speaker → voice_id`). Pick contrasting
   voices (e.g. Max = harder/older male; Finn = younger male; Narrator = warm reflective adult).
   Confirm available voices/params first: `get_activity_schema("generate_audio_tts:v1")` (and/or
   `vertex_tts_synthesize:v1`).
3. Synthesize each shot's line with its speaker's voice. `ffprobe` the returned audio → that duration
   sets the shot length (Phase 2). Cache audio URL + duration in `progress.md`.
4. Silent shots (no dialogue/VO): no TTS; give a short beat length (~2–3 s) from the Animation Prompt.
5. If the sheet instead supplies ONE master `vo` track (header link), use it as the spine and align
   per-shot windows to it (transcribe for timestamps if the sheet durations don't match the audio).

## VERIFIED mechanics (from real runs)
- `generate_audio_tts:v1` input is `narration_texts: [{text}]` + a required `default_voice_id`
  (ElevenLabs voice id, e.g. `pNInz6obpgDQGcFmaJgB`). Output: `audio_url` (on the reachable
  CloudFront CDN) + `audio_duration_seconds`. Cost ≈ $0.002–0.007 per short line.
- **Audio-driven lip-sync floor:** the driving audio must be **≥1.8 s** or Seedance rejects it
  ("audio duration ... must be greater than or equal to 1.8"). Pad short single-word lines (add a
  trailing beat/breath) to clear 1.8 s.
- The lip-synced video returns **silent** — the audio only drives the mouth. Lay the same clip's audio
  back with `merge_audio_video` / ffmpeg in Phase 6.
- Give each speaker a **different `default_voice_id`** and reuse it; the narrator/V.O. gets its own.

## Blaze TTS nodes (check the live schema for exact field names)
```json
// ElevenLabs multi-voice
{"activity":"generate_audio_tts:v1","input_map":{
   "text":"Ich verbrenn es.","voice_id":"<max_voice_id>","language":"de"}}
// Gemini TTS alternative
{"activity":"vertex_tts_synthesize:v1","input_map":{
   "prompt":"Say in a cold, cruel tone: Ich verbrenn es.","voice_name":"<prebuilt_voice>"}}
```
Output is an audio URL; `output_map` it and record the duration.

## Note
Do NOT drive Seedance lip-sync from a single narrator track for multiple characters — it desyncs.
For genuine per-character audio-driven lip-sync, generate each character's line in that character's
own voice (above) and, if the video model exposes an audio/lip-sync input, pass that per-shot clip;
otherwise rely on prompt-driven mouth movement and lay the multi-voice audio in the edit.
