# Reading the short-form screenplay sheet (Google Drive connector)

Load the Google Drive tools (deferred), extract the sheet ID from the URL
(`.../spreadsheets/d/<ID>/edit#gid=<tab>`), then:
```
Google Drive:read_file_content(fileId=<ID>)   # returns the populated tab as a Markdown pipe table
```
Save to `SHOTS.txt` and feed to `parse_shotsheet.py`. If a gid/tab is specified and the wrong tab
returns, re-read and state which tab you used.

## Column map (order-tolerant; the parser matches by header name)
A small header block holds `Total Runtime (sec)` and `Format` (the aspect, e.g. `1:1`). The shot
table header row contains `Shot Number` and:

| Column | Meaning | Use |
|---|---|---|
| Shot Number | sequence order | sort ascending; drives strict generation order |
| (blank) | unused | ignore |
| Camera Angle | shot size / framing | append to the video prompt |
| Camera Movement | camera move | append to the video prompt |
| Dialogue | `SPEAKER: line` or `SPEAKER (V.O.): line` | speaker → voice id; line → TTS + lip-sync |
| Character Reference | names + CDN URLs | resolve refs; humans → BytePlus avatar |
| Location Reference | name + CDN URL | lock the setting |
| SFX / Audio Cue | sound design note | optional audio layer / prompt flavor |
| Continuity Notes | per-shot continuity | append to the continuity block |
| VFX | visual effects | append to the video prompt + informs the transition |
| Generation Prompt | the still/visual description | **use verbatim** as the prompt core |
| Animation Prompt | motion + camera + lip-sync note | **use verbatim** |
| Action | plain-language beat | sanity-check the generated action matches |

**Voiceover link:** a master voiceover URL may sit in the **header of the last column** as
`vo: https://drive.google.com/file/d/<ID>/view`. The parser extracts it as `vo_url`. Note a private
Drive file cannot be fetched into the sandbox directly (Drive redirects to `drive.usercontent.google.com`,
which is usually off-allowlist) — ask the user to upload the file, or generate multi-voice TTS instead
(the default for this skill).

## Parsing quirks
- **No per-shot Duration column** — set each shot's length from its generated audio (Phase 2).
- Location names may carry an unclosed `(EXTERIOR` / `(INTERIOR`; match on the normalized prefix.
- Reference cells inline names AND URLs and may repeat a URL; keep every URL, prefer a canvas's
  resized URL when a name matches a canvas asset.
- Speaker detection: `MAX:` → speaker MAX (lip-sync); `FINN (V.O.):` → V.O. (mouth closed).

## Reference-order rule
Cite `@Image1/@Image2/...` in the SAME order you pass them in `image_urls`; build the one-line
reference key from that same ordered list so citation and array never drift.
