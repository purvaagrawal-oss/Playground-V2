# Example Simple Screenplay Output

This is a reference example showing the correct output format. Follow this exactly. Do not add WPM headers, clip/shot durations, camera sizes, or cinematic prompt metadata.

---

Source prose input (for reference):

> Aria stood at the palace window, watching the storm gather over the mountains. The enchanted mirror on the table behind her began to glow. Kieran entered, rain-soaked, and stopped when he saw her face. "You promised me you would come back," she said, her voice barely above a whisper. "I tried. I always try," he replied. A thunder crack shook the walls. She crossed to him and took his hand.

---

## Correct output:

[SCENE: 1]

INT. PALACE CHAMBER - NIGHT

### Reference Contents

【Characters】
@AriaVoronBase corresponds to Aria Voron，only the appearance, hairstyle and clothing of the character are adopted.
@KieranMossBase corresponds to Kieran Moss，only the appearance, hairstyle and clothing of the character are adopted.

【Props】
@EnchantedMirrorProp corresponds to Enchanted Mirror，only the shape, scale, color, material, condition and identifying details of the prop are adopted.

【Scenes】
@PalaceChamberInteriorNight refers to Palace Chamber，only adopts the spatial layout, architecture and lighting from the reference image, excluding the characters and incidental foreground objects in the picture.

---

[MUSIC: brooding romantic orchestral underscore, low strings with sparse piano, building tension slowly through the scene]

@AriaVoronBase stands at the window of @PalaceChamberInteriorNight, gaze directed toward the mountains outside. @EnchantedMirrorProp rests face-up on the table behind her, its surface beginning to emit a soft glow.

[SFX: distant rumble of approaching storm]

The chamber door opens. @KieranMossBase enters, cloak soaked through, water dripping onto the stone floor. He stops just inside the doorway when he sees @AriaVoronBase.

ARIA: {You promised me you would come back.}

KIERAN: {I tried. I always try.}

[SFX: thunder crack, close and sharp, rattling the window glass]

@AriaVoronBase turns from the window and crosses to @KieranMossBase. She takes his rain-wet hand in both of hers, looking up at him.

---

## What this example shows

- Slug line uses standard `INT./EXT. LOCATION - TIME` format — not @TagID
- Reference Contents declares all @TagIDs used in action blocks, once per scene
- Action blocks use `@TagID` tokens but no camera language
- Dialogue is `CHARACTER NAME: {verbatim text}` — no emotional node, no delivery spec
- `[SFX:]` is inline at the exact story moment, not batched at the top
- `[MUSIC:]` opens the scene once and is not repeated per action block
- Base appearance (what @AriaVoronBase looks like) is not re-described in action text
