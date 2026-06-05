# Style Guide

This guide captures the stable visual DNA shared across the current dark massage prompt set.

## Brand Intent

Create Taobao and JD friendly ecommerce images that feel premium, soothing, intimate, and highly intentional. The image should read as a high-end commercial lifestyle still, not a generic AI beauty shot.

## Core Tone

The default tone is low-key warm amber.
- Time window: sunset, dusk, early evening, or warm night interior.
- Exposure: slightly dim, never bright daytime.
- Mood: private, slow, soft, luxurious, restorative.
- Contrast: strong enough to shape form, soft enough to preserve comfort.

Use one of these tone families:
- `sunset-dim amber`: warm sunset through blinds, rich honey-brown shadows.
- `dusk workspace amber`: orange-amber window glow in a calm home office.
- `night lamp amber`: floor-lamp-led intimacy with darker background than subjects.
- `low-key neck-heat amber`: dim cozy interior with product heat as a secondary accent.

## Color System

Keep the environment warm and the product cool enough to pop.

Preferred environment colors:
- caramel
- toffee brown
- walnut wood
- oatmeal beige
- warm cream
- amber honey

Preferred product colors:
- mint green
- sage green
- pale mint green
- dark green piping

Avoid:
- cool gray walls
- blue ambient light
- black leather hero furniture
- green sofas or green decor competing with the product
- neon magenta or sci-fi glow

## Product Rules

The product is always a hero object, even when in use.

Required characteristics:
- bow-tie or hourglass silhouette
- thick plush depth around 8 to 10 cm
- mint or sage green body
- dark green piping
- visible control panel when the scenario allows it
- realistic scale
- realistic compression when supporting body weight

Placement rules:
- Lumbar use: maintain flat contact with the lower back and avoid visible gaps.
- Neck use: show both sides of the pillow when requested; do not crop the side wings.
- Material demo: show the full front surface and clear hand interaction.
- Family scene: keep the body language natural but do not let the product disappear.

Visibility targets by scenario:
- `lumbar sofa side-lean`: around 60 to 65 percent visible.
- `lumbar office chair`: around 55 to 65 percent visible.
- `hero product on sofa beside body`: around 85 to 95 percent visible.
- `neck massage`: both left and right pillow sides visible.
- `material demo on lap`: nearly full front surface visible.

## Model Rules

Default human subject:
- European Caucasian woman
- age 25 to 32
- fair luminous skin
- premium editorial grooming
- calm, natural, non-theatrical beauty styling

Hair variants:
- short dark bob for sofa sunset editorial
- shoulder-length dark hair for office or parent-child scenes
- neat top bun for lying neck-massage scenes

Wardrobe families:
- `satin lounge`: champagne beige satin shirt and matching trousers, visible sheen.
- `smart casual office`: caramel blazer, cream inner layer, light khaki trousers.
- `soft family homewear`: satin for mother, light cream cotton or knit for baby.

## Environment Rules

Use only warm premium home interiors.

Living room anchors:
- caramel velvet sofa
- dark wood or walnut furniture
- horizontal blinds
- floor lamp with warm fabric shade
- white ceramic mug
- neat books or magazines

Home-office anchors:
- deep wood desk
- armless chair or tasteful residential office chair
- laptop and ceramic cup
- framed abstract art in earthy tones
- warm window blinds as the main light source

Avoid:
- kitchens
- bathrooms
- visible appliances
- cheap mesh office chairs
- fluorescent ceilings
- messy clutter

## Lighting Rules

Lighting is the main style engine. Describe it early and explicitly.

Stable lighting behaviors:
- one dominant warm light direction
- strong amber-brown shadows
- soft highlight rolloff on skin and satin
- visible dimensionality on the mint product
- subtle or controlled blind shadows, never harsh graphic stripes unless the scenario specifically wants them

Scene-specific lighting:
- `sunset sofa`: fading golden-hour warmth through blinds, rich caramel shadows.
- `office dusk`: orange-amber side light from window, darker far side of body.
- `night family`: lamp-led warm pool of light on mother and baby, darker surroundings.
- `neck heat`: dim ambient room plus warm glow around massage nodes.

## Camera Rules

Preferred look:
- campaign-grade photorealism
- medium-format feel
- 85 mm equivalent lens feel for lifestyle shots
- shallow depth of field but not total background loss
- 3:4 or 4:5 vertical composition

Common framing patterns:
- medium-wide lifestyle scene with breathing room
- eye-level or slightly high eye-level
- 3/4 body angle for seated use cases
- bust or half-body for neck massage
- high-angle product-on-lap for material demo
- dual-panel composition for comparison or multi-use scenes

## Expression and Pose

Target body language:
- deeply relaxed
- gentle emotional warmth
- elegant but not stiff
- believable in-use comfort

Pose anchors by scene:
- `sofa stretch`: both arms raised, head back, full-body relaxation.
- `office lounge`: one hand near temple, torso leaned back into lumbar support.
- `parent-child`: clear loving eye contact.
- `neck massage`: eyes closed, supine, neck extended naturally.
- `breathable demo`: one hand supports the pillow, one hand presses the surface.

## Quality Lock

Use this quality language consistently:
- 8K RAW photorealistic
- physically accurate lighting
- realistic subsurface scattering on skin
- visible satin sheen
- visible velvet or mesh texture
- no AI smoothing
- no cartoon, CGI, anime, or render look

## Negative Prompt Base

Keep a reusable negative base and then add scene-specific negatives.

Base negatives:
- bright daylight
- overexposed cheerful mood
- cold blue lighting
- clinical office look
- cartoon or 3D render look
- plastic skin
- wrong product color
- square or flat cushion shape
- hidden control panel when it should be visible
- weak product visibility
- cluttered background
- green sofa
- hard midday light

## Writing Strategy

Write prompts as a stack of locks, not as a loose paragraph.
- Start with the strongest non-negotiable visual rule.
- State product visibility with numbers when useful.
- Describe one lighting story only.
- Use exact pose anchors when the scene is sensitive.
- Add a short negative block that targets known failures.

## Current Template Families

The prompt library currently supports these four scenario families:
- sofa sunset lumbar editorial
- home-office dusk lumbar lifestyle
- parent-child warm night relaxation
- neck massage heat glow

Add future prompts by reusing the same tone system and product rules before introducing new scene details.
