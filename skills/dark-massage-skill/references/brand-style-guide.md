# Brand Style Guide

This guide defines the visual DNA that all product image prompts must inherit. When a new product is added to the system, its prompts must conform to this guide unless a product-specific override is explicitly documented.

---

## Overall Visual Direction

Clean, premium, realistic commercial product photography suitable for e-commerce product detail pages, hero banners, and paid advertising. The image must feel intentional and professionally produced, not like a casual snapshot or AI-generated placeholder.

---

## Background

### Preferred
- Clean studio background with subtle gradient (white to light gray, warm cream to soft beige)
- Light neutral tones: warm white, eggshell, pale gray, soft cream
- Subtle natural shadows grounding the product
- Uncluttered, distraction-free space
- Optional: minimal lifestyle context (a hint of marble, wood grain, or linen texture) when the product benefits from environmental grounding

### Avoid
- Busy lifestyle scenes unless explicitly requested for a specific campaign
- Excessive props that compete with the product
- Overly colorful or saturated backgrounds
- Cartoon, illustration, or 3D-render-style backgrounds
- Heavy vignettes or artificial blur that looks like a filter
- Text or graphics in the background

---

## Lighting

### Preferred
- Soft diffused studio lighting as the default
- Clear, natural highlight on product edges to define shape and silhouette
- Natural soft shadow directly under or slightly behind the product
- Premium glossy reflection on appropriate materials (glass, metal, polished plastic)
- Even illumination across the product face with gentle falloff at edges
- Single dominant light direction with subtle fill to preserve detail in shadows

### Avoid
- Harsh direct flash creating blown-out highlights
- Dramatic cinematic lighting with extreme contrast (unless product category demands it)
- Dark moody atmosphere (unless explicitly requested)
- Mixed color-temperature lighting (warm + cool simultaneously)
- Overhead-only light that flattens product depth
- Colored gels or unnatural light tints

---

## Product Presentation Standards

### Shape and Silhouette
- Product outline must be immediately readable
- Default angle: 3/4 front view showing top and one side for dimensional products
- Front-facing for flat products (packaging, labels, screens)
- No awkward cropping at product edges; leave breathing room

### Material and Texture
- Surface materials must read clearly and believably
- Fabric: visible weave or knit texture, natural drape
- Metal: realistic specular highlights, subtle reflection
- Plastic/matte: smooth without looking CGI
- Glass: clean transparency with edge refraction
- Wood/stone: visible grain or texture

### Color Accuracy
- Product colors must match the approved brand palette
- White balance must be neutral unless a warm/cool mood is specified
- No color casts that alter the product's actual hue
- Metallic and iridescent finishes must show accurate color shift

### Key Details
- Logos and branding must be legible and correctly placed
- Control panels, buttons, ports, and functional elements must be visible when relevant
- Scale cues (a hand, a common object, or dimension reference) should be present when size is a selling point

---

## Composition

### Preferred
- Vertical 3:4 or 4:5 aspect ratio as default for e-commerce
- Product occupies 60-80% of frame for hero shots
- Product occupies 40-60% for lifestyle-in-context shots
- Clean copy-safe space for e-commerce overlays (top 20% or side 20%)
- Rule of thirds or centered composition depending on use case

### Avoid
- Extreme close-ups that lose product context
- Wide shots where the product becomes a minor element
- Tilted or dutch-angle compositions (unless creative campaign)
- Crooked horizon lines or misaligned verticals

---

## Color Palette

### Default
Brand colors must be defined per product line. General guidance:

- Background: neutral warm tones (cream, eggshell, light gray)
- Shadows: warm brown or neutral gray, never cool blue
- Accent colors: only from brand-approved palette
- Product: accurate to physical sample

### Avoid
- Cool blue or teal shadows
- Overly warm yellow or orange ambient color
- Neon or highly saturated accent colors not in brand guide
- Clashing color combinations between product and background

---

## Realism Level

### Target
- Photorealistic commercial product photography
- Physically accurate materials and lighting
- Realistic depth of field (not artificial tilt-shift)
- Natural skin tones if hands or models are present
- No AI-smoothing artifacts, no plastic skin, no CGI uncanny valley

### Avoid
- Flat vector or illustrated look
- 3D render or CGI appearance
- Over-processed HDR look
- Smartphone portrait-mode style fake bokeh
- AI-generated mush texture on materials

---

## Commercial Use Case Mapping

| Use Case | Composition | Background | Product Size |
|---|---|---|---|
| Main listing image | Centered hero, clean studio | Pure white or light gradient | 70-80% of frame |
| Detail page banner | Lifestyle context, copy-safe space | Warm interior or studio | 50-60% of frame |
| Feature callout | Close-up macro on detail | Defocused neutral | Detail fills frame |
| Comparison / sizing | Dual-panel or with reference object | Clean studio | 40-60% each panel |
| Social / ad creative | Dynamic angle, more environment | Campaign-specific | 40-60% of frame |

---

## Negative Prompt Base

Apply these negatives to every prompt unless a product-specific override exists:

```
bright daylight, overexposed white background, harsh flash, cool blue shadows,
cartoon style, 3D render, CGI look, illustration, vector art,
plastic skin, AI-smoothing artifacts, fake bokeh, tilt-shift effect,
wrong product color, distorted product shape, missing logo,
cluttered background, busy lifestyle scene, excessive props,
text or watermark on image, low resolution, motion blur,
dutch angle, crooked horizon, extreme wide angle distortion
```

---

## Writing Strategy

When drafting prompts using this guide:

1. Lock the brand visual identity first (background, lighting, color palette)
2. Describe the product with measured accuracy (shape, material, color, details)
3. Set composition and framing for the intended use case
4. State the quality and realism target explicitly
5. Append the negative prompt base plus scene-specific negatives

Prompts should be structured as a stack of locks, not as loose descriptive paragraphs. Each lock controls one visual dimension and should not contradict another.

---

## Product-Specific Overrides

When a product category requires deviations from this guide, document them here:

| Product Line | Override | Reason |
|---|---|---|
| (example) Jewelry | Darker background, higher contrast lighting | Shows sparkle and metal detail |
| (example) Food | Warmer color temp, more lifestyle context | Appetite appeal |
| (example) Electronics | Cooler neutral background, sharper shadows | Precision and tech feel |

Add new rows when a product category has been approved for a style deviation.