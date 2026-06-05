# Negative Prompts

Use negative prompts to remove common failure modes, not to add style noise.

## General negatives

- blurry
- low resolution
- distorted product shape
- wrong logo
- fake text
- extra buttons
- extra parts
- duplicated product
- floating product
- unnecessary props
- cluttered background
- oversaturated colors
- cartoon
- CGI
- plastic look

## Product accuracy negatives

- hallucinated logo
- invented structure
- incorrect material
- incorrect color
- broken proportions
- warped edges
- melted geometry

## Brand consistency negatives

- style drift
- unrelated background
- off-brand lighting
- random decorative elements
- mixed visual language

## Commercial negatives

- unreadable product
- hidden product
- product too small
- product cropped too aggressively
- face dominating the frame
- text-heavy layout
## Unified baseline for this skill

Apply these negatives by default unless a shot type clearly needs an exception:

- hallucinated logo
- fake text
- invented structure
- extra buttons
- extra parts
- incorrect material
- incorrect color
- broken proportions
- warped edges
- floating product
- duplicated product
- cluttered background
- unrelated props
- off-brand lighting
- mixed visual language
- cartoon
- CGI
- plastic look
- oversaturated colors
- unreadable product
- hidden product
- face dominating the frame
- text-heavy collage
- over-retouched skin
- exaggerated cyber neon

## People-specific negatives

Use when the shot includes a model:

- teenage male look
- Asian male default casting
- exaggerated bodybuilder physique
- rugged heavy-beard look
- messy long hair
- dramatic laughing expression
- streetwear styling
- flashy accessories
- greasy skin
- mannequin-like skin

## Clothing-specific negatives

- sports vest
- loud pattern shirt
- obvious streetwear branding
- oversized trendy styling
- cluttered layered accessories

## Lighting-specific negatives

- overexposed metal highlights
- dead black shadows
- dirty gray skin tone
- flat lighting with no edge separation
- glowing effects overpowering the product

## Accessory display lighting negatives

Use when generating `配件组合展示图` or premium packaging/accessory still life:

- evenly lit whole image
- overall soft light only
- no tabletop light pool
- no visible light landing area
- unclear center lit area
- flat red background
- red background with no local illumination
- visible light beam
- volumetric light cone
- foggy spotlight beam
- stage followspot

## In-car still life negatives

Use when generating `车载出行图`:

- people in frame
- face in frame
- hands holding product
- active shaving action
- driving action
- driver portrait
- passenger portrait
- steering wheel dominating
- dashboard dominating
- messy car accessories
- cheap rideshare interior
- product hidden in storage pocket
- product too small on car seat
- generic car advertisement
