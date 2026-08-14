# Simple Screenplay Schema

This file is the exact schema authority. It wins every conflict.

## Hierarchy

```text
Script
└── Scene (N) — one active location
    ├── Slug Line — location + interior/exterior + time
    ├── Reference Contents — declared @TagID bindings for this scene
    ├── Action Block(s) — stage direction with @TagID tokens
    ├── Dialogue Line(s) — speaker + verbatim text
    └── SFX / Music Cues — inline sound and music markers
```

**Scene = one active primary location.** Start a new scene only when the location, time of day, or music state changes. A cutaway or reaction within the same location does not open a new scene.

---

## Final Output Schema

Use this exact order and wording for every scene.

```text
[SCENE: N]

INT./EXT. LOCATION NAME - TIME OF DAY

### Reference Contents

【Characters】
@CharacterTagID corresponds to Character Display Name，only the appearance, hairstyle and clothing of the character are adopted.

【Props】
@PropTagID corresponds to Prop Display Name，only the shape, scale, color, material, condition and identifying details of the prop are adopted.

【Scenes】
@LocationTagID refers to Location Display Name，only adopts the spatial layout, architecture and lighting from the reference image, excluding the characters and incidental foreground objects in the picture.

---

[MUSIC: music style, mood, instrumentation — played at scene open or when cue is story-driven]

Action block. @CharacterTagID enters and crosses to the window. Stage direction describes physical movement, placement, and visible story-driven state changes only. No camera language. No shot sizes. No base reference appearance re-described.

CHARACTER NAME: {Verbatim spoken text from source.}

[SFX: brief description of sound effect]

Action block continues as needed. @CharacterTagID picks up @PropTagID from the table, turning it over.

CHARACTER NAME: {Verbatim spoken line.}

SECOND CHARACTER NAME: {Verbatim reply.}

[MUSIC: music shift if story-driven]
```

---

## Field Rules

### Slug Line

- Format exactly: `INT. LOCATION NAME - TIME OF DAY` or `EXT. LOCATION NAME - TIME OF DAY`
- TIME OF DAY values: `DAY`, `NIGHT`, `DAWN`, `DUSK`, `CONTINUOUS`, `LATER`, `MOMENTS LATER`
- Location name is the human-readable scene name, not an @TagID
- Do not use @TagIDs in the slug line

### Reference Contents

- Declare only categories that are used in this scene
- Preserve category order: `【Characters】` → `【Props】` → `【Scenes】`
- Every `@TagID` used in action blocks must be declared here once per scene
- Characters: adopt appearance, hairstyle, and clothing only
- Props: adopt physical identity only; state owner when ownership matters
- Scenes: adopt spatial layout, architecture, and established lighting only; exclude characters and incidental objects visible in the reference
- Maximum nine visual references per scene, including the active location reference. Split large scenes when over cap.
- Do not include `【Audios】` — ordinary dialogue uses plain speaker name labels; SFX and music use inline `[SFX:]` and `[MUSIC:]` cues

### Action Blocks

- Plain prose stage directions. No shot sizes (no "close-up", "wide shot"). No camera movements (no "push in", "pan"). No cinematography language.
- Use `@TagID` tokens wherever a referenced character, prop, or location is named visually
- Describe only: physical placement, movement, orientation, gaze (story-motivated, never toward reader/camera), prop ownership and visible face/side, and story-driven state changes (injury, wetness, damage, costume change, opened/closed prop)
- Do not re-describe base appearance already supplied by reference images — use the `@TagID` token and describe only what changes or where they are
- Action blocks may appear before, between, or after dialogue lines
- A scene may have one or many action blocks as the story requires

### Dialogue Lines

- Format: `CHARACTER NAME: {verbatim source text}`
- Character name is ALL CAPS with no `@` prefix
- Spoken text inside `{...}` is exact source — no paraphrase, no grammar fix, no synonym, no omission
- No emotional node, no dialogue delivery spec, no parenthetical direction inside the dialogue line
- If a source line is very long, keep it in one dialogue line; do not split across lines unless the source itself has a natural break at a sentence boundary
- Do not invent new dialogue not present in the source

### SFX and Music Cues

- Format: `[SFX: brief description]` placed on its own line where the sound occurs in the story
- Format: `[MUSIC: style, mood, instrumentation, and any progression note]` placed on its own line at the start of a scene or when the music changes
- Music is placed once at scene open or at a story-driven cue change — do not repeat per action block
- SFX describes a concrete diegetic sound: footsteps, door slam, thunder, glass breaking, wind
- Both cues are inline — not grouped at the top or bottom of the scene

### Gaze Rule

- No character looks toward the reader or an implied camera
- Every gaze in action blocks is story-motivated and points toward another character, a prop, a location feature, or an explicit off-screen story point
- State gaze direction in action text when eyes are visible or gaze matters to continuity

---

## Hard Validations

- **S1 References:** no more than nine visual references declared per scene, including the active location
- **S2 Slug format:** every scene opens with a correctly formatted `INT./EXT. LOCATION - TIME` line
- **S3 Tag integrity:** every `@TagID` in action blocks is declared in Reference Contents for that scene; left-side tags are CamelCase; right-side display names are not forced into `@`; CC/reference display names preserved exactly
- **S4 Spoken-text lock:** every source dialogue line appears verbatim inside `{...}`, in source order, with no paraphrase, compression, grammar correction, synonym, or omission
- **S5 No camera language:** no shot sizes, camera movements, or cinematography terms in action blocks
- **S6 No timing:** no WPM, no clip duration, no shot duration in any field
- **S7 Gaze:** no direct-to-reader/camera gaze; every visible eyeline is story-motivated
- **S8 Cue placement:** `[SFX:]` and `[MUSIC:]` are inline and story-placed; music is not repeated per action block

---

## Safety Negatives

- No graphic gore; use reaction, sound, or aftermath in action descriptions
- No nudity beyond undergarment coverage in action descriptions
- No subtitles, overlays, or UI in action descriptions
