# Susan Drew Betrayal — Short-Form Screenplay

Clickbait short-form shot sheet generated with the `shortform-clickbait-video` skill from the Susan/Jacob/Sophia betrayal script.

## Files
| File | Purpose |
|---|---|
| `SHOTS.md` | Full screenplay shot sheet (readable) + eyeline bible + 4-part plan |
| `SHOTS.txt` | Parser-ready pipe table for `parse_shotsheet.py` |
| `CHARACTERS.md` | Character canvas (SusanBase, SusanTrenchCoat, SophiaShirt, Jacob, Ethan) |
| `LOCATIONS.md` | Location canvas (Driveway, Hallway, Study Doorway, Study Corner, City) |
| `parsed.json` | Validated parse output (21 shots, QC PASS) |

## Structure (21 shots / 4 parts)
1. **Hook & Arrival (1–5)** — cold-open VO → Ethan tease → “I'm Susan Drew” → driveway arrival  
2. **Into the House (6–10)** — trench surprise → hallway fantasy → hears a woman  
3. **The Reveal (11–16)** — peek → Sophia on Jacob's lap → “wish she'd never come back” → “that idiot”  
4. **The Shares Bomb (17–21)** — dump Susan → 80% shares → kiss → Susan collapses  

## To render with Blaze (skill Phases 1–7)
1. Add reference image CDN URLs to `CHARACTERS.md` / `LOCATIONS.md`  
2. Re-run `parse_shotsheet.py`  
3. Register humans as BytePlus avatars  
4. Prefer **Mode B multi-voice TTS** (Sophia/Jacob lip-sync; Susan mostly V.O.)  
5. Generate Seedance 2.0 @ 720×720 in 4 parts → seam QC → stitch  

```bash
python3 .cursor/skills/shortform-clickbait-video/scripts/parse_shotsheet.py \
  --shots screenplays/susan-betrayal/SHOTS.txt \
  --characters screenplays/susan-betrayal/CHARACTERS.md \
  --locations screenplays/susan-betrayal/LOCATIONS.md \
  --json screenplays/susan-betrayal/parsed.json
```
