# Prompt System Notes

This file distills the four current source prompts into reusable constraints.

## Shared Constants

These appeared in all or nearly all prompt sources.

- Premium lifestyle ecommerce look
- Low-key warm amber atmosphere
- European Caucasian female subject
- Mint or sage green massage product as the only cool accent color
- Warm caramel or toffee velvet seating
- Strong product shape control
- Strong rejection of bright daylight and cool lighting
- Photorealistic 8K RAW quality language

## Shared Hard Locks

Use these as non-negotiable defaults.

- Keep the room dim, warm, and intimate.
- Keep the product mint green with dark green piping.
- Keep the product shape hourglass or bow-tie, never square.
- Keep the scene premium, residential, and uncluttered.
- Keep one clear light story only.
- Keep the image campaign-grade and physically plausible.

## Scenario Differences

### Sofa sunset lumbar
- Mood is editorial and indulgent.
- Product visibility is medium-high and placement-sensitive.
- Satin clothing and caramel velvet sofa are major texture cues.
- Blind-shadow texture should stay subtle.

### Office dusk lumbar
- Mood is calm end-of-day relief.
- Product must show zero-gap back contact.
- Window-blind pattern can be slightly more visible.
- Chair choice matters and can easily fail.

### Parent-child night
- Emotional eye contact is a hero requirement.
- Background must be darker than subjects.
- Lamp glow replaces sunset as the main light story.
- Product visibility must survive the interaction.

### Neck heat glow
- Composition is more controlled and technical.
- Both sides of the pillow must be visible.
- Heat placement is part of the function story.
- Pillow scale is more important than environment richness.

### TV binge sofa relaxation
- Evening mood and decompression are the main emotional drivers.
- Remote control and gaze direction support the story.
- Background should feel warm and premium, never busy.

### High-angle lap or abdomen use
- Tactile readability matters more than facial expression.
- The product must feel large, stable, and physically supported.
- Hands must look elegant and believable.

### Material rebound close-up
- Texture and indentation become the hero.
- Environment is secondary.
- Failure risk shifts from lighting to material realism and hand anatomy.

### Lumbar fit comparison split-screen
- Graphic clarity is as important as photorealism.
- Left and right panels must feel stylistically unified.
- The support story should be understood instantly.

## Recurring Failure Modes

These are the mistakes the source prompts repeatedly try to prevent.

- daytime exposure
- cold blue light
- wrong ethnicity or hair length
- product hidden too much
- product shown unrealistically as a separate floating prop
- chair or sofa in the wrong color family
- control panel missing when it should be visible
- pose too stiff or not matching the intended comfort state
- glow effect becoming neon or misplaced
- hand interaction looking stiff or malformed in tactile scenes
- split-screen graphics becoming cheap or medically cold

## What Is Strong Now

The current prompt system now covers:
- hero lifestyle scenes
- office use scenes
- emotional family scenes
- neck heat scenes
- TV relaxation scenes
- top-down lap or abdomen scenes
- tactile rebound close-ups
- support comparison graphics
- short prompts for fast testing

## First Test Readout

Initial generation tests suggest:
- The dark warm premium style lock is stable.
- Neck heat selling-point language communicates well.
- Product readability still needs hard prompt rules, but failures may come from the generation platform's cropping, subject prioritization, or product-shape interpretation.
- The skill should support second-pass correction prompts instead of only full prompt rewrites.
- Platform-agent merging of correction notes into the complete prompt works well when stable blocks are preserved and only product, heat, crop, and negative blocks are changed.

## Recommended Expansion Order

1. Add a straight product-only hero template.
2. Add a Taobao main-image safe template with cleaner background and stronger copy-safe space.
3. Add a batch of approved glow-language variants for different feature claims.
4. Add a Chinese shorthand version of the template system for faster manual editing.
5. Add a versioned library of proven prompts after real generation testing.
6. Add platform-specific adapter notes after repeated tests on each generation platform.
