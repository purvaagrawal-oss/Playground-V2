# Simple Screenplay Instructions

Use after loading `simple-screenplay-schema.md`. This file covers tagging, entity management, action writing, and SFX/music placement. Schema wins every conflict.

## 1 Tags and references

- Generated tag IDs: CamelCase, no spaces, no punctuation — `FirstnameLastnameBase`, `LocationRoomInteriorDayNight`, `ObjectNameProp`
- CC/reference display names: preserve exact spelling after the binding operator, no forced `@`
- Characters: one tag per base look. New visible look (costume change, injury, temporal era) = new variant tag
- Props: one tag unless physical appearance changes. Use parent prop tag for any visible detail/component unless it physically separates into an independent standalone object
- Locations: one tag per scene location. Tag includes interior/exterior and time descriptor: `@PalaceThronroomInteriorNight`
- Variant tag triggers: Era insert (flashback/flash-forward), age/time-skip, permanent state change, non-temporal costume/look change
- Max nine visual references per scene including the active location tag. If a scene has more, split into two scene blocks

### Tagging formula quick reference

```text
Character base:        FirstnameLastnameBase          → @AriaVoronBase
Location interior:     PlaceRoomInteriorDayNight       → @PalaceThroneRoomInteriorNight
Location exterior:     PlaceContextExteriorDayNight    → @VillageMarketExteriorDay
Prop:                  ObjectNameProp                  → @EnchantedMirrorProp
Era variant:           FirstnameLastnameEraRole        → @AriaVoronChildhoodBase
State variant:         FirstnameLastnameScarredBase    → @AriaVoronScarredBase
Costume variant:       FirstnameLastnameGalaBase       → @AriaVoronGalaBase
```

### Final binding line

```text
@AriaVoronBase corresponds to Aria Voron，only the appearance, hairstyle and clothing of the character are adopted.
@PalaceThroneRoomInteriorNight refers to Palace Throne Room，only adopts the spatial layout, architecture and lighting from the reference image, excluding the characters and incidental foreground objects in the picture.
@EnchantedMirrorProp corresponds to Enchanted Mirror，only the shape, scale, color, material, condition and identifying details of the prop are adopted.
```

Left side: `@TagID` renderer token. Right side: human display name. No `@` on the right side unless the user's supplied name literally contains one.

## 2 Action writing

Action blocks describe what the audience would see — physical story, not camera instructions.

**Write:**
- Where characters are and how they move: `@AriaVoronBase crosses to the window and places both hands on the sill.`
- Gaze direction (story-motivated): `@AriaVoronBase looks toward @EnchantedMirrorProp.`
- Prop ownership and visible face/side: `@AriaVoronBase holds @EnchantedMirrorProp face-up in her palm.`
- Story-driven state changes: `@AriaVoronBase's cloak is torn at the shoulder, mud-stained from the road.`
- Environmental changes: `Rain begins to fall outside the window, streaking the glass.`

**Do not write:**
- Shot sizes: ~~`Close-up on @AriaVoronBase.`~~
- Camera movement: ~~`The camera pushes in as she speaks.`~~
- Base appearance already in the reference image: ~~`@AriaVoronBase, with her dark hair and silver gown, stands at the window.`~~ → just `@AriaVoronBase stands at the window.`
- Direct address: ~~`She looks at us.`~~

Action blocks continue from wherever the last action left off. Carry position, prop ownership, costume condition, and gaze forward until the story changes them.

## 3 Dialogue

Dialogue is the simplest field in this format.

```text
ARIA: {You promised me you would come back.}

KIERAN: {I tried. I always try.}
```

Rules:
- Character name ALL CAPS, no `@`
- Text inside `{...}` is verbatim source — copy it exactly
- No parentheticals inside the dialogue line
- Source dialogue that continues in an action-then-speech rhythm keeps that rhythm: action block, then dialogue, then next action block

## 4 SFX and Music cues

### Music

- Place `[MUSIC: ...]` on its own line at scene open, or wherever the music state changes in the story
- Describe: style, mood, instrumentation, and any arc or progression note
- Do not repeat inside action blocks unless the music actually changes

```text
[MUSIC: tense orchestral underscore, low strings and sparse piano, building quietly through the scene]
```

### SFX

- Place `[SFX: ...]` on its own line at the exact moment the sound occurs
- Describe the concrete diegetic sound concisely

```text
[SFX: heavy wooden doors slamming shut]
[SFX: distant thunder rolling]
[SFX: glass shattering on stone floor]
```

## 5 Continuity

- Carry character position, gaze, prop ownership, costume condition, and prop state (open/closed/flipped/turned) across action blocks within a scene
- When a prop changes owner, note the transfer in action text and carry forward from that moment
- When a visible state change occurs (injury, wetness, costume change), carry it through every following action block in the scene and into subsequent scenes unless the source reverses it
- Location architecture, lighting, and layout come from the reference image — action blocks do not re-describe them

## 6 Scene boundaries

- New scene = location change, time-of-day change, or music state change
- Cutaway/reaction within the same location is an action block, not a new scene
- Every new scene gets a fresh slug line, fresh Reference Contents (re-declare all tags used in that scene), and a `[MUSIC:]` cue if the music is set or changes

## 7 Genre tonal guidance

Apply these tonal notes in action writing and SFX/music cue language:

| Genre | Action tone | Music palette |
|---|---|---|
| Romance Drama | Intimate, emotionally specific physical cues | Strings, piano, quiet dynamics |
| Fantasy | Heightened physical scale, magic state changes | Orchestral, choir, sweeping dynamics |
| Romantasy | Blend of emotional intimacy and fantastical scale | Orchestral with romantic lead instruments |
