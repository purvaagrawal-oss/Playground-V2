// Deterministic mocked prompt "enhancement" for the prototype.
export function enhancePrompt(original: string, mode: 'image' | 'video'): string {
  const base = original.trim()
  if (!base) {
    return mode === 'image'
      ? 'A cinematic, richly detailed scene with dramatic lighting, shallow depth of field, and a strong emotional focal point, shot on a wide anamorphic lens.'
      : 'A cinematic short shot with smooth, motivated camera movement, natural subject motion, atmospheric depth and a clear emotional beat.'
  }
  const imageAdds =
    ', with cinematic lighting, rich atmospheric depth, refined color grading, detailed textures and a clear focal point'
  const videoAdds =
    ', with smooth motivated camera movement, natural subject motion, subtle environmental detail and a cohesive cinematic grade'
  const adds = mode === 'image' ? imageAdds : videoAdds
  // Avoid duplicating if it already looks enhanced.
  if (base.toLowerCase().includes('cinematic lighting') || base.toLowerCase().includes('camera movement')) {
    return base + ' — refined for stronger composition and mood.'
  }
  return base + adds + '.'
}
