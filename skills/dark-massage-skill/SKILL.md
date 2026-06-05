---
name: dark-massage-skill
description: Generate dark warm-toned ecommerce lifestyle images for massage cushions, neck massagers, and similar massage devices used on Taobao or JD product pages. Use when Codex needs to create or refine prompts for amber low-key home scenes, caramel velvet sofas, dusk office relaxation scenes, heat-glow massage visuals, parent-child relaxation scenes, breathable-material demos, or high-end editorial product-in-use images with strong product visibility rules.
---

# Dark Massage Skill

Use this skill to write or refine prompts for a consistent ecommerce image system built around dark warm interiors, amber dusk lighting, mint-green massage products, and premium lifestyle presentation.

Start by reading `references/style-guide.md`.

For prompt drafting, choose the most relevant resource:
- Use `references/prompt-templates.md` for complete English prompt templates.
- Use `references/prompt-templates-zh.md` and `references/prompt-templates-zh-guide.md` when the user wants Chinese prompt drafting or fast manual iteration.
- Use `references/review-and-iteration.md` when reviewing generated images, diagnosing prompt failures, or writing second-pass correction prompts.
- Use `templates/prompt-system-notes.md` when reconciling older source prompts, extracting reusable constraints, or expanding the prompt library.

When writing a prompt:
- Lock the scene to low-key warm amber lighting first.
- Lock the model identity, styling, and mood second.
- Lock the product shape, color, orientation, and visibility third.
- Lock the camera angle and framing fourth.
- Add scene-specific behavior and props last.

Always preserve these system-level rules unless the user explicitly overrides them:
- The scene is warm, dim, intimate, and premium.
- The product is mint or sage green with dark green piping.
- The environment is caramel, toffee, walnut, beige, and amber, not cool gray.
- The image is photorealistic and campaign-ready, never cartoon, CGI, or flat studio-lit.
- The product remains readable and intentionally placed; it must not disappear into the body or background.

Use the prompt template resource that matches the user's requested language to draft prompts by scenario.

Prompt assembly order:
1. Global tone lock
2. Scene identity
3. Model block
4. Product block
5. Environment block
6. Lighting block
7. Composition block
8. Quality lock
9. Negative prompt

If the user gives a rough idea only, pick the closest template from `references/prompt-templates.md` and fill the variables.

If the user gives an existing long prompt, normalize it instead of expanding it wildly:
- remove duplicated instructions
- keep the strongest hard locks
- make visibility and angle rules concrete
- keep one lighting direction
- keep one emotional target

If the user provides generated images for review:
- Judge style stability first: dark warm tone, premium home atmosphere, and product color family.
- Judge product readability second, but account for generation-platform behavior before over-tightening the prompt.
- Judge selling-point communication third: support, heat glow, material rebound, relaxation, or family relief.
- Suggest the smallest second-pass prompt adjustment that targets the visible failure.
- When the user or platform agent needs a runnable result, merge the correction back into the full original prompt instead of returning only patch notes.

Scenario priorities:
- For lumbar support scenes, prioritize body-to-product contact and realistic placement.
- For neck massage scenes, prioritize pillow symmetry, dual-side visibility, and heat position accuracy.
- For breathable-material scenes, prioritize hand interaction, indentation, and fabric readability.
- For parent-child scenes, prioritize emotional eye contact while keeping the product visible.
- For office scenes, prioritize dusk workspace calm and non-corporate warmth.

Do not drift into these failure modes:
- bright cheerful daytime look
- cool blue office lighting
- gray or black product body
- green sofa or green background objects competing with the product
- weak product visibility
- pose stiffness or catalog-like mannequin posture
- cluttered interiors or unrelated appliances
