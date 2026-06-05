# Review and Iteration

Use this guide when the user shares generated images and wants to test or improve prompts.

## Review Order

1. Style stability
2. Product readability
3. Selling-point clarity
4. Platform-specific drift
5. Smallest useful correction

## Style Stability

Mark the style as stable when most of these are true:
- The image stays low-key, warm, amber, and premium.
- The environment stays in caramel, walnut, beige, toffee, and warm lamp tones.
- The product remains mint or sage green with dark green accents.
- The image feels like ecommerce lifestyle photography, not a bright catalog render.

If style is stable, do not rewrite the whole prompt. Preserve the tone block and only adjust the failing detail.

## Product Readability

Product readability is partly prompt-dependent and partly platform-dependent.

Keep the product rules in the prompt, but do not assume every visibility miss means the base template is broken. Some image platforms compress product shape, crop edges, or over-prioritize the face and body even when prompt wording is correct.

Useful second-pass corrections:
- "Product is one of the two main subjects, not a background prop."
- "Keep the full outer contour readable."
- "Do not crop the left or right wing."
- "Keep at least [55-70%] of the product visible."
- "Separate the product edge from the sofa and body with visible dark green piping."
- "Place the control panel on the camera-facing side."

Avoid adding too many visibility rules at once. Over-constraining can make poses stiff or reduce lifestyle quality.

## Selling-Point Clarity

Assess whether the image communicates the intended claim quickly.

Common claims:
- Lumbar support: back-to-product contact, no floating gap, believable compression.
- Neck heat: both pillow wings visible, heat located on both sides of the neck below the jawline, no neon effect.
- Material rebound: hand indentation, fabric texture, product thickness, realistic surface deformation.
- Parent-child relief: emotional eye contact plus visible support product.
- Office relief: end-of-day posture, relaxed shoulders, product at lower back.

If the selling point reads clearly, keep the feature language stable and only polish composition or product visibility.

## Platform Drift Notes

When a generation platform repeatedly changes a detail, use platform-adapter wording:
- For platforms that crop aggressively: request "medium shot with extra margin around the product."
- For platforms that hide the product behind the body: request "camera-facing exposed side of the product remains visible."
- For platforms that exaggerate heat glow: request "subtle warm orange-red glow, realistic reflected light, not neon."
- For platforms that flatten product shape: request "thick plush 8-10 cm depth, visible curved side seam, dark piping defining silhouette."
- For platforms that beautify too much: request "natural skin texture, no AI smoothing, realistic fabric wrinkles."

## Correction Prompt Pattern

Use this pattern for second-pass edits:

```text
Keep the current dark warm premium lifestyle style.
Only improve [specific issue].
Do not change [working elements].
Correction: [one to three concrete constraints].
Negative: [targeted failure words only].
```

Example:

```text
Keep the current warm dark lamp-lit neck massage scene and relaxed facial expression.
Only improve product readability and heat placement.
Do not change the caramel sofa, satin outfit, or premium low-key lighting.
Correction: show both left and right pillow wings fully, keep the dark green piping clearly separating the product from the sofa, place the soft orange-red heat glow on both sides of the neck below the jawline.
Negative: cropped pillow, hidden product, neon glow, heat under the throat, flat cushion.
```

## Full Prompt Merge Pattern

When the platform agent accepts correction notes and rewrites the complete prompt, preserve the full prompt structure. Merge only the correction into the affected blocks.

Keep these blocks stable:
- Global atmosphere lock
- Scene positioning
- Model identity
- Environment
- Lighting
- Quality lock

Edit these blocks when needed:
- Action and body orientation
- Product placement and visibility
- Heat or function effect
- Composition and crop margin
- Targeted negative prompt

Good merge behavior:
- Keep the original dark warm lamp-lit style and successful subject pose.
- Add correction language near the matching block, not as an isolated paragraph at the end.
- Repeat the most important hard rule in one place only unless the platform needs emphasis.
- Keep negative prompts targeted; combine duplicates after merging.

Avoid:
- Rewriting the whole scene after a small correction.
- Adding multiple competing camera directions.
- Mixing glow styles in the same prompt unless the user is testing variants.
- Letting correction notes override stable elements that already worked.

## Neck Heat Glow Variants

Use one heat-glow style per generation.

### Soft Realistic Glow

Best for premium lifestyle pages.

```text
热敷光只出现在下颌下方左右两侧颈部，柔和红橙色真实反光，不要扩散成大面积霓虹。发光必须柔和、温暖、真实，像产品热敷产生的局部暖光。
```

### Controlled Ring Effect

Best for function explanation images when the user wants a clearer sell point.

```text
颈部左右两侧出现控制过的红橙色同心圆热感标识，位置在下颌下方两侧颈部，圆环清晰但不科幻，透明度适中，不能遮住皮肤质感和产品边缘。
```

### Hybrid Glow Plus Nodes

Best when the platform makes soft glow too vague.

```text
颈部左右两侧各有一个柔和红橙色热敷节点，节点周围有轻微暖光扩散，位置对应按摩枕两侧接触点。不要大面积红光，不要霓虹，不要把热光放在喉咙正下方。
```

Review note from testing: soft realistic glow preserves premium mood better; controlled ring effect communicates the function faster but can look more graphic. Choose based on whether the image is for emotional lifestyle or feature explanation.
