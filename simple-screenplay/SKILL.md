---
name: simple-screenplay
description: >-
  Converts a prose script into a simple screenplay format with location slug lines, tagged action, speaker dialogue, and SFX/music cues. Output is consumed by image generators (e.g. Midjourney) and TTS/audio tools as separate pipelines — not a video renderer. Use whenever the user provides a story, script, narration draft, or Character Canvas and asks for a simple screenplay, tagged script, or audio-image production script. Requires Genre before work begins. Supported genres are Romance Drama, Fantasy, and Romantasy. If Genre is missing, ask before proceeding.
---

# Simple Screenplay Creator

Convert a prose script into a production-ready simple screenplay. The output feeds two parallel pipelines: an **image generator** (for action/scene frames) and a **TTS/audio tool** (for dialogue and SFX). Keep the schema exact. Do not add timing, WPM, clip headers, shot sizes, or camera language.

## Required inputs

| Input | Required | Allowed |
|---|---:|---|
| Source script | Yes | text, md, docx, pasted prose |
| Genre | Yes | `Romance Drama` / `Fantasy` / `Romantasy` |
| Character Canvas / CC | Optional | csv/xlsx/text reference list |

**Gate:** If Genre is missing, stop and ask. Do not infer. Do not default.

## Load order

Always load:

1. `references/simple-screenplay-schema.md` — exact output schema. Wins every conflict.
2. `references/simple-screenplay-instructions.md` — tagging rules and production guidance.

## Pipeline

1. **Gate.** Confirm Genre and source script.
2. **Resolve.** Extract character and location tags from source. Resolve against CC if provided. Stop for unresolved CC tags.
3. **Map.** Build entity list: characters, locations, key props, SFX/music cues.
4. **Write.** Follow schema exactly: slug line → action block → dialogue lines → SFX/music cues, scene by scene.
5. **Audit.** Verify every @TagID is declared in Reference Contents; every dialogue line is verbatim source; every slug line is correctly formatted; every SFX/music cue is placed correctly.

## Output contract

- No WPM, no clip headers, no shot durations, no camera sizes or movements.
- Action lines use plain stage directions with `@TagID` tokens — no shot size, no camera movement.
- Dialogue is: `CHARACTER NAME: {verbatim source text}` — no emotional node, no delivery spec.
- SFX and music cues use `[SFX: description]` and `[MUSIC: description]` inline in the scene.
- Spoken text inside `{...}` is source-verbatim only.
