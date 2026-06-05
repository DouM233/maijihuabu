# Prompt Output Template

Use this template to structure every standardized image-generation prompt. Fill all applicable fields. Mark fields as N/A only when the product category or use case genuinely does not require them.

---

## Output Structure

```
[PROMPT START]

## Product Analysis Summary
- Category: [product_category]
- Shape: [silhouette_description]
- Material: [primary_materials]
- Color: [exact_colors_with_hex_if_available]
- Texture: [surface_texture_description]
- Key Details: [logos / buttons / ports / functional_elements]

## Visual Style Reference
- Camera Angle: [angle]
- Lighting Direction: [direction_and_quality]
- Background: [background_type_and_color]
- Composition: [framing_and_aspect_ratio]
- Shadow Style: [shadow_type_and_direction]
- Color Palette: [primary_colors]
- Realism Level: [photorealistic / hyperreal / lifestyle]
- Commercial Use Case: [main_image / detail_page / banner / social / comparison]

## Generated Prompt

[FULL_PROMPT_TEXT]

## Negative Prompt

[NEGATIVE_PROMPT_TEXT]

## Consistency Check

- [ ] Product shape matches reference image
- [ ] Material description matches reference image
- [ ] Color description matches reference image
- [ ] Brand style guide compliance verified
- [ ] Negative prompt covers all known failure modes
- [ ] No conflicting instructions in prompt

[PROMPT END]
```

---

## Field Definitions

### Product Analysis Summary

| Field | Description | Example |
|---|---|---|
| Category | Product type in 1-3 words | Wireless Earbuds, Face Cream Jar, Ergonomic Chair |
| Shape | Overall silhouette and defining geometry | Compact rounded rectangle, cylindrical with tapered cap, bow-tie hourglass |
| Material | Primary visible materials, most dominant first | Matte plastic + silicone ear tips, frosted glass + aluminum cap, memory foam + breathable mesh |
| Color | Exact colors with hex codes when available | Space Gray #535150, Mint Green #B8D4B8, Rose Gold #B76E79 |
| Texture | Surface quality description | Smooth matte finish, visible knit pattern, brushed metal grain |
| Key Details | All functional and branding elements visible | Logo centered on front, LED indicator, USB-C port on bottom, control panel with 6 buttons |

### Visual Style Reference

| Field | Options / Format |
|---|---|
| Camera Angle | eye-level / 3/4 front-top / 3/4 front-side / front-facing / high-angle / low-angle / macro close-up |
| Lighting Direction | top-left soft diffused / right-side key + left fill / backlit with front fill / three-point studio / natural window light from [direction] |
| Background | pure white studio / warm cream gradient / light gray seamless / dark moody studio / lifestyle [describe context] |
| Composition | centered hero / rule-of-thirds [describe anchor] / copy-safe top 20% / dual-panel split / macro detail |
| Shadow Style | soft contact shadow under product / directional cast shadow to [direction] / natural ambient occlusion / no visible shadow (floating on white) |
| Color Palette | list primary colors: background, product, accent |
| Realism Level | photorealistic commercial / hyperreal macro / lifestyle contextual |
| Commercial Use Case | main listing image / detail page banner / feature callout / comparison chart / social media creative / advertising KV |

### Generated Prompt

The prompt should be a single continuous block of text suitable for pasting into an image generation platform. Structure it internally as a stack of locks:

1. **Global Tone Lock** — set the visual mood, quality level, and realism target
2. **Product Block** — describe product category, shape, material, color, texture, key details
3. **Composition Block** — set camera angle, framing, aspect ratio, product size in frame
4. **Lighting Block** — describe light direction, quality, shadow behavior
5. **Background Block** — describe background type, color, and any contextual elements
6. **Quality Lock** — reinforce photorealism, texture accuracy, and campaign readiness

Example prompt structure:

```
[quality_prefix], commercial product photography of a [product_description]. [material_detail]. [color_detail]. [key_details]. [camera_angle], [composition], [aspect_ratio]. [lighting_description]. [background_description]. [quality_suffix].
```

### Negative Prompt

Must include:
1. The base negative prompt from `brand-style-guide.md`
2. Scene-specific negatives targeting the current product's known failure modes
3. Product-specific negatives (wrong shape, wrong material, missing details)

Format as a comma-separated list or short paragraph depending on platform requirements.

### Consistency Check

Run this checklist against every generated prompt before delivering to the user:

| Check | Pass Condition |
|---|---|
| Shape | Prompt describes the same silhouette as the reference image |
| Material | Prompt uses the correct material terms, not generic "plastic" or "fabric" |
| Color | Prompt uses exact or very close color descriptors matching reference |
| Brand compliance | Prompt follows background, lighting, composition rules from brand style guide |
| Negatives | Negative prompt blocks all known failure modes for this product category |
| No conflicts | No two parts of the prompt give contradictory instructions (e.g. "soft shadow" and "harsh lighting" in same prompt) |

---

## Output Examples

### Example 1: Wireless Earbuds (Hero Shot)

```
[PROMPT START]

## Product Analysis Summary
- Category: Wireless Earbuds
- Shape: Compact pebble-shaped charging case + two stem-style earbuds
- Material: Matte plastic case + glossy touch-sensitive stems + silicone ear tips
- Color: Midnight Black case #1A1A1A, Matte Black stems, dark gray silicone tips
- Texture: Smooth matte finish on case, subtle metallic sheen on stems
- Key Details: Brand logo embossed on case front, LED indicator, USB-C port, L/R markings on earbuds

## Visual Style Reference
- Camera Angle: 3/4 front-top (case open, earbuds positioned beside)
- Lighting Direction: Top-left soft diffused key + right-side subtle fill
- Background: Warm cream gradient, seamless studio
- Composition: Centered hero, product occupies 70% of frame, copy-safe top 20%
- Shadow Style: Soft contact shadow directly below, subtle directional shadow to bottom-right
- Color Palette: Warm cream #F5F0EB background, black product, subtle warm gray shadows
- Realism Level: Photorealistic commercial
- Commercial Use Case: Main listing image

## Generated Prompt

8K RAW photorealistic commercial product photography, studio shot. A pair of wireless earbuds with a pebble-shaped matte charging case, Midnight Black color, smooth matte finish, embossed brand logo centered on the case front. Two stem-style earbuds with glossy touch-sensitive stems and dark gray silicone ear tips positioned beside the open case, L/R markings clearly visible. LED indicator on case front, USB-C charging port visible on case bottom edge. 3/4 front-top camera angle, centered hero composition, product occupies 70 percent of frame, vertical 4:5 aspect ratio, copy-safe space in top 20 percent. Soft diffused studio lighting from top-left with subtle fill from right, bright even illumination on product face, soft contact shadow directly under the product with gentle directional shadow to bottom-right. Warm cream seamless studio background with subtle gradient. Physically accurate materials, realistic matte and glossy surface differentiation, natural depth of field, print-campaign ready.

## Negative Prompt

bright daylight, overexposed white background, harsh flash, cool blue shadows, cartoon style, 3D render, CGI look, illustration, vector art, plastic skin, AI-smoothing artifacts, fake bokeh, wrong product color, distorted earbud shape, missing logo, missing LED indicator, cluttered background, excessive props, text or watermark, low resolution, motion blur, dutch angle, crooked horizon, white or silver case, wired earbuds, over-ear headphones

## Consistency Check

- [x] Product shape matches reference image
- [x] Material description matches reference image
- [x] Color description matches reference image
- [x] Brand style guide compliance verified
- [x] Negative prompt covers all known failure modes
- [x] No conflicting instructions in prompt

[PROMPT END]
```

### Example 2: Face Cream Jar (Detail Page Banner)

```
[PROMPT START]

## Product Analysis Summary
- Category: Face Cream Jar
- Shape: Cylindrical jar with rounded shoulders and a disc-shaped twist-off cap
- Material: Frosted glass jar + polished aluminum cap + white plastic inner lid
- Color: Frosted white glass, silver aluminum cap #C0C0C0, cream product visible inside
- Texture: Matte frosted glass surface, mirror-polished cap with subtle circular brushing
- Key Details: Brand logo laser-etched on jar front, product visible through frosted glass, 50ml capacity

## Visual Style Reference
- Camera Angle: 3/4 front-side at slight low angle
- Lighting Direction: Soft diffused from left-back with large front fill
- Background: Warm cream with subtle marble texture hint, lifestyle context
- Composition: Rule-of-thirds, jar on right, copy-safe space on left 40%
- Shadow Style: Soft contact shadow with warm ambient occlusion at base
- Color Palette: Cream #F5F0EB background, white/silver product, warm beige shadow
- Realism Level: Photorealistic commercial with lifestyle touch
- Commercial Use Case: Detail page banner

## Generated Prompt

8K RAW photorealistic commercial product photography. A 50ml face cream jar with a cylindrical frosted glass body and polished silver aluminum twist-off cap, brand logo laser-etched on the jar front, cream product subtly visible through the frosted glass. The cap shows subtle circular brushing texture with clean specular highlights. Jar placed on a warm cream surface with a subtle natural marble texture. 3/4 front-side camera angle at a slight low angle to emphasize the jar's height, rule-of-thirds composition with the jar occupying the right 60 percent, clean copy-safe space on the left 40 percent, vertical 4:5 aspect ratio. Soft diffused studio lighting from left-back creating a gentle rim light on the glass edge, large front fill for even illumination, warm ambient occlusion shadow at the jar base. Premium skincare product photography, natural depth of field with background softly out of focus, physically accurate glass refraction and metal reflection.

## Negative Prompt

bright daylight, overexposed white background, harsh flash, cool blue shadows, cartoon style, 3D render, CGI look, illustration, vector art, plastic jar, clear glass (not frosted), plastic cap (not metal), missing logo, wrong jar shape, square jar, pump bottle, tube packaging, cluttered background, busy lifestyle scene, flowers or plants as props, text or watermark, low resolution, motion blur, dutch angle

## Consistency Check

- [x] Product shape matches reference image
- [x] Material description matches reference image
- [x] Color description matches reference image
- [x] Brand style guide compliance verified
- [x] Negative prompt covers all known failure modes
- [x] No conflicting instructions in prompt

[PROMPT END]
```

---

## Platform-Specific Notes

Add platform-specific formatting rules here as they are discovered during testing:

| Platform | Format Requirement | Example |
|---|---|---|
| Midjourney | Parameters after `--`, aspect ratio as `--ar 4:5` | `--ar 4:5 --style raw --v 6.1` |
| Stable Diffusion | Comma-separated tags, negative in separate field | `(masterpiece, best quality:1.2), product photography` |
| DALL-E | Natural language, avoid negative instructions | Rewrite negatives as positive constraints |
| Firefly | Separate prompt and negative prompt fields | Use their UI fields directly |

Add more rows as new platforms are tested.

---

## Quick Reference Card

```
PROMPT = QUALITY_LOCK + PRODUCT_BLOCK + COMPOSITION_BLOCK + LIGHTING_BLOCK + BACKGROUND_BLOCK + QUALITY_SUFFIX
NEGATIVE = BASE_NEGATIVES + SCENE_NEGATIVES + PRODUCT_NEGATIVES
```

When time is limited, use this minimal structure:

```
[Quality prefix], [camera angle] commercial shot of [product with key details]. [Material and color]. [Lighting]. [Background]. [Aspect ratio]. [Quality suffix].
```